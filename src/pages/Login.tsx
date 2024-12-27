import { Button, Row, Typography, Col } from "antd";
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
import { Checkbox } from "antd";
import type { CheckboxProps } from "antd";

const Login = () => {
  const navigate = useNavigate();

  const onChange: CheckboxProps["onChange"] = () => {
    setShowPassword((prev) => !prev);
  };
  const dispatch = useAppDispatch();

  const defaultValues = {
    userId: "admin@gmail.com",
    password: "admin@123",
  };

  const [login] = useLoginMutation();

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading("Logging in");

    try {
      const userInfo = {
        email: data.userId,
        password: data.password,
      };
      const res = await login(userInfo).unwrap();

      const user = verifyToken(res.data.accessToken) as TUser;
      dispatch(setUser({ user: user, token: res.data.accessToken }));
      toast.success("Logged in", { id: toastId, duration: 2000 });

      navigate(`/profile`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  const token = useAppSelector(useCurrentToken);

  // If a valid token exists, navigate to the profile page
  useEffect(() => {
    if (token) {
      const user = verifyToken(token) as TUser;
      if (user?.email) {
        navigate(`/profile`);
      }
    }
  }, [token, navigate]);

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Row
      justify="center"
      align="middle"
      style={{ height: "100vh", background: "#f0f2f5" }}
    >
      <Col
        xs={22}
        sm={16}
        md={12}
        lg={8}
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography.Title
          level={3}
          style={{ textAlign: "center", marginBottom: "24px" }}
        >
          Login
        </Typography.Title>
        <PHForm onSubmit={onSubmit} defaultValues={defaultValues}>
          <div style={{ marginBottom: "16px" }}>
            <PHInput
              type="email"
              name="userId"
              label="Email:"
              placeholder="Enter your email"
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <PHInput
              type={showPassword ? "text" : "password"}
              name="password"
              label="Password:"
              placeholder="Enter your password"
            />

            <Checkbox onChange={onChange}>Show Password</Checkbox>
          </div>
          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </PHForm>
      </Col>
    </Row>
  );
};

export default Login;
