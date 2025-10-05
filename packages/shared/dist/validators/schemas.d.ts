import { z } from 'zod';
export declare const addActionSchema: z.ZodObject<{
    actionTypeId: z.ZodString;
    amount: z.ZodNumber;
    date: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    actionTypeId: string;
    amount: number;
    date?: string | undefined;
}, {
    actionTypeId: string;
    amount: number;
    date?: string | undefined;
}>;
export type AddActionDTO = z.infer<typeof addActionSchema>;
//# sourceMappingURL=schemas.d.ts.map