"use client";

import {useNavigate, Link, NavLink } from "react-router-dom";
import { PATH } from "../../../shared/infrastructure/utils/PATH.js";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../../../users/application/userSlice.js";
import {
  FingerprintIcon as FiHome,
  MailIcon as FiMail,
  ShoppingCartIcon as FiShoppingCart,
  FileBoxIcon as FiBox,
  LogOutIcon as FiLogOut,
} from "lucide-react";
import { CheckCheckIcon as CiMoneyCheck1 } from "lucide-react";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((store) => store.users);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleMouseEnter = () => setIsExpanded(true);
  const handleMouseLeave = () => setIsExpanded(false);

  const navigate = useNavigate();
  useEffect(() => {
    if(!user){
      setTimeout(() => {
      navigate("/");
    }, 1000);
    }
  }, [user, navigate]);
  

  const handleClick = () => {
    dispatch(logOutUser())
  };


  return (
    <div
      className={`fixed z-10 top-0 left-0 h-full transition-all duration-300 bg-gray-800 text-white shadow-lg ${
        isExpanded ? "w-72" : "w-16"
      }`}
      // onMouseEnter={handleMouseEnter}
      // onMouseLeave={handleMouseLeave}
    >
      <nav className="flex flex-col h-full">
        <ul className="flex-grow my-auto">
          <li className="flex items-center gap-4 p-2">
            <div
              className={`bg-slate-700 rounded-full flex items-center justify-center my-6 ${
                isExpanded ? "opacity-0" : "w-8 h-8"
              }`}
            >
              <span className="text-white text-xl font-bold">CB</span>
            </div>
            {isExpanded && (
              <span
                className={`text-xl font-light sm:inline w-full mt-1 ml-4 ${
                  isExpanded ? "" : "-translate-x-full"
                }`}
              >
                Cangre Burger
              </span>
            )}
          </li>

          <hr className="border-gray-700 w-3/4 mx-auto mb-4" />

          {isExpanded && (
            <NavLink
              to={PATH.home}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-4 py-4 pl-10 text-md bg-gray-600 rounded-md p-2 mr-1"
                  : "flex items-center gap-4 py-3 pl-10 text-md text-gray-500 hover:bg-gray-700 hover:rounded-md"
              }
            >
              <FiHome size={25} />
              Home
            </NavLink>
          )}

          {isExpanded && (
            <NavLink
              to={PATH.contact}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-4 py-4 pl-10 text-md w-full bg-gray-600 rounded-md p-2 mr-1"
                  : "flex items-center gap-4 py-3 pl-10 text-md text-gray-500 w-full hover:bg-gray-700 hover:rounded-md "
              }
            >
              <FiMail size={25} />
              Clientes 
            </NavLink>
          )}

          {isExpanded && (
            <NavLink
              to={PATH.products}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-4 py-4 pl-10 text-md w-full bg-gray-600 rounded-md p-2 mr-1"
                  : "flex items-center gap-4 py-3 pl-10 text-md text-gray-500 w-full hover:bg-gray-700 hover:rounded-md "
              }
            >
              <FiShoppingCart size={25} />
              Productos
            </NavLink>
          )}

          {isExpanded && (
            <NavLink
              to={PATH.orders}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-4 py-4 pl-10 text-md w-full bg-gray-600 rounded-md p-2 mr-1"
                  : "flex items-center gap-4 py-3 pl-10 text-md text-gray-500 w-full cursor-pointer hover:bg-gray-700 hover:rounded-md "
              }
            >
              <FiBox size={25} />
              Ordenes
            </NavLink>
          )}

          {isExpanded && (
            <NavLink
              to={PATH.ventas}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-4 py-4 pl-10 text-md w-full bg-gray-600 rounded-md p-2 mr-1"
                  : "flex items-center gap-4 py-3 pl-10 text-md text-gray-500 w-full hover:bg-gray-700 hover:rounded-md "
              }
            >
              <CiMoneyCheck1 size={25} />
              Ventas
            </NavLink>
          )}
        </ul>

        <button
          onClick={handleClick}
          className="flex items-center gap-4 py-4 pl-6 w-full hover:bg-red-600"
        >
          <FiLogOut size={24} />
          {isExpanded && <span className="text-lg">Log Out</span>}
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
