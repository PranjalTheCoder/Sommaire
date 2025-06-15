import {
  handleCheckoutSessionCompleted,
  handleSubscriptionDeleted,
} from "@/lib/payments";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const POST = async (req: NextRequest) => {
  const payload = await req.json();
  const sig = req.headers.get("stripe-signature") || "";
  let event;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  try {
    event = stripe.webhooks.constructEvent(payload, sig!, endpointSecret);
    switch (event.type) {
      case "checkout.session.completed":
        const sessionId = event.data.object.id;
        // Handle successful checkout session
        // console.log(`Checkout session completed: ${sessionId}`);
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ["line_items"],
        });
        await handleCheckoutSessionCompleted({ session, stripe });
        // You can perform additional actions with the session data here
        break;
      case "customer.subscription.deleted":
        const subscription = event.data.object;
        // Handle subscription deletion
        const subscriptionId = event.data.object.id;

        await handleSubscriptionDeleted({ subscriptionId, stripe });

        console.log(`Subscription deleted: ${subscription.id}`);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to trigger Webhook", err },
      { status: 400 }
    );
  }
  return NextResponse.json({
    status: "success",
  });
};
