import { Layout, Menu } from "antd";
import { useAppSelector } from "../hooks/hook";
import { verifyToken } from "../utils/verifyToken";
import { TUser, useCurrentToken } from "../redux/features/auth/authSlice";
import { sidebarItemsGenerator } from "../utils/sidebarItemsGenerator";
import { adminPaths } from "../routes/router";
import { useLocation } from "react-router-dom";
import { ThunderboltFilled } from "@ant-design/icons";

const { Sider } = Layout;

const userRole = {
  ADMIN: "ADMIN",
};

type SidebarProps = {
  collapsed: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const token = useAppSelector(useCurrentToken);
  const location = useLocation();

  let user: TUser | null | undefined;

  if (token) {
    user = verifyToken(token) as TUser | null;
  }

  let sidebarItems;
  if (user && user.role === userRole.ADMIN) {
    sidebarItems = sidebarItemsGenerator(adminPaths);
  }

  // Find active key from pathname
  const currentPath = location.pathname.replace(/^\//, "") || "profile";
  const activeItem = adminPaths.find((item) => item.path === currentPath);
  const selectedKey = activeItem ? activeItem.name : "Profile";

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      breakpoint="lg"
      collapsedWidth="0"
      width={240}
      style={{
        height: "100vh",
        position: "sticky",
        top: "0",
        left: "0",
        background: "rgba(13, 10, 24, 0.95)",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        zIndex: 100,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          height: "4.5rem",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: "12px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(139, 92, 246, 0.4)",
            flexShrink: 0,
          }}
        >
          <ThunderboltFilled style={{ color: "#fff", fontSize: "18px" }} />
        </div>
        {!collapsed && (
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px", letterSpacing: "-0.3px" }}>
              DevFolio
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.45)", fontSize: "11px" }}>
              Admin Console
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <div style={{ padding: "12px 8px" }}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={sidebarItems}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "14px",
            fontWeight: 500,
          }}
        />
      </div>
    </Sider>
  );
};

export default Sidebar;

