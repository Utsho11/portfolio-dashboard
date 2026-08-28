import React, { useMemo } from "react";
import { Controller } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { Form } from "antd";

type TInputProps = {
  name: string;
  placeholder?: string;
  minHeight?: string;
  themeMode?: "dark" | "light";
};

const PHTextEditor: React.FC<TInputProps> = ({
  name,
  placeholder = "Write comprehensive blog content with headings, code blocks, lists, and rich formatting...",
  minHeight = "220px",
  themeMode = "dark",
}) => {
  // Comprehensive Rich Text Editor Toolbar Modules
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["code", "code-block"],
        ["blockquote"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["link", "image"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "code",
    "code-block",
    "blockquote",
    "color",
    "background",
    "align",
    "link",
    "image",
  ];

  return (
    <div className={`ph-quill-wrapper ${themeMode === "dark" ? "quill-dark-theme" : "quill-light-theme"}`}>
      <style>{`
        .ph-quill-wrapper .quill {
          display: flex;
          flex-direction: column;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: #0d1220;
        }
        .ph-quill-wrapper.quill-light-theme .quill {
          border: 1px solid #d9d9d9;
          background: #ffffff;
        }
        .ph-quill-wrapper .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
          background: #131b30 !important;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        .ph-quill-wrapper.quill-light-theme .ql-toolbar {
          background: #f8fafc !important;
          border-bottom: 1px solid #e2e8f0 !important;
        }
        .ph-quill-wrapper.quill-dark-theme .ql-toolbar .ql-stroke {
          stroke: #94a3b8 !important;
        }
        .ph-quill-wrapper.quill-dark-theme .ql-toolbar .ql-fill {
          fill: #94a3b8 !important;
        }
        .ph-quill-wrapper.quill-dark-theme .ql-toolbar .ql-picker {
          color: #94a3b8 !important;
        }
        .ph-quill-wrapper.quill-dark-theme .ql-toolbar button:hover .ql-stroke,
        .ph-quill-wrapper.quill-dark-theme .ql-toolbar .ql-picker-label:hover {
          stroke: #3b82f6 !important;
          color: #3b82f6 !important;
        }
        .ph-quill-wrapper.quill-dark-theme .ql-toolbar button:hover .ql-fill {
          fill: #3b82f6 !important;
        }
        .ph-quill-wrapper .ql-container {
          border: none !important;
          font-family: inherit;
          font-size: 14px;
        }
        .ph-quill-wrapper.quill-dark-theme .ql-editor {
          color: #f8fafc !important;
          min-height: ${minHeight};
        }
        .ph-quill-wrapper.quill-light-theme .ql-editor {
          color: #0f172a !important;
          min-height: ${minHeight};
        }
        .ph-quill-wrapper.quill-dark-theme .ql-editor.ql-blank::before {
          color: #64748b !important;
          font-style: normal;
        }
        .ph-quill-wrapper.quill-dark-theme .ql-editor pre.ql-syntax,
        .ph-quill-wrapper.quill-dark-theme .ql-editor pre {
          background-color: #05070d !important;
          color: #22d3ee !important;
          border: 1px solid rgba(59, 130, 246, 0.3) !important;
          border-radius: 6px;
          padding: 10px 14px;
          font-family: monospace;
        }
        .ph-quill-wrapper.quill-dark-theme .ql-editor code {
          background-color: rgba(59, 130, 246, 0.15) !important;
          color: #38bdf8 !important;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
        }
        .ph-quill-wrapper.quill-dark-theme .ql-editor blockquote {
          border-left: 4px solid #3b82f6 !important;
          color: #94a3b8 !important;
          padding-left: 12px;
        }
      `}</style>
      <Controller
        name={name}
        render={({ field }) => (
          <Form.Item style={{ marginBottom: 0 }}>
            <ReactQuill
              theme="snow"
              value={field.value || ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder={placeholder}
              modules={modules}
              formats={formats}
            />
          </Form.Item>
        )}
      />
    </div>
  );
};

export default PHTextEditor;
