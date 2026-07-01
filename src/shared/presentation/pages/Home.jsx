import WelcomeHeader from "../components/home/WelcomeHeader.jsx";
import { OperationCenter } from "../components/home/OperationCenter.jsx";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useScrollTo } from "@/shared/hook/useScrollTo.js";

const Dashboard = () => {

  useEffect(() => {
    window.scrollTo({ behavior: "smooth" });    
  }, [])
  
  return (
    <div className="container mx-auto flex flex-col gap-2 rounded-xl">
      <AnimatePresence mode="wait">
        <WelcomeHeader key="welcome" />
        <OperationCenter key="operation-center" />
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
