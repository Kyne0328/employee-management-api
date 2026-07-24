const z = require('zod');

const employeeNameSchema = z
    .string({
        error: 'Employee name must be a string',
    })
    .trim()
    .min(1, {
        error: 'Employee name is required',
    })
    .max(100, {
        error: 'Employee name must be at most 100 characters long',
    });

function isValidDateString(dateString) {
    const date = new Date(`${dateString}T00:00:00Z`);
    return (!Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === dateString);
}

const createEmployeeSchema = z.object({
    body: z
        .object({
            firstName: employeeNameSchema,
            lastName: employeeNameSchema,

            positionId: z.coerce.number({ error: 'Position ID must be a number' })
                .int({ error: 'Position ID must be an integer' })
                .positive({ error: 'Position ID must be a positive number' }),

            empStatus: z.coerce.number({ error: 'Employee status must be a number' })
                .int({ error: 'Employee status must be an integer' })
                .refine((value) => value === 0 || value === 1, {
                    error: 'Employee status must be either 0 (inactive) or 1 (active)',
                }),
            empJoinDate: z.string({ error: 'Employee join date must be a string' })
                .trim()
                .refine((value) => isValidDateString(value), {
                    error: 'Employee join date must be a valid date in YYYY-MM-DD format'
                }),
        })
        .strict({}),
});

module.exports = {
    createEmployeeSchema,
};