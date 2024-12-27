import { Form, Input } from "antd";
import { Controller } from "react-hook-form";

type TInputProps = {
  type: string;
  name: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
};

const PHInput = ({ type, name, label, disabled, placeholder }: TInputProps) => {
  return (
    <div
      style={{
        marginBottom: "20px",
        color: "white",
      }}
    >
      <Controller
        name={name}
        render={({ field }) => (
          <Form.Item label={<span style={{ color: "white" }}>{label}</span>}>
            <Input
              {...field}
              type={type}
              id={name}
              size="large"
              disabled={disabled}
              placeholder={placeholder}
            />
          </Form.Item>
        )}
      />
    </div>
  );
};

export default PHInput;
