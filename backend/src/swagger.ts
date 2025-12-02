import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'iCoachie API',
      version: '1.0.0',
      description: 'API documentation for iCoachie - Multi-tenancy sports coaching platform',
    },
    servers: [
      {
        url: 'http://localhost:4000/api',
        description: 'Local development server',
      },
      {
        url: 'https://api.icoachie.com/api',
        description: 'Production server',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      parameters: {
        PageParam: {
          in: 'query',
          name: 'page',
          schema: { type: 'integer', minimum: 1, default: 1 },
          description: '1-based page index for paginated resources.',
        },
        PageSizeParam: {
          in: 'query',
          name: 'pageSize',
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          description: 'Number of results to return per page (max 100).',
        },
        SearchParam: {
          in: 'query',
          name: 'search',
          schema: { type: 'string' },
          description: 'Case-insensitive search keyword applied to name/description fields.',
        },
        IncludeDeletedParam: {
          in: 'query',
          name: 'includeDeleted',
          schema: { type: 'boolean', default: false },
          description: 'Set true to include soft-deleted rows (admin endpoints only).',
        }
      },
      schemas: {
        StandardResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation completed' },
          },
        },
        PageInfo: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            pageSize: { type: 'integer', example: 20 },
            total: { type: 'integer', example: 120 },
            totalPages: { type: 'integer', example: 6 },
            hasNext: { type: 'boolean', example: true },
            hasPrev: { type: 'boolean', example: false },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: { type: 'array', items: { type: 'object' } },
            pageInfo: { $ref: '#/components/schemas/PageInfo' },
            filtersApplied: {
              type: 'object',
              additionalProperties: true,
              example: { search: 'academy', includeDeleted: false },
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            role: {
              type: 'string',
              enum: ['coach', 'student', 'admin'],
              example: 'coach',
            },
            clubId: {
              type: 'integer',
              nullable: true,
              example: 1,
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'name', 'role'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6,
              example: 'password123',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            role: {
              type: 'string',
              enum: ['coach', 'student', 'admin'],
              example: 'coach',
            },
            display_name: {
              type: 'string',
              example: 'Coach John',
            },
            clubId: {
              type: 'integer',
              example: 1,
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
        Club: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'City Sports Club',
            },
            location: {
              type: 'string',
              example: '123 Main St, City, State',
            },
            description: {
              type: 'string',
              example: 'A premier sports club for athletes of all levels',
            },
            logoUrl: {
              type: 'string',
              example: 'https://example.com/logo.png',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z',
            },
            admin: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  example: 1,
                },
                name: {
                  type: 'string',
                  example: 'John Admin',
                },
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'admin@example.com',
                },
              },
            },
          },
        },
        CreateClubRequest: {
          type: 'object',
          required: ['name', 'adminId'],
          properties: {
            name: {
              type: 'string',
              example: 'City Sports Club',
            },
            location: {
              type: 'string',
              example: '123 Main St, City, State',
            },
            description: {
              type: 'string',
              example: 'A premier sports club for athletes of all levels',
            },
            logoUrl: {
              type: 'string',
              example: 'https://example.com/logo.png',
            },
            adminId: {
              type: 'integer',
              example: 1,
            },
          },
        },
        UpdateClubRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'Updated Club Name',
            },
            location: {
              type: 'string',
              example: '456 New St, City, State',
            },
            description: {
              type: 'string',
              example: 'Updated club description',
            },
            logoUrl: {
              type: 'string',
              example: 'https://example.com/new-logo.png',
            },
          },
        },
        FileMetadata: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            filename: {
              type: 'string',
              example: 'profile-picture.jpg',
            },
            originalName: {
              type: 'string',
              example: 'my-photo.jpg',
            },
            mimeType: {
              type: 'string',
              example: 'image/jpeg',
            },
            size: {
              type: 'integer',
              example: 1024000,
            },
            fileType: {
              type: 'string',
              enum: ['AVATAR', 'DOCUMENT', 'CLUB_LOGO', 'CERTIFICATE', 'OTHER'],
              example: 'AVATAR',
            },
            isPublic: {
              type: 'boolean',
              example: false,
            },
            url: {
              type: 'string',
              example: 'https://example.com/files/1/download',
            },
            uploadedBy: {
              type: 'integer',
              example: 1,
            },
            clubId: {
              type: 'integer',
              nullable: true,
              example: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00.000Z',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/controllers/*.ts', './src/routes/*.ts'], // Path to the API docs
};

const specs = swaggerJSDoc(options);

export { swaggerUi, specs };