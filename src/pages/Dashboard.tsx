import { Avatar, Card, Col, Row, Statistic, Typography } from "antd";
import { useGetMeQuery } from "../redux/services/authApi";
import {
  FileTextOutlined,
  FolderOpenOutlined,
  UserOutlined,
} from "@ant-design/icons";

const Dashboard = () => {
  const { data } = useGetMeQuery(null);

  const user = data?.data;
  return (
    <div style={{ padding: "20px", background: "#010313" }}>
      <Row gutter={24}>
        {/* Left Section: User Info */}
        <Col span={8} style={{ background: "#170F21" }}>
          <Card
            style={{
              textAlign: "center",
              background: "#170F21",
            }}
          >
            <Avatar
              size={100}
              src={user?.profilePhoto}
              icon={<UserOutlined />}
            />
            <Typography.Title
              level={3}
              style={{ marginTop: "16px", color: "white" }}
            >
              {user?.name}
            </Typography.Title>
            <Typography.Text style={{ color: "white" }}>
              {user?.email}
            </Typography.Text>
          </Card>
        </Col>

        {/* Right Section: Statistics */}
        <Col span={16}>
          <Row gutter={24}>
            <Col span={8}>
              <Card style={{ background: "#170F21" }}>
                <Statistic
                  style={{ color: "white" }}
                  title={<span style={{ color: "white" }}>Projects</span>}
                  value={user?.project}
                  valueStyle={{ color: "white" }}
                  prefix={<FolderOpenOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card style={{ background: "#170F21" }}>
                <Statistic
                  title={<span style={{ color: "white" }}>Posts</span>}
                  value={user?.blog}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ color: "white" }}
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Footer Section: More Info or Links */}
      <Row gutter={24} style={{ marginTop: "24px" }}>
        <Col span={24}>
          <Card
            title={
              <span style={{ color: "white" }}>Additional Information</span>
            }
            style={{ background: "#170F21" }}
          >
            <Typography.Text strong style={{ color: "white" }}>
              About Me:
            </Typography.Text>
            <p style={{ color: "white" }}>
              I am a full-stack developer with experience in React, Node.js, and
              various other technologies. Passionate about building scalable web
              applications and continuously learning new technologies.
            </p>
            <Typography.Text strong style={{ color: "white" }}>
              Skills:
            </Typography.Text>
            <ul style={{ color: "white" }}>
              <li>React</li>
              <li>Node.js</li>
              <li>MongoDB, PostgreSQL</li>
              <li>Express</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
