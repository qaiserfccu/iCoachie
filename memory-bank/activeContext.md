# Active Context (Updated 2025-12-02)

## Current Goals

- Card 15 – Frontend screen completion: keep role screen inventory synced with new role answers and immediately implement finalized experiences (e.g., new `frontend/app/system-support` route for SYSTEM_SUPPORT).
- Card 19 – Facility/Venue/Ground DTO expansion: blocked behind dependencies (Cards 20–24) tracked in `docs/backend/dto/facility-metadata-expansion.md`; resume DTO updates once those complete.
- Maintain Kanban (`.vscode/vscode-kanban.json`) accuracy: Cards 15, 19, 20–24 in-progress; remaining backlog untouched.
- Preserve documentation context (`docs/frontend/role-screen-inventory.md`, `docs/backend/global-endpoint-matrix.md`, DTO plan) and ensure helper outputs keep flowing into repo.

## Current Blockers

- Card 19 cannot proceed until dependent backend cards (20–24) finish; helper agent currently executing them sequentially.
- Card 15 awaits further role-specific answers for remaining 20 roles; only SUPER_ADMIN and SYSTEM_SUPPORT have complete data.
- No backend ticketing/diagnostics APIs exist yet, so new System Support UI runs with mock data until dependencies deliver endpoints.