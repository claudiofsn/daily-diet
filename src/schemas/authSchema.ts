import { z } from "zod";

export const registerSchema = z.object({
    username: z.string().min(3, "O nome de usuário deve ter pelo menos 3 caracteres"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
});
