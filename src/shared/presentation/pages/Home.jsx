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

const Dashboard = () => {
  const username = useSelector((store) => store.users.username);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!username) {
      dispatch(getUserAuth());
      //CARGA DE DATOS AL INICIAR SESION
      dispatch(getUserData());//CONTACTOS
      dispatch(getDataProducts())//PRODUCTOS
      dispatch(fetchPendingOrders())//ORDENES NO CERRADAS
      dispatch(getData());//ITEMS
    }
  }, [username]);
  

  return (
    <div className="container mx-auto p-8 scale-95">
      <WelcomeHeader />
      <HomeInProduction />
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4">
        <SalesChart />
        <RevenueDisplay />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <RecentOrdersTimeline />
        <TopProductsTable />
      </div> */}
    </div>
  );
};

export default Dashboard;
