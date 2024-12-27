import { Button, Layout } from "antd";
import Sidebar from "./Sidebar";
import { useAppDispatch } from "../hooks/hook";
import { logout } from "../redux/features/auth/authSlice";
import { Outlet } from "react-router-dom";
import { useState } from "react";
const { Header, Content } = Layout;
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Layout style={{ height: "100%", background: "#010313" }}>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <Header style={{ padding: 0, background: "#001529" }}>
          <Button
            type="text"
            icon={
              collapsed ? (
                <MenuUnfoldOutlined style={{ color: "white" }} />
              ) : (
                <MenuFoldOutlined style={{ color: "white" }} />
              )
            }
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Button
            style={{ background: "#f46969", color: "white" }}
            onClick={handleLogout}
          >
            <LogoutOutlined style={{ color: "white" }} />
            Logout
          </Button>{" "}
        </Header>
        <Content style={{ background: "#010313" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
