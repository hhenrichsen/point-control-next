import * as z from "zod";

export const createGameSchema = z.object({
  title: z.string(),
  description: z.string(),
  location: z.string(),
  public: z.boolean().optional(),
  approval: z.boolean().optional(),
});

export type CreateGame = z.infer<typeof createGameSchema>;

export interface PublicGame {
  id: string;
  slug: string;
  name: string;
  description: string;
  location: string;
  created: Date;
  updated: Date;
}
