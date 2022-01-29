import initStripe from "stripe";
import { buffer } from "micro";
import { getServiceSupabase } from "../../utils/supabase";

export const config = {
  api: {
    bodyParser: false
  }
};

const handler = async (req, res) => {
  const supabase = getServiceSupabase();
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers["stripe-signature"];
  const signingSecret = process.env.STRIPE_SIGNING_SECRET;
  const reqBuffer = await buffer(req);
  try {
    const event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret);
    switch (event.type) {
      case "customer.subscription.updated":
        await supabase
          .from("profile")
          .update({
            is_subscribed: true,
            interval: event.data.object.items.data[0].plan.interval,
          })
          .eq("stripe_customer", event.data.object.customer);
          break;
      case "customer.subscription.deleted":
        await supabase
          .from("profile")
          .update({
            is_subscribed: false,
            interval: null,
          })
          .eq("stripe_customer", event.data.object.customer);
          break;
    }
    res.send({ received: true });
  } catch (err) {
    console.error(err);
    res.status(400).send(`Webook Err: ${err.message}`);
  }
};

export default handler;
