import { z } from "zod";

export const SellerOnboardingSchema = z.object({
  businessName: z.string().trim().min(3).max(255),
  gstNumber: z
    .string()
    .trim()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GST number format"
    )
    .optional()
    .or(z.literal("")),
});

export type SellerOnboardingInput = z.infer<typeof SellerOnboardingSchema>;
