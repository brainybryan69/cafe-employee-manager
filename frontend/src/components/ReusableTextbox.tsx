import { Form, Input } from "antd";
import type { Rule } from "antd/es/form";

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  rules?: Rule[];
  textarea?: boolean;
  rows?: number;
}

export default function ReusableTextbox({ name, label, placeholder, rules, textarea, rows }: Props) {
  return (
    <Form.Item name={name} label={label} rules={rules}>
      {textarea ? (
        <Input.TextArea placeholder={placeholder} rows={rows ?? 4} />
      ) : (
        <Input placeholder={placeholder} />
      )}
    </Form.Item>
  );
}
