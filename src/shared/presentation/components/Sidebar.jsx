"use client"

import { Link } from "react-router-dom"
import { PATH } from "../../../shared/infrastructure/utils/PATH.js"
import { useDispatch } from "react-redux"
import { logOutUser } from "../../../users/application/userSlice.js"
import {
  FingerprintIcon as FiHome,
  MailIcon as FiMail,
  ShoppingCartIcon as FiShoppingCart,
  FileBoxIcon as FiBox,
  LogOutIcon as FiLogOut,
} from "lucide-react"
import { CheckCheckIcon as CiMoneyCheck1 } from "lucide-react"
import { useState } from "react"

const Sidebar = () => {
  const dispatch = useDispatch()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleMouseEnter = () => setIsExpanded(true)
  const handleMouseLeave = () => setIsExpanded(false)

  const handleClick = () => {
    dispatch(logOutUser())
  }

  return (
    <div
      className={`fixed z-10 top-0 left-0 h-full transition-all duration-300 bg-gray-800 text-white shadow-lg ${
        isExpanded ? "w-64" : "w-16"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <nav className="flex flex-col h-full">
        <ul className="flex-grow my-auto">
          <li className="flex items-center gap-4 p-4">
            <div
              className={`bg-slate-700 rounded-full flex items-center justify-center my-6 ${
                isExpanded ? "opacity-0" : "w-8 h-8"
              }`}
            >
              <span className="text-white text-xl font-bold">CB</span>
            </div>
            {isExpanded && (
              <span className={`text-xl font-bold sm:inline my-8 w-full ${isExpanded ? "" : "-translate-x-full"}`}>
                Cangre Burger
              </span>
            )}
          </li>
          <li className="flex items-center gap-4 p-4 hover:bg-gray-600">
            <FiHome size={22} />
            {isExpanded && (
              <Link to={PATH.home} className="text-lg w-full">
                Home
              </Link>
            )}
          </li>
          <li className="flex items-center gap-4 p-4 hover:bg-gray-600">
            <FiMail size={22} />
            {isExpanded && (
              <Link to={PATH.contact} className="text-lg w-full">
                Contact
              </Link>
            )}
          </li>
          <li className="flex items-center gap-4 p-4 hover:bg-gray-600">
            <FiShoppingCart size={22} />
            {isExpanded && (
              <Link to={PATH.products} className="text-lg w-full">
                Productos
              </Link>
            )}
          </li>
          <li className="flex items-center gap-4 p-4 hover:bg-gray-600">
            <FiBox size={22} />
            {isExpanded && (
              <Link to={PATH.orders} className="text-lg w-full">
                Ordenes
              </Link>
            )}
          </li>
          <li className="flex items-center gap-4 p-4 hover:bg-gray-600">
            <CiMoneyCheck1 size={24} />
            {isExpanded && <span className="text-lg w-full">Ventas</span>}
          </li>
        </ul>

        <button onClick={handleClick} className="flex items-center gap-4 p-4 w-full hover:bg-red-600">
          <FiLogOut size={24} />
          {isExpanded && <span className="text-lg">Log Out</span>}
        </button>
      </nav>
    </div>
  )
}

export default Sidebar

