import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
 info: {
      title: "Synapse API",            // API name/title
      version: "1.0.0",                   // Version
      description: "This is a blog site API with posts, comments, and users",
  },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],

  components: {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
  schemas: {
   
    PostResponse: {
      type: "object",
      properties: {
        id: { type: "integer", example: 1 },
        title: { type: "string", example: "My first post" },
        content: { type: "string", example: "Hello world content" },
        authorId: { type: "string", example: "user_123" },
        tags: { type: "array", items: { type: "string" }, example: ["tech"] },
        status: { type: "string", enum: ["DRAFT","PUBLISHED","ARCHIVED"], example: "PUBLISHED" },
        createdAt: { type: "string", format: "date-time", example: "2026-01-06T15:30:00Z" },
        updatedAt: { type: "string", format: "date-time", example: "2026-01-06T15:30:00Z" }
      },
    }
  },
},

  },

apis: ["src/modules/**/*.router.ts"]

};

export default swaggerOptions;
