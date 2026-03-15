import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Form, Button, Upload, message, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";

import ReusableTextbox from "../components/ReusableTextbox";
import { useCreateCafe, useUpdateCafe } from "../api/cafes";
import type { Cafe, CafeFormValues } from "../types";

const MAX_LOGO_BYTES = 2 * 1024 * 1024;

export default function AddEditCafePage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const [form] = Form.useForm();
  const isEdit = !!id;
  const cafe: Cafe | undefined = state?.cafe;

  const createCafe = useCreateCafe();
  const updateCafe = useUpdateCafe();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const isDirty = useRef(false);

  useEffect(() => {
    if (cafe) {
      form.setFieldsValue({ name: cafe.name, description: cafe.description, location: cafe.location });
    }
  }, [cafe, form]);

  const handleValuesChange = () => { isDirty.current = true; };

  const handleCancel = () => {
    if (isDirty.current) {
      if (!window.confirm("You have unsaved changes. Are you sure you want to leave?")) return;
    }
    navigate("/cafes");
  };

  const handleSubmit = async (values: { name: string; description: string; location: string }) => {
    const payload: CafeFormValues = { ...values, logo: logoFile };

    try {
      if (isEdit && id) {
        await updateCafe.mutateAsync({ id, values: payload });
        message.success("Café updated");
      } else {
        await createCafe.mutateAsync(payload);
        message.success("Café created");
      }
      isDirty.current = false;
      navigate("/cafes");
    } catch {
      message.error("Failed to save café");
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 600 }}>
      <h2>{isEdit ? "Edit Café" : "Add New Café"}</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
      >
        <ReusableTextbox
          name="name"
          label="Name"
          placeholder="Café name"
          rules={[
            { required: true, message: "Name is required" },
            { min: 6, max: 10, message: "Name must be 6–10 characters" },
          ]}
        />
        <ReusableTextbox
          name="description"
          label="Description"
          placeholder="Short description"
          textarea
          rules={[
            { required: true, message: "Description is required" },
            { max: 256, message: "Description must not exceed 256 characters" },
          ]}
        />
        <ReusableTextbox
          name="location"
          label="Location"
          placeholder="e.g. Orchard, CBD"
          rules={[{ required: true, message: "Location is required" }]}
        />

        <Form.Item label="Logo">
          <Upload
            fileList={fileList}
            beforeUpload={(file) => {
              if (file.size > MAX_LOGO_BYTES) {
                message.error("Logo must be under 2MB");
                return Upload.LIST_IGNORE;
              }
              setFileList([file as unknown as UploadFile]);
              setLogoFile(file);
              isDirty.current = true;
              return false;
            }}
            onRemove={() => { setFileList([]); setLogoFile(null); }}
            maxCount={1}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Upload Logo</Button>
          </Upload>
          {isEdit && cafe?.logo && fileList.length === 0 && (
            <p style={{ marginTop: 4, color: "#888", fontSize: 12 }}>Current logo will be kept if no new file is uploaded.</p>
          )}
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={createCafe.isPending || updateCafe.isPending}>
              Submit
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
