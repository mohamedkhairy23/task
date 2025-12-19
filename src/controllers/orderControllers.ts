import { Request, Response } from "express";
import { Order } from "../entities/Order.js";
import { User } from "../entities/User.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: "2025-12-15.clover",
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const products: { productId: string; price: number }[] = req.body.products;

    if (!products || !products.length) {
      return res.status(400).json({ message: "No products provided" });
    }

    const user = await User.findOne({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const totalAmount = products.reduce((sum, p) => sum + Number(p.price), 0);

    const order = Order.create({
      user,
      products,
      totalAmount,
    });
    await order.save();

    // Create Stripe Checkout Session
    const lineItems = products.map((p) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `Product ${p.productId}`,
        },
        unit_amount: Math.round(p.price * 100), // cents
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success?orderId=${order.id}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel?orderId=${order.id}`,
      metadata: {
        orderId: order.id,
        userId,
      },
    });

    return res.status(201).json({
      orderId: order.id,
      url: session.url,
      totalAmount,
    });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
