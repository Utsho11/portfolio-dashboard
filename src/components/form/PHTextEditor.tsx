import { Controller } from "react-hook-form";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import ReactQuill from "react-quill";
import { Form } from "antd";

type TInputProps = {
  type: string;
  name: string;
  disabled?: boolean;
  placeholder?: string;
};

const PHTextEditor = ({ name, placeholder = "" }: TInputProps) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <Controller
        name={name}
        render={({ field }) => (
          <Form.Item>
            <ReactQuill
              theme="snow"
              value={field.value || ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder={placeholder}
              style={{ height: "15rem", color: "white" }}
            />
          </Form.Item>
        )}
      />
    </div>
  );
};

export default PHTextEditor;
