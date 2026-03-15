import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Modal, Space, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { useEmployees, useDeleteEmployee } from "../api/employees";
import type { Employee } from "../types";

export default function EmployeesPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const cafeFilter = params.get("cafe") || undefined;
  const { data: employees = [], isLoading } = useEmployees(cafeFilter);
  const deleteEmployee = useDeleteEmployee();

  const handleDelete = (emp: Employee) => {
    Modal.confirm({
      title: "Delete Employee",
      content: `Are you sure you want to delete "${emp.name}"?`,
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        await deleteEmployee.mutateAsync(emp.id);
        message.success("Employee deleted");
      },
    });
  };

  const columnDefs: ColDef<Employee>[] = [
    { headerName: "Employee ID", field: "id", width: 130 },
    { headerName: "Name", field: "name", flex: 1 },
    { headerName: "Email", field: "email_address", flex: 1 },
    { headerName: "Phone", field: "phone_number", width: 120 },
    { headerName: "Days Worked", field: "days_worked", width: 130 },
    { headerName: "Café", field: "cafe", flex: 1 },
    {
      headerName: "Actions",
      width: 160,
      cellRenderer: ({ data }: { data: Employee }) => (
        <Space>
          <Button size="small" onClick={() => navigate(`/employees/edit/${data.id}`, { state: { employee: data } })}>
            Edit
          </Button>
          <Button size="small" danger onClick={() => handleDelete(data)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        {cafeFilter && (
          <span style={{ color: "#666" }}>
            Showing employees for: <strong>{cafeFilter}</strong>
          </span>
        )}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ marginLeft: "auto" }}
          onClick={() => navigate("/employees/new")}
        >
          Add New Employee
        </Button>
      </div>

      <div className="ag-theme-alpine" style={{ height: 500 }}>
        <AgGridReact
          rowData={employees}
          columnDefs={columnDefs}
          loading={isLoading}
          rowHeight={48}
          domLayout="autoHeight"
          theme="legacy"
        />
      </div>
    </div>
  );
}
