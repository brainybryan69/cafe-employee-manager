import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout, Menu } from "antd";
import { CoffeeOutlined, TeamOutlined } from "@ant-design/icons";

import CafesPage from "./pages/CafesPage";
import EmployeesPage from "./pages/EmployeesPage";
import AddEditCafePage from "./pages/AddEditCafePage";
import AddEditEmployeePage from "./pages/AddEditEmployeePage";

const { Header, Content } = Layout;
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout style={{ minHeight: "100vh" }}>
          <Header style={{ display: "flex", alignItems: "center" }}>
            <span style={{ color: "white", fontWeight: 700, fontSize: 18, marginRight: 32 }}>
              Café Manager
            </span>
            <Menu
              theme="dark"
              mode="horizontal"
              style={{ flex: 1 }}
              items={[
                {
                  key: "cafes",
                  icon: <CoffeeOutlined />,
                  label: <NavLink to="/cafes">Cafés</NavLink>,
                },
                {
                  key: "employees",
                  icon: <TeamOutlined />,
                  label: <NavLink to="/employees">Employees</NavLink>,
                },
              ]}
            />
          </Header>
          <Content style={{ background: "#fff" }}>
            <Routes>
              <Route path="/" element={<Navigate to="/cafes" replace />} />
              <Route path="/cafes" element={<CafesPage />} />
              <Route path="/cafes/new" element={<AddEditCafePage />} />
              <Route path="/cafes/edit/:id" element={<AddEditCafePage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/employees/new" element={<AddEditEmployeePage />} />
              <Route path="/employees/edit/:id" element={<AddEditEmployeePage />} />
            </Routes>
          </Content>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
