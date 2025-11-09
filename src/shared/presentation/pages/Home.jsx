import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserAuth,
} from "../../../users/application/userSlice.js";

import WelcomeHeader from "../components/home/WelcomeHeader.jsx";
import SalesDashboardHome from "../components/home/SalesDashboardHome.jsx";

const Dashboard = () => {
  const username = useSelector((store) => store.users.username);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!username) {
      dispatch(getUserAuth());
      dispatch()
    }
  }, [username]);
  

  return (
    <div className="container mx-auto flex flex-col gap-4 p-8">
      <WelcomeHeader />
      <SalesDashboardHome />
    </div>
  );
};

export default Dashboard;
