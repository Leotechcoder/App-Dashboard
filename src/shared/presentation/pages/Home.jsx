import WelcomeHeader from "../components/home/WelcomeHeader.jsx";
import SalesDashboardHome from "../components/home/SalesDashboardHome.jsx";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useScrollTo } from "@/shared/hook/useScrollTo.js";

const Dashboard = () => {

  useEffect(() => {
    window.scrollTo({ behavior: "smooth" });    
  }, [])
  
  return (
    <div className="container mx-auto flex flex-col gap-2 bg-gray-100">
      <AnimatePresence mode="wait">
        <WelcomeHeader key="welcome" />
        <SalesDashboardHome key="home" />
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
