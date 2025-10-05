import { z } from 'zod';

export const addActionSchema = z.object({
    actionTypeId: z.string().min(1),
    amount: z.number().positive(),
    date: z.string().optional()
});

export type AddActionDTO = z.infer<typeof addActionSchema>;
