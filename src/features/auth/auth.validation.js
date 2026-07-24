const z = require('zod');

const usernameSchema = z
    .string({
        error: 'Username must be a string',
    })
    .trim()
    .min(3, {
        error: 'Username must be at least 3 characters long',
    })
    .max(50, {
        error: 'Username must be at most 50 characters long',
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
        error:
            'Username may contain only letters, numbers, and underscores.',
    })
    .transform((username) => username.toLowerCase());

const passwordSchema = z
    .string({
        error: 'Password must be a string',
    })
    .min(8, {
        error: 'Password must be at least 8 characters long',
    })
    .max(128, {
        error: 'Password must be at most 128 characters long',
    });

const registerSchema = z.object({
    body: z
        .object({
            username: usernameSchema,
            password: passwordSchema,
        })
        .strict(),
});

const loginSchema = z.object({
    body: z
        .object({
            username: usernameSchema,
            password: passwordSchema,
        })
        .strict(),
});

module.exports = {
    loginSchema,
    registerSchema,
}