import { Row, Col, Typography, Button, Input } from "antd";
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
    // handle form submission
    console.log(data);
    console.log(selectedFile);

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

  return (
    <Row
      justify="center"
      style={{
        background: "#010313",
        padding: "24px 0", // Top and bottom padding
      }}
    >
      <Col
        xs={22}
        sm={20}
        md={16}
        lg={12}
        xl={8}
        style={{
          background: "#170F21",
          padding: "32px",
          borderRadius: "12px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)", // Softer shadow
        }}
      >
        <Typography.Title
          level={3}
          style={{
            textAlign: "center",
            marginBottom: "32px",
            color: "white", // Primary color for the title
          }}
        >
          Publish Project
        </Typography.Title>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Project Name Input */}
            <div style={{ marginBottom: "24px" }}>
              <Typography.Text
                style={{
                  marginBottom: "8px",
                  display: "block",
                  color: "white",
                }}
              >
                Project Name:
              </Typography.Text>
              <PHInput
                type="text"
                name="name"
                placeholder="Enter project name"
              />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <Typography.Text
                style={{
                  marginBottom: "8px",
                  display: "block",
                  color: "white",
                }}
              >
                Github Link:
              </Typography.Text>
              <PHInput
                type="text"
                name="github"
                placeholder="Enter project name"
              />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <Typography.Text
                style={{
                  marginBottom: "8px",
                  display: "block",
                  color: "white",
                }}
              >
                Live Link:
              </Typography.Text>
              <PHInput
                type="text"
                name="liveLink"
                placeholder="Enter project name"
              />
            </div>

            {/* Technologies Section */}
            <div style={{ marginBottom: "24px" }}>
              <Typography.Text
                style={{
                  marginBottom: "8px",
                  display: "block",
                  color: "white",
                }}
              >
                Technologies:
              </Typography.Text>
              <Button
                type="dashed"
                onClick={() => append("")}
                style={{
                  margin: "16px 0",
                  width: "100%",
                  display: "block",
                }}
              >
                Add Technology
              </Button>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Controller
                      name={`technologies.${index}`}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Enter technology"
                          style={{
                            width: "100%", // Make input take full width
                          }}
                        />
                      )}
                    />
                  </div>
                  <Button
                    type="default"
                    onClick={() => remove(index)}
                    danger
                    style={{
                      marginLeft: "8px",
                      padding: "0 12px",
                    }}
                  >
                    <DeleteOutlined />
                  </Button>
                </div>
              ))}
            </div>

            {/* Description Section */}
            <div style={{ marginBottom: "32px" }}>
              <Typography.Text
                style={{
                  marginBottom: "8px",
                  display: "block",
                  color: "white",
                }}
              >
                Description:
              </Typography.Text>
              <PHTextEditor
                type="text"
                name="description"
                placeholder="Write description here"
              />
            </div>
            <br />
            {/* File Input */}
            <div style={{ marginBottom: "24px" }}>
              <Typography.Text
                style={{
                  marginBottom: "8px",
                  display: "block",
                  color: "white",
                }}
              >
                Insert Image:
              </Typography.Text>
              <PHFileInput
                name="file"
                accept="image/*"
                onFileChange={handleFileChange}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ fontSize: "16px" }}
            >
              Publish Project
            </Button>
          </form>
        </FormProvider>
      </Col>
    </Row>
  );
};

export default CreateProject;
