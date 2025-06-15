import { isDev } from "./helpers";

export const pricingPlans = [
  {
    name: "Basic",
    price: 9,
    description: "Perfect for occasional use",
    items: [
      "5 PDF summaries per month",
      "Standard processing speed",
      "Email support",
    ],
    id: "basic",
    paymentLink: isDev ? "https://github.com/PranjalTheCoder/Sommaire" : "",
    priceId: isDev ? "price_1N4k2eL5g8z9aB1c2d3e4f5g" : "",
  },
  {
    name: "Premium",
    price: 19,
    description: "For professionals and teams",
    items: [
      "Unlimited PDF summaries",
      "Priority processing",
      "24/7 priority support",
      "Markdown Export",
    ],
    id: "pro",
    paymentLink: isDev ? "https://github.com/PranjalTheCoder/Sommaire" : "",
    priceId: isDev ? "price_1N4k2eL5g8z9aB1c2d3e4f5g" : "",
  },
];
