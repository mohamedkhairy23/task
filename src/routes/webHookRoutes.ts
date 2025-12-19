import express, { Request, Response } from "express";
import Stripe from "stripe";
import { Order, OrderStatus } from "../entities/Order.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: "2025-12-15.clover",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      if (orderId) {
        const order = await Order.findOne({ where: { id: orderId } });
        if (order) {
          order.status = OrderStatus.PAID;
          await order.save();
          console.log(`Order ${order.id} marked as PAID`);
        }
      }
    }

    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      if (orderId) {
        const order = await Order.findOne({ where: { id: orderId } });
        if (order) {
          order.status = OrderStatus.FAILED;
          await order.save();
          console.log(`Order ${order.id} marked as FAILED`);
        }
      }
    }

    res.json({ received: true });
  }
);

export default router;
