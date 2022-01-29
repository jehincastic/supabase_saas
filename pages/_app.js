import "../styles/globals.css";
import UserProvider from "../provider/user";
import Navbar from "../components/nav";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Navbar />
      <Component {...pageProps} />
    </UserProvider>
  )
}

export default MyApp;
