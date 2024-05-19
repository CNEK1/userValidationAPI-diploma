import Stripe from "stripe";

export interface IStripeService {
  createPaymentIntent(
    amount: number,
    currency: string
  ): Promise<Stripe.PaymentIntent>;
}
