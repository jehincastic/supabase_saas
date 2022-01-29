import Link from "next/link";
import { useUser } from "../provider/user";

const Navbar = () => {
  const { user } = useUser();
  return (
    <nav className="flex py-4 px-6 border-b boder-gray-200">
      <Link href="/">
        <a>Home</a>
      </Link>
      {
        !!user && (
          <Link href="/dashboard">
            <a className="ml-2">Dashboard</a>
          </Link>
        )
      }
      <Link href="/pricing">
        <a className="ml-2">Pricing</a>
      </Link>
      <div className="ml-auto">
        <Link href={user ? "/logout" : "/login"}>
          <a>{user ? "Logout" : "Login"}</a>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;