import { Row, Col, Typography, Button } from "antd";
import PHForm from "../form/PHForm";
import PHInput from "../form/PHInput";
import { FieldValues } from "react-hook-form";
import PHTextEditor from "../form/PHTextEditor";
import PHFileInput from "../form/PHFileInput";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAddBlogMutation } from "../../redux/services/blogApi";

const CreateBlog = () => {
  const [addBlog] = useAddBlogMutation();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const onSubmit = async (data: FieldValues) => {
    // handle form submission
    console.log(data);
    console.log(selectedFile);

    const toastId = toast.loading("Blog posting....");
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    const formData = new FormData();

    try {
      formData.append("data", JSON.stringify(data));
      formData.append("file", selectedFile);
      await addBlog(formData).unwrap();
      toast.success("Successfully Posted Blog.", {
        id: toastId,
        duration: 2000,
      });
      navigate("/manage-blogs");
    } catch (error) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
      console.log(error);
    }
  };

  return (
    <Row justify="center" style={{ background: "#010313" }}>
      <Col
        xs={22}
        sm={16}
        md={12}
        lg={8}
        style={{
          background: "#170F21",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography.Title
          level={3}
          style={{ textAlign: "center", marginBottom: "24px", color: "white" }}
        >
          Post Blog
        </Typography.Title>
        <PHForm onSubmit={onSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <PHInput
              type="text"
              name="title"
              label="Title"
              placeholder="Enter blog title"
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <PHInput
              type="text"
              name="author"
              label="Author Name"
              placeholder="Enter author name"
            />
          </div>
          <div style={{ marginBottom: "16px", height: "15rem" }}>
            <PHTextEditor
              type="text"
              name="description"
              label="Description"
              placeholder="Write Description"
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <PHFileInput
              name="file"
              label="Insert Image"
              accept="image/*" // Example: restrict to image files
              onFileChange={handleFileChange}
            />
          </div>
          <Button type="primary" htmlType="submit" block>
            Post Blog
          </Button>
        </PHForm>
      </Col>
    </Row>
  );
};

export default CreateBlog;
