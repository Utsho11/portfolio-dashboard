import { Controller } from "react-hook-form";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import ReactQuill from "react-quill";
import { Form } from "antd";

type TInputProps = {
  type: string;
  name: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
};

const PHTextEditor = ({ label, name, placeholder = "" }: TInputProps) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <Controller
        name={name}
        render={({ field }) => (
          <Form.Item label={<span style={{ color: "white" }}>{label}</span>}>
            <ReactQuill
              theme="snow"
              value={field.value || ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder={placeholder}
              style={{ height: "10rem", color: "white" }}
            />
          </Form.Item>
        )}
      />
    </div>
  );
};

export default PHTextEditor;
