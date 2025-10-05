"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addActionSchema = void 0;
const zod_1 = require("zod");
exports.addActionSchema = zod_1.z.object({
    actionTypeId: zod_1.z.string().min(1),
    amount: zod_1.z.number().positive(),
    date: zod_1.z.string().optional()
});
