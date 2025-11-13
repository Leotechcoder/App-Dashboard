
import WelcomeHeader from "../components/home/WelcomeHeader.jsx";
import SalesDashboardHome from "../components/home/SalesDashboardHome.jsx";

const Dashboard = () => {  

  return (
    <div className="container mx-auto flex flex-col gap-2 pl-8">
      <WelcomeHeader />
      <SalesDashboardHome />
    </div>
  );
};

export default Dashboard;
