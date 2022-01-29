import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { supabase } from "../utils/supabase";
import axios from "axios";

const Context = createContext();

const provider = ({ children }) => {
  const [user, setUser] = useState(supabase.auth.user());
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getUserProfile = async () => {
    const sessionUser = await supabase.auth.user();
    if (sessionUser) {
      const { data: profile } = await supabase
        .from("profile")
        .select("*")
        .eq("id", sessionUser.id)
        .single();
      setUser({ ...sessionUser, ...profile });
    }
    setLoading(false);
  };

  useEffect(() => {
    getUserProfile();
    supabase.auth.onAuthStateChange(() => {
      setUser(supabase.auth.user());
      getUserProfile();
    });
  }, []);

  useEffect(() => {
    axios.post("/api/set-supabase-cookie", {
      event: user ? "SIGNED_IN" : "SIGNED_OUT",
      session: supabase.auth.session(),
    });
  }, [user])

  useEffect(() => {
    if (user) {
      const sub = supabase
        .from(`profile:id=eq.${user.id}`)
        .on("UPDATE", payload => {
          debugger;
          setUser({ ...user, ...payload.new });
        })
        .subscribe();
      return () => {
        supabase.removeSubscription(sub);
      }
    }
  }, [user])

  const login = async () => {
    await supabase.auth.signIn({
      provider: "github",
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  const value = {
    user,
    logout,
    login,
    loading,
  };

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
};

export const useUser = () => useContext(Context);

export default provider;
