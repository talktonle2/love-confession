import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Home from "../pages/Home.jsx";
import Create from "../pages/Create.jsx";
import Feed from "../pages/Feed.jsx";
import Confession from "../pages/Confession.jsx";
import NotFound from "../pages/NotFound.jsx";
import Subscription from "../pages/Subscription.jsx";
import Payment from "../pages/Payment.jsx";
import Match from "../pages/Match.jsx";
import Chat from "../pages/Chat.jsx";
import Statistics from "../pages/Statistics.jsx";
import Favorites from "../pages/Favorites.jsx";
import WhoLikedYou from "../pages/WhoLikedYou.jsx";
import Coins from "../pages/Coins.jsx";
import CreatorProfile from "../pages/CreatorProfile.jsx";
import Profile from "../pages/Profile.jsx";
import Settings from "../pages/Settings.jsx";
import About from "../pages/About.jsx";
import Contact from "../pages/Contact.jsx";
import Help from "../pages/Help.jsx";
import Community from "../pages/Community.jsx";
import Security from "../pages/Security.jsx";
import Privacy from "../pages/Privacy.jsx";
import PageTitle from "../components/PageTitle.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import ScrollToTop from "../components/ScrollToTop.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";

export default function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-white">
        <PageTitle />
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/match" element={<Match />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/help/community" element={<Community />} />
          <Route path="/security" element={<Security />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/c/:id" element={<Confession />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/payment/:planId" element={<Payment />} />
          <Route path="/payment/coins/:packageId" element={<Payment />} />
          <Route path="/payment/coffee/:orderId" element={<Payment />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/who-liked-you" element={<WhoLikedYou />} />
          <Route path="/coins" element={<Coins />} />
          <Route path="/creator/:id" element={<CreatorProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}
