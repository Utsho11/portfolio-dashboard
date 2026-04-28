import { Row, Col, Typography, Button, Divider } from "antd";
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

  const labelStyle: React.CSSProperties = {
    marginBottom: "2px",
    display: "block",
    color: "rgba(255,255,255,0.85)",
    fontWeight: 500,
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        minHeight: "100vh",
        background: "#010313",
        padding: "24px 12px",
      }}
    >
      <Col xs={24} sm={22} md={20} lg={18} xl={14} xxl={10}>
        <div
          style={{
            background: "rgba(23, 15, 33, 0.95)",
            padding: "clamp(20px, 4vw, 36px)",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.45)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Typography.Title
            level={2}
            style={{
              textAlign: "center",
              marginBottom: "8px",
              color: "#fff",
              fontWeight: 700,
              fontSize: "clamp(24px, 4vw, 32px)",
            }}
          >
            Post Blog
          </Typography.Title>

          <Typography.Text
            style={{
              display: "block",
              textAlign: "center",
              color: "rgba(255,255,255,0.55)",
              marginBottom: "32px",
            }}
          >
            Add your blog and publish it to your portfolio.
          </Typography.Text>

          <PHForm onSubmit={onSubmit}>
            <Row gutter={[16, 18]}>
              <Col xs={24}>
                <PHInput
                  type="text"
                  name="title"
                  label="Title"
                  placeholder="Enter blog title"
                />
              </Col>

              <Col xs={24}>
                <PHInput
                  type="text"
                  name="author"
                  label="Author Name"
                  placeholder="Enter author name"
                />
              </Col>

              <Col xs={24}>
                <Typography.Text style={labelStyle}>
                  Description
                </Typography.Text>
                <PHTextEditor
                  type="text"
                  name="description"
                  placeholder="Write Description"
                />
              </Col>
              <Divider dashed />

              <Col xs={24}>
                <Typography.Text style={labelStyle}>
                  Insert Image
                </Typography.Text>
                <div className="">
                  <PHFileInput
                    name="file"
                    accept="image/*" // Example: restrict to image files
                    onFileChange={handleFileChange}
                  />
                </div>
              </Col>

              <Col xs={24}>
                <Button type="primary" htmlType="submit" block>
                  Post Blog
                </Button>
              </Col>
            </Row>
          </PHForm>
        </div>
      </Col>
    </Row>
  );
};

export default CreateBlog;
