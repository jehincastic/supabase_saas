import { useEffect } from "react";
import { useUser } from "../provider/user";

const LogOut = () => {
  const { logout } = useUser();  
  useEffect(logout, []);
  
  return (
    <p>Logging Out...</p>
  );
};

export default LogOut;
