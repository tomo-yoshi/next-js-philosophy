import { z } from 'zod';

export const todoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  completed: z.boolean(),
  createdAt: z.string().datetime(),
});

export type TodoSchema = z.infer<typeof todoSchema>;

export const todoUpdateSchema = z.object({
  id: z.string().uuid(),
  completed: z.boolean(),
});

export const todoDeleteSchema = z.object({
  id: z.string().uuid(),
}); 