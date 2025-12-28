import { z } from "zod";

/**
 * Waitlist form validation schema
 */
export const WaitlistFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "First name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{10}$/.test(val), "Phone number must be exactly 10 digits"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
});

export type WaitlistFormData = z.infer<typeof WaitlistFormSchema>;

/**
 * Validate form data and return errors if any
 */
export function validateWaitlistForm(data: Partial<WaitlistFormData>) {
  const result = WaitlistFormSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data, errors: null };
  }

  // Convert Zod errors to a simple field -> message map
  const errors: Partial<Record<keyof WaitlistFormData, string>> = {};
  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as keyof WaitlistFormData;
    if (!errors[field]) {
      errors[field] = issue.message;
    }
  });

  return { success: false, data: null, errors };
}
