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

import { LogOut, Home, Package, ShoppingCart, Users, BarChart3 } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOutUser, setClosedSession } from "../../../users/application/userSlice";
import { PATH } from "../../../shared/infrastructure/utils/PATH.js";
import { ModeToggle } from "./ModeToggle";

const menuItems = [
  { title: "Inicio",    to: PATH.home,      icon: Home },
  { title: "Productos", to: PATH.products,  icon: Package },
  { title: "Órdenes",   to: PATH.ventas,    icon: ShoppingCart },
  { title: "Analítica", to: PATH.analytics, icon: BarChart3 },
  { title: "Usuarios",  to: PATH.contact,   icon: Users },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setClosedSession(true));
    setTimeout(() => dispatch(logOutUser()), 500);
    navigate("/login", { replace: true });
  };

  return (
    <SidebarProvider defaultOpen>
      <ShadSidebar
        collapsible="none"
        className="
          border-r
          border-[hsl(var(--border))]
          bg-[hsl(var(--background-unit))]
          text-[hsl(var(--foreground))]
        "
      >
        {/* HEADER */}
        <SidebarHeader
          className="
            border-b border-[hsl(var(--border))]
            bg-[hsl(var(--background-unit))]
            p-4 flex items-center justify-between
          "
        >
          <h1 className="text-lg font-semibold tracking-tight text-[hsl(var(--foreground))]">
            Dashboard
          </h1>
          <ModeToggle />
        </SidebarHeader>

        {/* CONTENT */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-[hsl(var(--muted-foreground))]">
              Menú
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <NavLink to={item.to} end className="block">
                      {({ isActive }) => (
                        <SidebarMenuButton
                          className={`
                            flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                            ${isActive
                              ? "bg-[hsl(var(--accent))] text-[hsl(var(--primary))]"
                              : "hover:bg-[hsl(var(--accent))]/45 text-[hsl(var(--foreground))]"
                            }
                          `}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="text-[hsl(var(--accent-foreground))]">
                            {item.title}
                          </span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* FOOTER */}
        <SidebarFooter
          className="border-t border-[hsl(var(--border))] bg-[hsl(var(--background-unit))]"
        >
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                className="
                  flex items-center gap-3 px-3 py-2 rounded-md
                  text-[hsl(var(--foreground))]
                  hover:bg-[hsl(var(--destructive))]
                  hover:text-[hsl(var(--destructive-foreground))]
                "
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
