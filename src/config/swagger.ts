import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description:
        "ECODE Technical Test - Task Management API with JWT authentication, real-time notifications, and email alerts",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT access token",
        },
      },
      schemas: {
        Task: {
          type: "object",
          required: ["id", "title", "status", "createdAt", "updatedAt"],
          properties: {
            id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            title: {
              type: "string",
              example: "Complete project documentation",
            },
            description: {
              type: "string",
              example: "Write comprehensive API documentation",
            },
            status: {
              type: "string",
              enum: ["todo", "in-progress", "completed"],
              example: "todo",
            },
            dueDate: {
              type: "string",
              format: "date-time",
              nullable: true,
              example: "2026-03-15T10:00:00.000Z",
            },
            closedAt: {
              type: "string",
              format: "date-time",
              nullable: true,
              example: null,
            },
            lastReminderSentAt: {
              type: "string",
              format: "date-time",
              nullable: true,
              example: "2026-02-28T18:35:00.679Z",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-02-28T10:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-02-28T10:00:00.000Z",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            fullName: {
              type: "string",
              example: "John Doe",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  example: "VALIDATION_ERROR",
                },
                message: {
                  type: "string",
                  example:
                    "Validation failed: title String must contain at least 1 character(s)",
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication and authorization endpoints",
      },
      {
        name: "Tasks",
        description: "Task management CRUD operations",
      },
    ],
  },
  // Path to the API docs
  apis: ["./src/routes/*.ts", "./src/models/*.ts"],
};

export const specs = swaggerJsdoc(options);
