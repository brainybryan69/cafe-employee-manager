import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Modal, Space, message } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { useCafes, useDeleteCafe } from "../api/cafes";
import type { Cafe } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function CafesPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState("");
  const { data: cafes = [], isLoading } = useCafes(search || undefined);
  const deleteCafe = useDeleteCafe();

  const handleDelete = (cafe: Cafe) => {
    Modal.confirm({
      title: "Delete Café",
      content: `Are you sure you want to delete "${cafe.name}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        await deleteCafe.mutateAsync(cafe.id);
        message.success("Café deleted");
      },
    });
  };

  const columnDefs: ColDef<Cafe>[] = [
    {
      headerName: "Logo",
      field: "logo",
      width: 80,
      cellRenderer: ({ value }: { value: string | null }) =>
        value ? (
          <img src={`${API_URL}${value}`} alt="logo" style={{ height: 40, objectFit: "contain" }} />
        ) : (
          <span style={{ color: "#ccc" }}>—</span>
        ),
    },
    { headerName: "Name", field: "name", flex: 1 },
    { headerName: "Description", field: "description", flex: 2 },
    {
      headerName: "Employees",
      field: "employees",
      width: 120,
      cellRenderer: ({ value, data }: { value: number; data: Cafe }) => (
        <Button type="link" onClick={() => navigate(`/employees?cafe=${data.name}`)}>
          {value}
        </Button>
      ),
    },
    { headerName: "Location", field: "location", flex: 1 },
    {
      headerName: "Actions",
      width: 160,
      cellRenderer: ({ data }: { data: Cafe }) => (
        <Space>
          <Button size="small" onClick={() => navigate(`/cafes/edit/${data.id}`, { state: { cafe: data } })}>
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
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, gap: 12 }}>
        <Input
          placeholder="Filter by location"
          prefix={<SearchOutlined />}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onPressEnter={() => setSearch(location)}
          onBlur={() => setSearch(location)}
          allowClear
          onClear={() => { setLocation(""); setSearch(""); }}
          style={{ maxWidth: 300 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/cafes/new")}>
          Add New Café
        </Button>
      </div>

      <div className="ag-theme-alpine" style={{ height: 500 }}>
        <AgGridReact
          rowData={cafes}
          columnDefs={columnDefs}
          loading={isLoading}
          rowHeight={56}
          domLayout="autoHeight"
          theme="legacy"
        />
      </div>
    </div>
  );
}
