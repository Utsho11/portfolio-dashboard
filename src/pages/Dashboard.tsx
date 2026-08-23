import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { useGetMeQuery } from "../redux/services/authApi";
import {
  CheckCircleOutlined,
  CompassOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  GlobalOutlined,
  PlusOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetMeQuery(null);
  const user = data?.data;

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      {/* Welcome Banner */}
      <div
        className="glass-card"
        style={{
          padding: "clamp(20px, 3vw, 32px)",
          marginBottom: "24px",
          background: "linear-gradient(135deg, rgba(30, 16, 50, 0.9), rgba(15, 23, 42, 0.9))",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Row align="middle" justify="space-between" gutter={[20, 20]}>
          <Col xs={24} md={16}>
            <Space orientation="horizontal" align="center" style={{ marginBottom: "8px" }}>
              <Tag color="purple" style={{ borderRadius: "12px", padding: "2px 10px" }}>
                Admin Portal
              </Tag>
              <Tag color="success" icon={<CheckCircleOutlined />}>
                All Systems Operational
              </Tag>
            </Space>

            <Typography.Title
              level={2}
              style={{
                color: "#fff",
                margin: "4px 0 8px",
                fontWeight: 800,
                letterSpacing: "-0.5px",
              }}
            >
              Welcome back, {user?.name || "Utsho"} 👋
            </Typography.Title>

            <Typography.Text style={{ color: "rgba(255,255,255,0.65)", fontSize: "15px" }}>
              Manage your engineering case studies, modern projects, and blog articles from one unified console.
            </Typography.Text>
          </Col>

          <Col xs={24} md={8} style={{ textAlign: "right" }}>
            <Space wrap>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{
                  height: "44px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                  fontWeight: 600,
                  border: "none",
                  boxShadow: "0 8px 20px rgba(124, 58, 237, 0.35)",
                }}
                onClick={() => navigate("/add-project")}
              >
                New Project
              </Button>

              <Button
                icon={<FileTextOutlined />}
                style={{
                  height: "44px",
                  borderRadius: "10px",
                  borderColor: "rgba(255,255,255,0.2)",
                  color: "#fff",
                }}
                onClick={() => navigate("/add-blog")}
              >
                New Blog
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* KPI Stats Grid */}
      <Row gutter={[20, 20]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <div
            className="glass-card"
            style={{
              padding: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", fontWeight: 500 }}>
                TOTAL PROJECTS
              </div>
              <div style={{ color: "#fff", fontSize: "28px", fontWeight: 800, marginTop: "4px" }}>
                {isLoading ? "..." : user?.project ?? 0}
              </div>
            </div>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(124, 58, 237, 0.15)",
                border: "1px solid rgba(124, 58, 237, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FolderOpenOutlined style={{ fontSize: "22px", color: "#a78bfa" }} />
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div
            className="glass-card"
            style={{
              padding: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", fontWeight: 500 }}>
                PUBLISHED POSTS
              </div>
              <div style={{ color: "#fff", fontSize: "28px", fontWeight: 800, marginTop: "4px" }}>
                {isLoading ? "..." : user?.blog ?? 0}
              </div>
            </div>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(56, 189, 248, 0.15)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileTextOutlined style={{ fontSize: "22px", color: "#38bdf8" }} />
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div
            className="glass-card"
            style={{
              padding: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", fontWeight: 500 }}>
                SECURITY & ROLE
              </div>
              <div style={{ color: "#34d399", fontSize: "20px", fontWeight: 700, marginTop: "8px" }}>
                {user?.role || "ADMIN"}
              </div>
            </div>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(52, 211, 153, 0.15)",
                border: "1px solid rgba(52, 211, 153, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SafetyCertificateOutlined style={{ fontSize: "22px", color: "#34d399" }} />
            </div>
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div
            className="glass-card"
            style={{
              padding: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", fontWeight: 500 }}>
                PORTFOLIO STATUS
              </div>
              <div style={{ color: "#38bdf8", fontSize: "20px", fontWeight: 700, marginTop: "8px" }}>
                Production Ready
              </div>
            </div>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(99, 102, 241, 0.15)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RocketOutlined style={{ fontSize: "22px", color: "#818cf8" }} />
            </div>
          </div>
        </Col>
      </Row>

      {/* Main Content: Profile & Quick Hub */}
      <Row gutter={[24, 24]}>
        {/* Left Column: Admin Profile */}
        <Col xs={24} lg={8}>
          <Card className="glass-card" style={{ textAlign: "center", padding: "12px" }}>
            <Avatar
              size={110}
              src={user?.profilePhoto}
              icon={<UserOutlined />}
              style={{
                border: "3px solid #7c3aed",
                boxShadow: "0 0 25px rgba(124, 58, 237, 0.4)",
              }}
            />

            <Typography.Title level={3} style={{ color: "#fff", marginTop: "16px", marginBottom: "4px" }}>
              {user?.name || "Utsho Roy"}
            </Typography.Title>

            <Typography.Text style={{ color: "#a78bfa", fontWeight: 600 }}>
              Full-Stack & Systems Engineer
            </Typography.Text>

            <div style={{ marginTop: "12px" }}>
              <Tag color="purple">{user?.email || "admin@example.com"}</Tag>
            </div>

            <Divider style={{ borderColor: "rgba(255,255,255,0.08)", margin: "20px 0" }} />

            <div style={{ textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Location:</span>
                <span style={{ color: "#fff", fontWeight: 500 }}>{user?.location || "Dhaka, Bangladesh"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Mobile:</span>
                <span style={{ color: "#fff", fontWeight: 500 }}>{user?.mobileNumber || "+8801700000000"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Access Level:</span>
                <span style={{ color: "#34d399", fontWeight: 600 }}>Super Admin</span>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Column: Quick Management Hub */}
        <Col xs={24} lg={16}>
          <Row gutter={[20, 20]}>
            {/* Quick Actions Card */}
            <Col xs={24}>
              <Card
                className="glass-card"
                title={<span style={{ color: "#fff", fontSize: "16px", fontWeight: 700 }}>Quick Actions</span>}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <div
                      onClick={() => navigate("/manage-projects")}
                      style={{
                        padding: "16px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                    >
                      <FolderOpenOutlined style={{ fontSize: "24px", color: "#a78bfa" }} />
                      <div>
                        <div style={{ color: "#fff", fontWeight: 600 }}>Manage Projects</div>
                        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>
                          Edit, feature, or delete projects
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col xs={24} sm={12}>
                    <div
                      onClick={() => navigate("/manage-blogs")}
                      style={{
                        padding: "16px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#38bdf8")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                    >
                      <FileTextOutlined style={{ fontSize: "24px", color: "#38bdf8" }} />
                      <div>
                        <div style={{ color: "#fff", fontWeight: 600 }}>Manage Blogs</div>
                        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>
                          Draft, edit, or publish articles
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Core Tech Stack Summary */}
            <Col xs={24}>
              <Card
                className="glass-card"
                title={<span style={{ color: "#fff", fontSize: "16px", fontWeight: 700 }}>Primary Tech Focus</span>}
              >
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  <Tag color="purple" style={{ padding: "6px 12px", fontSize: "13px" }}>Next.js 15 App Router</Tag>
                  <Tag color="blue" style={{ padding: "6px 12px", fontSize: "13px" }}>React 19 / TypeScript</Tag>
                  <Tag color="cyan" style={{ padding: "6px 12px", fontSize: "13px" }}>Node.js & Express</Tag>
                  <Tag color="green" style={{ padding: "6px 12px", fontSize: "13px" }}>MongoDB & Mongoose</Tag>
                  <Tag color="orange" style={{ padding: "6px 12px", fontSize: "13px" }}>PostgreSQL & Prisma</Tag>
                  <Tag color="magenta" style={{ padding: "6px 12px", fontSize: "13px" }}>Tailwind CSS / AntD</Tag>
                  <Tag color="gold" style={{ padding: "6px 12px", fontSize: "13px" }}>Redis & Realtime</Tag>
                  <Tag color="geekblue" style={{ padding: "6px 12px", fontSize: "13px" }}>Docker & Cloudinary</Tag>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

