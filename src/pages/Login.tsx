import { Button, Row, Typography, Col, Checkbox } from "antd";
import type { CheckboxProps } from "antd";
import { FieldValues } from "react-hook-form";
import {
  TUser,
  setUser,
  useCurrentToken,
} from "../redux/features/auth/authSlice";
import { verifyToken } from "../utils/verifyToken";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PHForm from "../components/form/PHForm";
import PHInput from "../components/form/PHInput";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { useLoginMutation } from "../redux/services/authApi";
import { useEffect, useState } from "react";
import { LockOutlined, ThunderboltFilled } from "@ant-design/icons";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const onChange: CheckboxProps["onChange"] = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading("Authenticating admin....");

    try {
      const userInfo = {
        email: data.email || data.userId,
        password: data.password,
      };
      const res = await login(userInfo).unwrap();

      const user = verifyToken(res.data.accessToken) as TUser;
      dispatch(setUser({ user: user, token: res.data.accessToken }));
      toast.success("Welcome back, Utsho!", { id: toastId, duration: 2000 });

      navigate(`/profile`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMsg =
        err?.data?.message ||
        err?.message ||
        "Authentication failed. Please check credentials.";
      toast.error(errorMsg, { id: toastId, duration: 2000 });
    }
  };

  const token = useAppSelector(useCurrentToken);

  // If a valid token exists, navigate to the profile page
  useEffect(() => {
    if (token) {
      const user = verifyToken(token) as TUser | null;
      if (user?.email) {
        navigate(`/profile`);
      }
    }
  }, [token, navigate]);

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top, #1e1035 0%, #070913 70%)",
        padding: "20px",
      }}
    >
      <Col xs={24} sm={18} md={12} lg={8} xl={6}>
        <div
          className="glass-card"
          style={{
            padding: "clamp(24px, 4vw, 36px)",
            borderRadius: "20px",
          }}
        >
          {/* Logo & Header */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                margin: "0 auto 16px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(139, 92, 246, 0.4)",
              }}
            >
              <ThunderboltFilled style={{ color: "#fff", fontSize: "24px" }} />
            </div>

            <Typography.Title
              level={2}
              style={{ color: "#fff", margin: 0, fontWeight: 700, letterSpacing: "-0.5px" }}
            >
              Admin Console
            </Typography.Title>

            <Typography.Text style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "13px" }}>
              Sign in to manage portfolio projects & blogs
            </Typography.Text>
          </div>

          <PHForm onSubmit={onSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <PHInput
                type="email"
                name="email"
                label="Admin Email"
                placeholder="admin@example.com"
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <PHInput
                type={showPassword ? "text" : "password"}
                name="password"
                label="Master Password"
                placeholder="••••••••"
              />

              <div style={{ marginTop: "8px" }}>
                <Checkbox
                  onChange={onChange}
                  style={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  Show Password
                </Checkbox>
              </div>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              block
              icon={<LockOutlined />}
              style={{
                height: "46px",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: 600,
                background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                border: "none",
                boxShadow: "0 8px 20px rgba(124, 58, 237, 0.35)",
              }}
            >
              Sign In
            </Button>
          </PHForm>
        </div>
      </Col>
    </Row>
  );
};

export default Login;

