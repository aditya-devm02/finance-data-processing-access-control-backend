import { z } from "zod";

const roleEnum = z.enum(["VIEWER", "ANALYST", "ADMIN"]);
const statusEnum = z.enum(["ACTIVE", "INACTIVE"]);

export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one number"),
  role: roleEnum,
  status: statusEnum.default("ACTIVE"),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    email: z.email().optional(),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, "Password must include at least one uppercase letter")
      .regex(/[a-z]/, "Password must include at least one lowercase letter")
      .regex(/[0-9]/, "Password must include at least one number")
      .optional(),
    role: roleEnum.optional(),
    status: statusEnum.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });
