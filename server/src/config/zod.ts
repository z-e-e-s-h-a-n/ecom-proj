import { ZodSchema } from "zod";

export class ValidationError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = "ValidationError";
    this.status = status;
  }
}

export const validateRequest = <T>(schema: ZodSchema<T>, data: any) => {
  const { success, data: safeData, error } = schema.safeParse(data);
  if (!success) {
    const formattedErrors = error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");

    throw new ValidationError(formattedErrors, 400);
  }
  return safeData;
};
