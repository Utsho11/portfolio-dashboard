import { Button, Layout, Space, Tag } from "antd";
import Sidebar from "./Sidebar";
import { useAppDispatch } from "../hooks/hook";
import { logout } from "../redux/features/auth/authSlice";
import { Outlet } from "react-router-dom";
import { useState } from "react";
const { Header, Content } = Layout;
import {
  GlobalOutlined,
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
    <Layout style={{ minHeight: "100vh", background: "#070913" }}>
      <Sidebar collapsed={collapsed} />
      <Layout style={{ background: "#070913" }}>
        <Header
          style={{
            padding: "0 24px",
            background: "rgba(13, 10, 24, 0.8)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 99,
          }}
        >
          <Button
            type="text"
            icon={
              collapsed ? (
                <MenuUnfoldOutlined style={{ color: "#fff", fontSize: "18px" }} />
              ) : (
                <MenuFoldOutlined style={{ color: "#fff", fontSize: "18px" }} />
              )
            }
            onClick={() => setCollapsed(!collapsed)}
            style={{ width: 44, height: 44 }}
          />

          <Space size="middle">
            <Tag color="purple" style={{ padding: "4px 10px", borderRadius: "6px", fontWeight: 600 }}>
              Live System
            </Tag>

            <Button
              type="text"
              icon={<GlobalOutlined style={{ color: "#38bdf8" }} />}
              onClick={() => window.open("https://utshoroy.vercel.app", "_blank")}
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              View Site
            </Button>

            <Button
              danger
              type="primary"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{
                borderRadius: "8px",
                fontWeight: 600,
                background: "rgba(239, 68, 68, 0.15)",
                borderColor: "rgba(239, 68, 68, 0.3)",
                color: "#ef4444",
              }}
            >
              Logout
            </Button>
          </Space>
        </Header>

        <Content
          style={{
            background: "#070913",
            padding: "24px",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;

