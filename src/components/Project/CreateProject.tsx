import { Row, Col, Typography, Button, Input, Divider } from "antd";
import PHInput from "../form/PHInput";
import {
  Controller,
  FieldValues,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import PHTextEditor from "../form/PHTextEditor";
import PHFileInput from "../form/PHFileInput";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import { useAddProjectMutation } from "../../redux/services/projectApi";

const CreateProject = () => {
  const [addProject] = useAddProjectMutation();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const methods = useForm();
  const { control, handleSubmit } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "technologies",
  });

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading("Project posting....");
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    const formData = new FormData();

    try {
      formData.append("data", JSON.stringify(data));
      formData.append("file", selectedFile);
      await addProject(formData).unwrap();
      toast.success("Successfully Posted Project.", {
        id: toastId,
        duration: 2000,
      });
      navigate("/manage-projects");
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
            Publish Project
          </Typography.Title>

          <Typography.Text
            style={{
              display: "block",
              textAlign: "center",
              color: "rgba(255,255,255,0.55)",
              marginBottom: "32px",
            }}
          >
            Add your project details and publish it to your portfolio
          </Typography.Text>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row gutter={[16, 18]}>
                <Col xs={24}>
                  <Typography.Text style={labelStyle}>
                    Project Name
                  </Typography.Text>
                  <PHInput
                    type="text"
                    name="name"
                    placeholder="Enter project name"
                  />
                </Col>

                <Col xs={24} lg={12}>
                  <Typography.Text style={labelStyle}>GitHub</Typography.Text>
                  <PHInput
                    type="text"
                    name="github"
                    placeholder="Enter GitHub repository link"
                  />
                </Col>

                <Col xs={24} lg={12}>
                  <Typography.Text style={labelStyle}>
                    Live Link
                  </Typography.Text>
                  <PHInput
                    type="text"
                    name="liveLink"
                    placeholder="Enter live project link"
                  />
                </Col>

                <Col xs={24}>
                  <Typography.Text style={labelStyle}>
                    Technologies
                  </Typography.Text>

                  <Button
                    type="dashed"
                    onClick={() => append("")}
                    style={{
                      margin: "12px 0 16px",
                      width: "100%",
                      height: "42px",
                      borderRadius: "10px",
                      borderColor: "rgba(255,255,255,0.25)",
                      background: "rgba(255,255,255,0.04)",
                      color: "#fff",
                    }}
                  >
                    + Add Technology
                  </Button>

                  <Row gutter={[12, 12]}>
                    {fields.map((field, index) => (
                      <Col key={field.id} xs={24} md={12}>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            width: "100%",
                          }}
                        >
                          <Controller
                            name={`technologies.${index}`}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="Enter technology"
                                style={{
                                  height: "42px",
                                  borderRadius: "10px",
                                  background: "#24182f",
                                  borderColor: "rgba(255,255,255,0.12)",
                                  color: "#fff",
                                }}
                              />
                            )}
                          />

                          <Button
                            danger
                            onClick={() => remove(index)}
                            style={{
                              height: "42px",
                              borderRadius: "10px",
                              flexShrink: 0,
                            }}
                          >
                            <DeleteOutlined />
                          </Button>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Col>

                <Col xs={24}>
                  <Typography.Text style={labelStyle}>
                    Description
                  </Typography.Text>

                  <PHTextEditor
                    type="text"
                    name="description"
                    placeholder="Write description here"
                  />
                </Col>

                <Divider dashed />

                <Col xs={24}>
                  <Typography.Text style={labelStyle}>
                    Insert Image
                  </Typography.Text>

                  <div>
                    <PHFileInput
                      name="file"
                      accept="image/*"
                      onFileChange={handleFileChange}
                    />
                  </div>
                </Col>

                <Col xs={24}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    style={{
                      height: "46px",
                      borderRadius: "12px",
                      fontSize: "16px",
                      fontWeight: 600,
                      background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                      border: "none",
                      boxShadow: "0 10px 24px rgba(124, 58, 237, 0.35)",
                    }}
                  >
                    Publish Project
                  </Button>
                </Col>
              </Row>
            </form>
          </FormProvider>
        </div>
      </Col>
    </Row>
  );
};

export default CreateProject;
