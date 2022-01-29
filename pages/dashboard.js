import axios from "axios";
import { useRouter } from "next/router";
import { useUser } from "../provider/user";
import { supabase } from "../utils/supabase";

const Dashboard = () => {
  const { user, loading } = useUser();
  const router = useRouter();
  const loadPortal = async () => {
    const { data } = await axios.get("/api/portal");
    router.push(data.url);
  };

  return (
    <div className="w-full max-2-3xl mx-auto py-16 px-8">
      <h1 className="text-3xl mb-6">Dashboard</h1>
      {
        !loading && (
          <>
            <p>
              {
                user?.is_subscribed
                  ? `Subscribed: ${user.interval}`
                  : "Not subscribed"
              }
            </p>
            <button onClick={loadPortal} className="mt-6">Manage Subscription</button>
          </>
        )
      }
    </div>
  );
};

export const getServerSideProps = async ({ req }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }, 
      props: {},
    };
  }
  return {
    props: {
      user,
    },
  }
};

export default Dashboard;
