import { z } from "zod";

// runtime validation
export const createPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  thumbnail: z.string().url().optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  tags: z.array(z.string()).optional(),
  viwes: z.number().int().optional(),
  authorId: z.string(),
});



// inferred type for service layer
export type CreatePostInput = z.infer<typeof createPostSchema>;
