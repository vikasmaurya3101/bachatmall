import { z } from "zod";

export const CheckoutDto = z.object({
  addressId: z.string().cuid(),
  paymentMethod: z.enum(["COD", "RAZORPAY", "UPI"]).default("COD"),
});

export type CheckoutDtoType = z.infer<typeof CheckoutDto>;
