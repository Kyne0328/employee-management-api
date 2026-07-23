require('dotenv/config');

const z = require('zod');

const environmentSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),

    PORT: z.coerce
        .number({ error: 'PORT must be a number' })
        .int({ error: 'PORT must be an integer' })
        .min(1, { error: 'PORT must be between 1 and 65535' })
        .max(65535, { error: 'PORT must be between 1 and 65535' })
        .default(5000),

    CLIENT_ORIGIN: z
        .string()
        .trim()
        .refine((value) => URL.canParse(value), {
            error: 'CLIENT_ORIGIN must be a valid URL'
        })
        .default('http://localhost:5173')
});

const result = environmentSchema.safeParse(process.env);

if (!result.success) {
    const details = result.error.issues
        .map((issue) => {
            const field = issue.path.join('.') || 'environment';
            return `${field}: ${issue.message}`;
        })
        .join(';');

    throw new Error(`Environment variables validation failed: ${details}`);
}

const env = Object.freeze(result.data);

module.exports = {
    env,
    environmentSchema
};