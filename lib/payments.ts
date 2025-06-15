import Stripe from "stripe";
import { getDbConnection } from "./db";
import { create } from "domain";

export async function handleSubscriptionDeleted({
  subscriptionId,
  stripe,
}: {
  subscriptionId: string;
  stripe: Stripe;
}) {
  console.log("Subscription deleted:", subscriptionId);

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const sql = await getDbConnection();

    await sql`UPDATE users
        SET status= 'inactive'
        WHERE customer_id = ${subscription.customer}`;
    console.log("Subscription cancelled successfully");
  } catch (error) {
    console.error("Error handling subscription deletion:", error);
    throw error;
  }
}

export async function handleCheckoutSessionCompleted({
  session,
  stripe,
}: {
  session: Stripe.Checkout.Session;
  stripe: Stripe;
}) {
  console.log("Checkout session completed:", session.id);
  // Here you can handle the session data, such as saving it to your database
  const customerId = session.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  const priceId = session.line_items?.data[0]?.price?.id;

  if ("email" in customer && priceId) {
    const { email, name } = customer;

    const sql = await getDbConnection();
    // Check if the user already exists
    await createOrUpdateUser({
      sql,
      email: email as string,
      full_name: name as string,
      customerId,
      priceId: priceId as string,
      status: "active",
    });

    await createPayment({
      sql,
      session,
      priceId: priceId as string,
      user_email: email as string,
    });
  }
}

async function createOrUpdateUser({
  sql,
  email,
  full_name,
  customerId,
  priceId,
  status,
}: {
  sql: any;
  email: string;
  full_name: string;
  customerId: string;
  priceId: string;
  status: string;
}) {
  try {
    const sql = await getDbConnection();
    const email = "";
    const user = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (user.length === 0) {
      await sql`INSERT INTO users (email, full_name, customer_id, price_id, status)
            VALUES (${email}, ${full_name}, ${customerId}, ${priceId}, ${status})`;
    }
  } catch (error) {
    console.error("Error creating or updating user:", error);
    throw error;
  }
}

async function createPayment({
  sql,
  session,
  priceId,
  user_email,
}: {
  sql: any;
  session: Stripe.Checkout.Session;
  priceId: string;
  user_email: string;
}) {
  try {
    const { amount_total, id, customer_email, status } = session;
    await sql`INSERT INTO payments (amount_total, status, stripe_payment_id, price_id, user_email)
            VALUES (${amount_total}, ${status}, ${id}, ${priceId}, ${user_email})`;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
}