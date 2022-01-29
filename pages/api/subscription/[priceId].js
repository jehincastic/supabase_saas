import cookie from "cookie";
import initStripe from "stripe";
import { supabase } from "../../../utils/supabase";

const handler = async (req, res) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }
  const token = cookie.parse(req.headers.cookie)["sb:token"];
  supabase.auth.session = () => ({ access_token: token });
  const { data: { stripe_customer } } = await supabase
    .from("profile")
    .select("stripe_customer")
    .eq("id", user.id)
    .single();
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const { priceId } = req.query;
  const lineItem = [{
    price: priceId,
    quantity: 1,
  }];

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: stripe_customer,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: lineItem,
    success_url: "http://localhost:3000/payment/success",
    cancel_url: "http://localhost:3000/payment/cancelled",
  });

  res.send({
    id: checkoutSession.id,
  });
};

export default handler;
