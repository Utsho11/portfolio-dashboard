import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import {
  logout,
  TUser,
  useCurrentToken,
} from "../redux/features/auth/authSlice";
import { verifyToken } from "../utils/verifyToken";

type TProtectedRoute = {
  children: ReactNode;
  role: string | undefined;
};

const ProtectedRoute = ({ children, role }: TProtectedRoute) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const token = useAppSelector(useCurrentToken);

  let user: TUser | undefined;

  if (token) {
    user = verifyToken(token) as TUser;
  }

  useEffect(() => {
    if (role !== undefined && role !== user?.role) {
      dispatch(logout());
    }
  }, [role, user, dispatch]);

  if (!token) {
    return <Navigate to="/" replace={true} state={{ from: location }} />;
  }

  if (role !== undefined && role !== user?.role) {
    return <Navigate to="/" replace={true} state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
