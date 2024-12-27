import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import ProtectedRoute from "../layouts/ProtectedRoute";
import { routeGenerator } from "../utils/routesGenerator";
import ManageBlogs from "../pages/ManageBlogs";
import ManageProjects from "../pages/ManageProjects";
import Dashboard from "../pages/Dashboard";
import App from "../App";
import {
  PlusOutlined,
  PlusSquareOutlined,
  ProductOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import CreateBlog from "../components/Blog/CreateBlog";
import CreateProject from "../components/Project/CreateProject";

export const adminPaths = [
  {
    name: "Profile",
    icon: <UserOutlined />,
    path: "profile",
    element: <Dashboard />,
  },
  {
    name: "Manage Blogs",
    icon: <ProfileOutlined />,
    path: "manage-blogs",
    element: <ManageBlogs />,
  },
  {
    name: "Manage Projects",
    icon: <ProductOutlined />,
    path: "manage-projects",
    element: <ManageProjects />,
  },
  {
    name: "Publish Blog",
    icon: <PlusSquareOutlined />,
    path: "add-blog",
    element: <CreateBlog />,
  },
  {
    name: "Publish Project",
    icon: <PlusOutlined />,
    path: "add-project",
    element: <CreateProject />,
  },
];
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute role="ADMIN">
        <App />
      </ProtectedRoute>
    ),
    children: routeGenerator(adminPaths),
  },
]);
