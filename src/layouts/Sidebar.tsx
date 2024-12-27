import { Layout, Menu } from "antd";
import { useAppSelector } from "../hooks/hook";
import { verifyToken } from "../utils/verifyToken";
import { TUser, useCurrentToken } from "../redux/features/auth/authSlice";
import { sidebarItemsGenerator } from "../utils/sidebarItemsGenerator";
import { adminPaths } from "../routes/router";

const { Sider } = Layout;

const userRole = {
  ADMIN: "ADMIN",
};
type SidebarProps = {
  collapsed: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const token = useAppSelector(useCurrentToken);

  let user: TUser | undefined;

  if (token) {
    user = verifyToken(token) as TUser;
  }

  let sidebarItems;

  if (user && user.role === userRole.ADMIN) {
    sidebarItems = sidebarItemsGenerator(adminPaths);
  }

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      breakpoint="lg"
      collapsedWidth="0"
      style={{ height: "100vh", position: "sticky", top: "0", left: "0" }}
    >
      <div className="demo-logo-vertical" />
      <div
        style={{
          color: "white",
          height: "4rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>Dashboard</h1>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["Profile"]}
        items={sidebarItems}
      />
    </Sider>
  );
};

export default Sidebar;
