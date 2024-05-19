import { inject, injectable } from "inversify";
import { IStripeService } from "./stripe.service.interface";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import { ConfigService } from "../config/config.service";
import Stripe from "stripe";

@injectable()
export class StripeService implements IStripeService {
  private stripe: Stripe;

  constructor(
    @inject(TYPES.ILogger) private logger: ILogger,
    @inject(TYPES.ConfigService) private configService: ConfigService
  ) {
    const stripeSecretKey = this.configService.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      this.logger.error("Stripe secret key is not defined in the config.");
    } else {
      this.stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-04-10" });
      this.logger.log("Stripe config is initialized.");
    }
  }

  async createPaymentIntent(
    amount: number,
    currency: string
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      return paymentIntent;
    } catch (error) {
      this.logger.error(`Error creating payment intent: ${error}`);
      throw error;
    }
  }
}
