export const corsConfig = {
  origin: ['http://localhost:3000','https://nuance-daily.vercel.app','https://example.com',"https://postella-beta.vercel.app"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
};
