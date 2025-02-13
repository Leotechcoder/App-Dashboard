import Sidebar from "../components/Sidebar.jsx";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAuth } from "../../../users/application/userSlice.js";

const RootLayout = () => {

  const username = useSelector(store=>store.users.username)
  const dispatch = useDispatch()
  useEffect(() => {
    if(!username){
      dispatch(getUserAuth())
    }
  }, [username, dispatch])


  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <div className=" p-4">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 ms-8 bg-gray-200 p-5">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white text-center py-4">
        <Footer />
      </div>
    </>
  );
};

export default RootLayout;

