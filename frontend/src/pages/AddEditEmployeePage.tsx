import { useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Form, Button, Radio, Select, message, Space } from "antd";

import ReusableTextbox from "../components/ReusableTextbox";
import { useCreateEmployee, useUpdateEmployee } from "../api/employees";
import { useCafes } from "../api/cafes";
import type { Employee, EmployeeFormValues } from "../types";

export default function AddEditEmployeePage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const [form] = Form.useForm();
  const isEdit = !!id;
  const employee: Employee | undefined = state?.employee;

  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const { data: cafes = [] } = useCafes();

  const isDirty = useRef(false);

  useEffect(() => {
    if (employee) {
      const cafe = cafes.find((c) => c.name === employee.cafe);
      form.setFieldsValue({
        name: employee.name,
        email_address: employee.email_address,
        phone_number: employee.phone_number,
        gender: employee.gender,
        cafe_id: cafe?.id ?? undefined,
      });
    }
  }, [employee, cafes, form]);

  const handleValuesChange = () => { isDirty.current = true; };

  const handleCancel = () => {
    if (isDirty.current) {
      if (!window.confirm("You have unsaved changes. Are you sure you want to leave?")) return;
    }
    navigate("/employees");
  };

  const handleSubmit = async (values: EmployeeFormValues) => {
    try {
      if (isEdit && id) {
        await updateEmployee.mutateAsync({ id, values });
        message.success("Employee updated");
      } else {
        await createEmployee.mutateAsync(values);
        message.success("Employee created");
      }
      isDirty.current = false;
      navigate("/employees");
    } catch {
      message.error("Failed to save employee");
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 600 }}>
      <h2>{isEdit ? "Edit Employee" : "Add New Employee"}</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
      >
        <ReusableTextbox
          name="name"
          label="Name"
          placeholder="Employee name"
          rules={[
            { required: true, message: "Name is required" },
            { min: 6, max: 10, message: "Name must be 6–10 characters" },
          ]}
        />
        <ReusableTextbox
          name="email_address"
          label="Email Address"
          placeholder="email@example.com"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email" },
          ]}
        />
        <ReusableTextbox
          name="phone_number"
          label="Phone Number"
          placeholder="8 or 9 digits SG number"
          rules={[
            { required: true, message: "Phone number is required" },
            {
              pattern: /^[89]\d{7}$/,
              message: "Must start with 8 or 9 and be 8 digits",
            },
          ]}
        />

        <Form.Item name="gender" label="Gender" rules={[{ required: true, message: "Gender is required" }]}>
          <Radio.Group>
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="cafe_id" label="Assigned Café">
          <Select placeholder="Select a café (optional)" allowClear>
            {cafes.map((c) => (
              <Select.Option key={c.id} value={c.id}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={createEmployee.isPending || updateEmployee.isPending}>
              Submit
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
