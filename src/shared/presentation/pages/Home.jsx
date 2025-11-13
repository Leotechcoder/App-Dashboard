
import WelcomeHeader from "../components/home/WelcomeHeader.jsx";
import SalesDashboardHome from "../components/home/SalesDashboardHome.jsx";

const Dashboard = () => {  

  return (
    <div className="container mx-auto flex flex-col gap-4 py-8 pl-10 pr-4">
      <WelcomeHeader />
      <SalesDashboardHome />
    </div>
  );
};

export default Dashboard;
