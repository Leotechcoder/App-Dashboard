"use client";

import {
  Sidebar as ShadSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { LogOut, Home, Package, ShoppingCart, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOutUser, setClosedSession } from "../../../users/application/userSlice";

const menuItems = [
  { title: "Inicio", to: "/admin/home", icon: Home },
  { title: "Productos", to: "/admin/products", icon: Package },
  { title: "Órdenes", to: "/admin/ventas", icon: ShoppingCart },
  { title: "Usuarios", to: "/admin/contact", icon: Users },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setClosedSession(true))
    setTimeout(() =>{dispatch(logOutUser());} , 500) 
    navigate("/login", {replace: true});
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <ShadSidebar
        collapsible="icon"
        className="border-r border-gray-300 bg-white text-gray-800"
      >
        <SidebarHeader className="border-b border-gray-300 p-4 bg-gray-50">
          <h1 className="font-bold text-lg tracking-tight">Dashboard</h1>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-500">
              Menú
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild className={'bg-gray-400'}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                            isActive
                              ? "bg-blue-600 text-white shadow-sm"
                              : "text-gray-700 hover:bg-gray-200"
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-gray-300 bg-gray-50">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-100 rounded-md"
              >
                <LogOut className="w-5 h-5" />
                <span>Cerrar sesión</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </ShadSidebar>
    </SidebarProvider>
  );
}
