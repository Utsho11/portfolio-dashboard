import { Button, Col, Image, Input, Modal, Row, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { Table } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  GithubOutlined,
  PlusOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import PHInput from "../components/form/PHInput";
import PHTextEditor from "../components/form/PHTextEditor";
import {
  Controller,
  FieldValues,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import PHFileInput from "../components/form/PHFileInput";
import { toast } from "sonner";
import {
  useDeleteProjectMutation,
  useGetProjectsQuery,
  useUpdateProjectMutation,
} from "../redux/services/projectApi";
import { TProject } from "../types/project";

type TRecord = {
  key: string;
  name: string;
  image?: string;
  description: string;
  github: string;
  liveLink?: string;
  technologies: string[];
  createdAt: string;
};

type TFormConfig = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValues?: Record<string, any> & TRecord;
};

const ManageProjects = () => {
  const formConfig: TFormConfig = {};
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setViewIsModalOpen] = useState(false);
  const { data } = useGetProjectsQuery(null);
  const [deleteProject] = useDeleteProjectMutation();
  const [isEditing, setIsEditing] = useState<TRecord>();
  const [isView, setIsView] = useState<TRecord>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [updateProject] = useUpdateProjectMutation();

  const methods = useForm(formConfig);

  useEffect(() => {
    if (isEditing) {
      methods.reset({
        name: isEditing.name,
        description: isEditing.description,
        github: isEditing.github,
        liveLink: isEditing.liveLink,
        technologies: isEditing.technologies || [""],
      });
    }
  }, [isEditing, methods]);

  const { control, handleSubmit } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "technologies",
  });

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  // console.log(data?.data);

  const projects: TProject[] = data?.data || [];

  const dataSource = projects.map((project) => {
    return {
      key: project._id,
      name: project.name,
      description: project.description,
      image: project.image,
      technologies: project.technologies,
      github: project.github,
      liveLink: project.liveLink,
      createdAt: new Date(project.createdAt).toLocaleString(),
    };
  });

  const onDeleteStudent = (record: TRecord) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this project record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        deleteProject(record.key);
      },
    });
  };

  const columns = [
    {
      title: "Project Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Github Link",
      dataIndex: "github",
      key: "github",
    },
    {
      title: "Live Link",
      dataIndex: "liveLink",
      key: "liveLink",
    },
    {
      title: "Post Date",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      key: "5",
      title: "Actions",
      render: (record: TRecord) => {
        return (
          <>
            <EyeOutlined
              onClick={() => {
                showViewModal(record);
              }}
            />
            <EditOutlined
              onClick={() => {
                showModal(record);
              }}
              style={{ color: "blue", marginLeft: 12 }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteStudent(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  const showModal = (record: TRecord) => {
    setIsModalOpen(true);
    setIsEditing(record);
  };

  const showViewModal = (record: TRecord) => {
    setViewIsModalOpen(true);
    setIsView(record);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setViewIsModalOpen(false);
  };

  const onSubmit = async (data: FieldValues) => {
    console.log(data);
    const toastId = toast.loading("Project posting....");
    const formData = new FormData();
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    const updatedData = {
      key: isEditing?.key,
      ...data,
    };

    try {
      formData.append("data", JSON.stringify(updatedData));
      await updateProject(formData).unwrap();
      toast.success("Successfully Posted Blog.", {
        id: toastId,
        duration: 2000,
      });
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
      console.log(error);
    }
  };

  const handleRedirectGithub = (link?: string) => {
    if (link) {
      window.open(link, "_blank"); // Open in a new tab
    } else {
      console.error("GitHub link is not available");
    }
  };
  const handleRedirectLive = (link?: string) => {
    if (link) {
      window.open(link, "_blank"); // Open in a new tab
    } else {
      console.error("GitHub link is not available");
    }
  };

  return (
    <div className="">
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h3 style={{ color: "white" }}>Click here to post a blog...</h3>
        <Button
          type="primary"
          onClick={() => {
            navigate("/add-project");
          }}
        >
          <PlusOutlined />
          Publish Project
        </Button>
      </div>
      <div className="">
        <Table dataSource={dataSource} columns={columns} />
        <Modal
          title="Edit Project"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <Row justify="center">
            <Col
              style={{
                background: "#fff",
                padding: "24px",
                borderRadius: "8px",
              }}
            >
              <Typography.Title
                level={3}
                style={{ textAlign: "center", marginBottom: "24px" }}
              >
                Edit Project
              </Typography.Title>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Project Name Input */}
                  <div style={{ marginBottom: "24px" }}>
                    <Typography.Text
                      style={{ marginBottom: "8px", display: "block" }}
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
                      style={{ marginBottom: "8px", display: "block" }}
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
                      style={{ marginBottom: "8px", display: "block" }}
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
                      style={{ marginBottom: "8px", display: "block" }}
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
        </Modal>
        <Modal
          title="View Project"
          open={isViewModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <Row gutter={16}>
            {/* Left side: Image */}
            <Col span={10}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  // background: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                }}
              >
                <Image
                  src={isView?.image || "https://via.placeholder.com/300"}
                  alt={isView?.name || "Blog Image"}
                  style={{ borderRadius: "8px" }}
                  width="100%"
                  height="auto"
                  preview={true}
                />
              </div>
            </Col>

            {/* Right side: Blog details */}
            <Col span={14}>
              <Typography.Title level={3}>{isView?.name}</Typography.Title>
              <Typography.Text strong>Author:</Typography.Text>
              <Typography.Text strong>Description:</Typography.Text>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    isView?.description || "<p>No description available</p>",
                }}
                style={{
                  whiteSpace: "pre-wrap", // Preserve spacing and formatting
                }}
              />
              <Typography.Text strong>Technologies Used: </Typography.Text>
              <ul>
                {isView?.technologies?.map((tech, index) => (
                  <li key={index}>{tech}</li>
                ))}
              </ul>
              <div style={{ marginBottom: "1rem" }}>
                <Button
                  style={{ marginRight: "4px" }}
                  onClick={() => handleRedirectGithub(isView?.github)}
                  type="primary"
                  icon={<GithubOutlined />}
                >
                  GitHub
                </Button>
                <Button
                  style={{ marginRight: "4px" }}
                  onClick={() => handleRedirectLive(isView?.github)}
                  type="primary"
                  icon={<WifiOutlined />}
                >
                  Live Link
                </Button>
              </div>
              <Typography.Text strong>
                Post Date:{isView?.createdAt}
              </Typography.Text>
            </Col>
          </Row>
        </Modal>
      </div>
    </div>
  );
};

export default ManageProjects;
