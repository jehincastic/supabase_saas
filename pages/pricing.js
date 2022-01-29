import initStripe from "stripe";
import { useUser } from "../provider/user";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";

const Pricing = ({ plans }) => {
  const { user, login, loading } = useUser();
  const showSubBtn = !!user && !user.is_subscribed;
  const showCreateBtn = !user;
  const mngSubBtn = !!user && user.is_subscribed;
  const processSub = (planId) => async () => {
    const { data } = await axios.get(`/api/subscription/${planId}`);
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
    await stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-16 flex justify-around">
      {
        plans.map(plan => (
          <div
            key={plan.id}
            className="w-80 h-40 rounded shadow px-6 py-2"
          >
            <h2 className="text-xl">{plan.name}</h2>
            <p className="text-gray-500">{plan.price / 100} / {plan.interval}</p>
            {
              !loading && (
                <div>
                  {showSubBtn && <button onClick={processSub(plan.id)}>Subscribe</button>}
                  {showCreateBtn && <button onClick={login}>Create Account</button>}
                  {mngSubBtn && (
                    <Link href="/dashboard">
                      <a>
                        Manage Subscription
                      </a>
                    </Link>
                  )}
                </div>
              )
            }
          </div>
        ))
      }
    </div>
  );
};

export const getStaticProps = async () => {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const { data: prices } = await stripe.prices.list();
  
  const getProduct = async (price) => {
    const product = await stripe.products.retrieve(price.product);
    return {
      id: price.id,
      name: product.name,
      price: price.unit_amount,
      interval: price.recurring.interval,
      currency: price.currency,
    };
  };
  
  const unsortedPlans = await Promise.all(prices.map(p => getProduct(p)));

  const plans = unsortedPlans.sort((a, b) => a.price - b.price);

  return {
    props: {
      plans,
    },
  }
};

export default Pricing;
