import { Package, FolderOpen, ShoppingCart, MessageCircle, LayoutDashboard, ArrowRight } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "داشبورد", url: "/admin", icon: LayoutDashboard },
  { title: "محصولات", url: "/admin/products", icon: Package },
  { title: "دسته‌بندی‌ها", url: "/admin/categories", icon: FolderOpen },
  { title: "سفارشات", url: "/admin/orders", icon: ShoppingCart },
  { title: "تیکت‌ها", url: "/admin/tickets", icon: MessageCircle },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar side="right" collapsible="icon" className="border-l border-r-0">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-right">پنل مدیریت</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/admin"}
                      className="flex items-center gap-2 justify-end"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      {!isCollapsed && <span>{item.title}</span>}
                      <item.icon className="h-4 w-4" />
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="بازگشت به سایت">
                  <NavLink to="/" className="flex items-center gap-2 justify-end text-muted-foreground hover:text-foreground">
                    {!isCollapsed && <span>بازگشت به سایت</span>}
                    <ArrowRight className="h-4 w-4" />
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
