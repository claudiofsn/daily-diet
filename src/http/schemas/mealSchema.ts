import { z } from "zod";

export const mealSchema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    description: z.string().min(5, "A descrição deve ter pelo menos 5 caracteres"),
    datetime: z.coerce.date(),
    is_on_diet: z.boolean(),
});
