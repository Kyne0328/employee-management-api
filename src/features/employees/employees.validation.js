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

const employeeIdSchema = z.coerce
    .number({
        error: 'employeeId must be a number.',
    })
    .int({
        error: 'employeeId must be an integer.',
    })
    .positive({
        error: 'employeeId must be greater than zero.',
    });

const positionIdSchema = z.coerce
    .number({
        error: 'positionId must be a number.',
    })
    .int({
        error: 'positionId must be an integer.',
    })
    .positive({
        error: 'positionId must be greater than zero.',
    });

const employeeStatusSchema = z.coerce
    .number({
        error: 'empStatus must be a number.',
    })
    .int({
        error: 'empStatus must be an integer.',
    })
    .refine((value) => value === 0 || value === 1, {
        error: 'empStatus must be either 0 or 1.',
    });

function isValidDateString(dateString) {
    const date = new Date(`${dateString}T00:00:00Z`);

    return (!Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === dateString);
}


const employeeJoinDateSchema = z
    .string({
        error: 'empJoinDate must be a string.',
    })
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
        error: 'empJoinDate must use YYYY-MM-DD format.',
    })
    .refine(isValidDateString, {
        error: 'empJoinDate must be a valid calendar date.',
    });

const createEmployeeBodySchema = z.object({
    body: z
        .object({
            firstName: employeeNameSchema,
            lastName: employeeNameSchema,
            positionId: positionIdSchema,
            empStatus: employeeStatusSchema.default(1),
            empJoinDate: employeeJoinDateSchema,
        })
        .strict({}),
});

const updateEmployeeBodySchema = z
    .object({
        firstName: employeeNameSchema,
        lastName: employeeNameSchema,
        positionId: positionIdSchema,
        empStatus: employeeStatusSchema,
        empJoinDate: employeeJoinDateSchema,
    })
    .strict();

const employeeParamsSchema = z
    .object({
        employeeId: employeeIdSchema,
    })
    .strict();

const createEmployeeSchema = z.object({
    body: createEmployeeBodySchema,
});

const updateEmployeeSchema = z.object({
    params: employeeParamsSchema,
    body: updateEmployeeBodySchema,
});

const deleteEmployeeSchema = z.object({
    params: employeeParamsSchema,
});

module.exports = {
    createEmployeeSchema,
    updateEmployeeSchema,
    deleteEmployeeSchema,
};