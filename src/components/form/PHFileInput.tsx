import React, { useState, ChangeEvent } from "react";

interface PHFileInputProps {
  name: string;
  label?: string;
  required?: boolean;
  accept?: string;
  onFileChange: (file: File | null) => void;
}

const PHFileInput: React.FC<PHFileInputProps> = ({
  name,
  label,
  required = false,
  accept,
  onFileChange,
}) => {
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      setFileName(file.name);
      onFileChange(file);
    } else {
      setFileName("");
      onFileChange(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {label && (
        <label
          htmlFor={name}
          style={{ marginBottom: "0.5rem", color: "white" }}
        >
          {label}
        </label>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <input
          id={name}
          type="file"
          accept={accept}
          required={required}
          onChange={handleFileChange}
          style={{
            border: "1px solid #d1d5db",
            padding: "0.25rem 0.5rem",
            borderRadius: "0.375rem",
            flex: "1",
            fontSize: "0.875rem",
            color: "white",
          }}
        />
        {fileName && (
          <span
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {fileName}
          </span>
        )}
      </div>
    </div>
  );
};

export default PHFileInput;
