import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { RouterProvider } from "react-router-dom";
import { persistor, store } from "./redux/store/store";
import { router } from "./routes/router";
import { Toaster } from "sonner";
import { ConfigProvider, theme } from "antd";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorPrimary: "#8b5cf6",
              colorBgBase: "#070913",
              colorBgContainer: "#120e1e",
              colorBorder: "rgba(255, 255, 255, 0.1)",
              borderRadius: 10,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            },
            components: {
              Card: {
                colorBgContainer: "#120e1e",
                colorBorderSecondary: "rgba(255, 255, 255, 0.08)",
              },
              Table: {
                colorBgContainer: "transparent",
                headerBg: "rgba(30, 20, 48, 0.8)",
                headerColor: "#a78bfa",
              },
            },
          }}
        >
          <RouterProvider router={router} />
          <Toaster richColors position="top-right" />
        </ConfigProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);

