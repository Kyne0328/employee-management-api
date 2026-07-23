require('dotenv/config');

const z = require('zod');

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  PORT: z.coerce
    .number({error: 'PORT must be a number.'})
    .int({error: 'PORT must be an integer.'})
    .min(1, {error: 'PORT must be between 1 and 65535.'})
    .max(65535, {error: 'PORT must be between 1 and 65535.'})
    .default(5000),

  CLIENT_ORIGIN: z
    .string()
    .trim()
    .refine((value) => URL.canParse(value), {
      error: 'CLIENT_ORIGIN must be a valid URL.',
    })
    .default('http://localhost:5173'),

  DATABASE_URL: z
    .string({error: 'DATABASE_URL is required.'})
    .trim()
    .min(1, {error: 'DATABASE_URL is required.'})
    .refine((value) => URL.canParse(value), {
      error: 'DATABASE_URL must be a valid PostgreSQL URL.',
    }),
});

const result = environmentSchema.safeParse(process.env);

if (!result.success) {
  const details = result.error.issues
    .map((issue) => {
      const field = issue.path.join('.') || 'environment';
      return `${field}: ${issue.message}`;
    })
    .join('; ');

  throw new Error(`Invalid server environment: ${details}`);
}

const env = Object.freeze(result.data);

module.exports = {
  env,
  environmentSchema,
};
