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

    // Calculate total amount
    const totalAmount = products.reduce((sum, p) => sum + Number(p.price), 0);

    // Save order in DB
    const order = Order.create({
      user,
      products,
      totalAmount,
    });
    await order.save();

    // Create Stripe Payment Intent with orderId in metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // convert to cents
      currency: "usd",
      payment_method_types: ["card"],
      metadata: {
        userId,
        orderId: order.id, // <-- added orderId
        products: JSON.stringify(products),
      },
    });

    return res.status(201).json({
      orderId: order.id,
      clientSecret: paymentIntent.client_secret,
      totalAmount,
    });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
