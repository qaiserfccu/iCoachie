import { Request, Response, NextFunction } from 'express';
import prisma from '../db';
import { AuthRequest } from './jwtAuth';

type RoleScope = 'GLOBAL' | 'CLUB' | 'FACILITY' | 'VENUE' | 'GROUND' | 'INDEPENDENT' | 'USER' | string;

interface AccessRole {
  code?: string;
  name?: string;
  scope?: RoleScope | null;
  permissions?: unknown | null;
}

interface UserAccess {
  primaryRole?: AccessRole | null;
  allRoleCodes: string[];
}

async function loadUserAccess(userId: number): Promise<UserAccess | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      primaryRole: {
        select: {
          code: true,
          name: true,
          scope: true,
          // permissions might be JSON or string; select if exists in schema
          permissions: true as any
        }
      },
      userRoles: {
        select: {
          role: { select: { code: true, name: true } }
        }
      }
    }
  });

  if (!user) return null;

  const allRoleCodes = [
    ...new Set([
      user.primaryRole?.code,
      ...user.userRoles.map((ur: any) => ur.role?.code)
    ].filter(Boolean) as string[])
  ];

  return {
    primaryRole: user.primaryRole as AccessRole | undefined,
    allRoleCodes
  };
}

function toArray<T>(v: T | T[]): T[] {
  return Array.isArray(v) ? v : [v];
}

function flattenPermissions(perms: unknown): Set<string> {
  // Returns a set of permission keys like 'manageVenue' or 'venue.manage'
  const result = new Set<string>();
  let value = perms as any;
  if (!value) return result;

  if (typeof value === 'string') {
    try { value = JSON.parse(value); } catch { /* keep as string */ }
  }

  if (Array.isArray(value)) {
    for (const p of value) {
      if (typeof p === 'string') result.add(p);
    }
    return result;
  }

  if (typeof value === 'object') {
    const walk = (obj: any, prefix = '') => {
      for (const [k, v] of Object.entries(obj)) {
        const key = prefix ? `${prefix}.${k}` : k;
        if (v && typeof v === 'object') walk(v, key);
        else if (v === true || v === 'true' || v === 1) result.add(key);
        else if (typeof v === 'string') result.add(v);
      }
    };
    walk(value);
  }
  return result;
}

const scopeRank: Record<string, number> = {
  GLOBAL: 6,
  CLUB: 5,
  FACILITY: 4,
  VENUE: 3,
  GROUND: 2,
  USER: 1,
  INDEPENDENT: 1
};

function hasScope(userScope?: string | null, required: string): boolean {
  if (!required) return true;
  if (!userScope) return false;
  const u = scopeRank[userScope] ?? 0;
  const r = scopeRank[required] ?? 0;
  // allow equal or higher privilege to pass
  return u >= r;
}

export function requireRole(roles: string | string[]) {
  const allowed = new Set(toArray(roles));
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const access = await loadUserAccess(userId);
      if (!access) return res.status(401).json({ message: 'Unauthorized' });

      // Prefer primaryRole; fallback to any assigned role codes
      const primaryCode = access.primaryRole?.code;
      if (primaryCode && allowed.has(primaryCode)) return next();

      for (const code of access.allRoleCodes) {
        if (allowed.has(code)) return next();
      }

      return res.status(403).json({ message: 'Forbidden' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal error' });
    }
  };
}

export function requireAnyRole(roleCodes: string[]) {
  const allowed = new Set(roleCodes);
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const access = await loadUserAccess(userId);
      if (!access) return res.status(401).json({ message: 'Unauthorized' });

      if (access.primaryRole?.code && allowed.has(access.primaryRole.code)) return next();
      for (const code of access.allRoleCodes) {
        if (allowed.has(code)) return next();
      }

      return res.status(403).json({ message: 'Forbidden' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal error' });
    }
  };
}

export function requirePermission(permission: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const access = await loadUserAccess(userId);
      if (!access?.primaryRole) return res.status(401).json({ message: 'Unauthorized' });

      const perms = flattenPermissions(access.primaryRole.permissions);
      if (perms.has(permission)) return next();

      // Also allow dot-prefix matching: e.g., required 'venue.manage' satisfied by 'venue.manage.*'
      const candidates = [...perms];
      if (candidates.some(p => p === '*' || p === `${permission}.*`)) return next();

      return res.status(403).json({ message: 'Forbidden' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal error' });
    }
  };
}

export function requireScope(scope: RoleScope | RoleScope[]) {
  const required = toArray(scope);
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const access = await loadUserAccess(userId);
      const userScope = access?.primaryRole?.scope ?? null;
      if (!userScope) return res.status(403).json({ message: 'Forbidden' });

      for (const s of required) {
        if (hasScope(userScope, s)) return next();
      }

      return res.status(403).json({ message: 'Forbidden' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal error' });
    }
  };
}

export type { RoleScope };
