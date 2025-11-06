import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserAuth,
  getUserData,
} from "../../../users/application/userSlice.js";

import SalesChart from "../components/home/SalesChart.jsx";
import RevenueDisplay from "../components/home/RevenueDisplay";
import RecentOrdersTimeline from "../components/home/RecentOrdersTimeline";
import TopProductsTable from "../components/home/TopProductsTable";
import WelcomeHeader from "../components/home/WelcomeHeader.jsx";
import HomeInProduction from "../components/home/HomeInProduction.jsx";
import { getData } from "@/orders/application/itemSlice.js";
import { getDataProducts } from "@/products/application/productSlice.js";
import { fetchPendingOrders } from "@/sales/application/salesThunks.js";
import DashboardHome from "../components/home/InicioPrueba.jsx";

const Dashboard = () => {
  const username = useSelector((store) => store.users.username);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!username) {
      dispatch(getUserAuth());
    }
  }, [username]);
  

  return (
    <div className="container mx-auto flex flex-col gap-4 p-8">
      <WelcomeHeader />
      <DashboardHome />
      {/* <div className="grid grid-cols-1 gap-6 mb-6 p-4">
        <RevenueDisplay />
      <HomeInProduction />
        <SalesChart />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <RecentOrdersTimeline />
        <TopProductsTable />
      </div> */}
    </div>
  );
};

export default Dashboard;
