import { loadStripe } from '@stripe/stripe-js';

export const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const getStripe = () => {
  if (!stripe) {
    throw new Error('Stripe failed to initialize');
  }
  return stripe;
};
