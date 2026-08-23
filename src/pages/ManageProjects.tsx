import {
  Button,
  Col,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Switch,
  Tag,
  Typography,
} from "antd";
import { Table } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  GithubOutlined,
  PlusOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import PHInput from "../components/form/PHInput";
import {
  Controller,
  FieldValues,
  FormProvider,
  useForm,
} from "react-hook-form";
import PHFileInput from "../components/form/PHFileInput";
import { toast } from "sonner";
import {
  useDeleteProjectMutation,
  useGetProjectsQuery,
  useUpdateProjectMutation,
} from "../redux/services/projectApi";
import { IModernProject } from "../types/project";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const ManageProjects = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setViewIsModalOpen] = useState(false);
  const { data } = useGetProjectsQuery(null);
  const [deleteProject] = useDeleteProjectMutation();
  const [isEditing, setIsEditing] = useState<IModernProject | null>(null);
  const [isView, setIsView] = useState<IModernProject | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [updateProject] = useUpdateProjectMutation();

  const methods = useForm();

  useEffect(() => {
    if (isEditing) {
      methods.reset({
        name: isEditing.name,
        slug: isEditing.slug,
        tagline: isEditing.tagline,
        category: isEditing.category || "Full-Stack",
        status: isEditing.status || "Active",
        featured: isEditing.featured || false,
        links: {
          live: isEditing.links?.live || "",
          githubClient: isEditing.links?.githubClient || "",
          githubServer: isEditing.links?.githubServer || "",
          apiDocs: isEditing.links?.apiDocs || "",
          videoDemo: isEditing.links?.videoDemo || "",
        },
      });
    }
  }, [isEditing, methods]);

  const { control, handleSubmit } = methods;

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const projects: IModernProject[] = data?.data || [];

  const dataSource = projects.map((project) => {
    return {
      key: project._id || project.slug,
      _id: project._id,
      name: project.name,
      slug: project.slug,
      tagline: project.tagline,
      category: project.category,
      status: project.status,
      featured: project.featured,
      thumbnail: project.thumbnail,
      technologies: project.technologies,
      keyHighlights: project.keyHighlights,
      metrics: project.metrics,
      links: project.links,
      caseStudy: project.caseStudy,
      createdAt: project.createdAt
        ? new Date(project.createdAt).toLocaleDateString()
        : "-",
      raw: project,
    };
  });

  const onDeleteProject = (record: any) => {
    Modal.confirm({
      title: "Are you sure you want to delete this project?",
      content: `This will permanently remove "${record.name}".`,
      okText: "Yes, Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteProject(record.key || record._id).unwrap();
          toast.success("Project deleted successfully");
        } catch {
          toast.error("Failed to delete project");
        }
      },
    });
  };

  const columns = [
    {
      title: "Project Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <div>
          <span style={{ fontWeight: 600, color: "#fff" }}>{text}</span>
          {record.slug && (
            <span style={{ display: "block", fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>
              /{record.slug}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string) => {
        let color = "blue";
        if (category === "Security & Systems") color = "purple";
        if (category === "AI & Realtime") color = "cyan";
        if (category === "Frontend") color = "green";
        if (category === "Backend") color = "orange";
        return <Tag color={color}>{category || "Full-Stack"}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: any) => (
        <Space>
          <Tag color={status === "Production" ? "gold" : status === "Completed" ? "success" : "processing"}>
            {status || "Active"}
          </Tag>
          {record.featured && <Tag color="magenta">Featured</Tag>}
        </Space>
      ),
    },
    {
      title: "Links",
      key: "links",
      render: (record: any) => {
        const liveUrl = record.links?.live;
        const gitUrl = record.links?.githubClient || record.links?.githubServer;
        return (
          <Space>
            {liveUrl && (
              <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                <GlobalOutlined style={{ color: "#38bdf8", fontSize: "16px" }} />
              </a>
            )}
            {gitUrl && (
              <a href={gitUrl} target="_blank" rel="noopener noreferrer">
                <GithubOutlined style={{ color: "#fff", fontSize: "16px" }} />
              </a>
            )}
          </Space>
        );
      },
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      key: "actions",
      title: "Actions",
      render: (record: any) => {
        return (
          <Space>
            <Button
              type="text"
              icon={<EyeOutlined style={{ color: "#38bdf8" }} />}
              onClick={() => showViewModal(record.raw || record)}
            />
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#a855f7" }} />}
              onClick={() => showModal(record.raw || record)}
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDeleteProject(record)}
            />
          </Space>
        );
      },
    },
  ];

  const showModal = (record: IModernProject) => {
    setIsEditing(record);
    setIsModalOpen(true);
  };

  const showViewModal = (record: IModernProject) => {
    setIsView(record);
    setViewIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setViewIsModalOpen(false);
  };

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading("Updating project....");
    const formData = new FormData();
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    const updatedData = {
      key: isEditing?._id || isEditing?.slug,
      _id: isEditing?._id,
      id: isEditing?._id,
      ...data,
    };

    try {
      formData.append("data", JSON.stringify(updatedData));
      await updateProject(formData).unwrap();
      toast.success("Successfully Updated Project.", {
        id: toastId,
        duration: 2000,
      });
      setIsModalOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMsg =
        error?.data?.message || "Failed to update project. Please try again.";
      toast.error(errorMsg, { id: toastId, duration: 2000 });
    }
  };

  const renderTechList = (technologies: any) => {
    if (!technologies) return <li>None specified</li>;
    if (Array.isArray(technologies)) {
      return technologies.map((t, idx) => <Tag key={idx} color="blue" style={{ marginBottom: "4px" }}>{t}</Tag>);
    }
    if (typeof technologies === "object") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {technologies.frontend?.length > 0 && (
            <div><strong>Frontend:</strong> {technologies.frontend.map((t: string, i: number) => <Tag key={i} color="cyan">{t}</Tag>)}</div>
          )}
          {technologies.backend?.length > 0 && (
            <div><strong>Backend:</strong> {technologies.backend.map((t: string, i: number) => <Tag key={i} color="purple">{t}</Tag>)}</div>
          )}
          {technologies.database?.length > 0 && (
            <div><strong>Database:</strong> {technologies.database.map((t: string, i: number) => <Tag key={i} color="orange">{t}</Tag>)}</div>
          )}
          {technologies.devops?.length > 0 && (
            <div><strong>DevOps:</strong> {technologies.devops.map((t: string, i: number) => <Tag key={i} color="green">{t}</Tag>)}</div>
          )}
        </div>
      );
    }
    return <li>{String(technologies)}</li>;
  };

  const labelStyle: React.CSSProperties = {
    marginBottom: "4px",
    display: "block",
    color: "#fff",
    fontWeight: 500,
  };

  return (
    <div style={{ background: "#010313", minHeight: "100vh", padding: "20px" }}>
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <Typography.Title level={3} style={{ color: "#fff", margin: 0 }}>
            Manage Projects
          </Typography.Title>
          <Typography.Text style={{ color: "rgba(255,255,255,0.55)" }}>
            Review, edit, and organize all projects on your portfolio
          </Typography.Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{
            height: "42px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #7c3aed, #2563eb)",
            border: "none",
            fontWeight: 600,
          }}
          onClick={() => navigate("/add-project")}
        >
          Publish Project
        </Button>
      </div>

      <Table
        dataSource={dataSource}
        columns={columns}
        rowClassName={() => "dark-row"}
        style={{ background: "#170F21", borderRadius: "12px", overflow: "hidden" }}
      />

      {/* Edit Modal */}
      <Modal
        title="Edit Modern Project"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={720}
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Typography.Text style={labelStyle}>Project Name</Typography.Text>
                <PHInput name="name" type="text" placeholder="Project Name" />
              </Col>

              <Col xs={24} md={12}>
                <Typography.Text style={labelStyle}>SEO Slug</Typography.Text>
                <PHInput name="slug" type="text" placeholder="Slug (e.g. zlocker)" />
              </Col>

              <Col xs={24}>
                <Typography.Text style={labelStyle}>Tagline</Typography.Text>
                <PHInput name="tagline" type="text" placeholder="Crisp project summary" />
              </Col>

              <Col xs={24} md={8}>
                <Typography.Text style={labelStyle}>Category</Typography.Text>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} style={{ width: "100%" }}>
                      <Option value="Full-Stack">Full-Stack</Option>
                      <Option value="Frontend">Frontend</Option>
                      <Option value="Backend">Backend</Option>
                      <Option value="Security & Systems">Security & Systems</Option>
                      <Option value="AI & Realtime">AI & Realtime</Option>
                    </Select>
                  )}
                />
              </Col>

              <Col xs={24} md={8}>
                <Typography.Text style={labelStyle}>Status</Typography.Text>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} style={{ width: "100%" }}>
                      <Option value="Active">Active</Option>
                      <Option value="Production">Production</Option>
                      <Option value="Completed">Completed</Option>
                    </Select>
                  )}
                />
              </Col>

              <Col xs={24} md={8}>
                <Typography.Text style={labelStyle}>Featured</Typography.Text>
                <div style={{ marginTop: "4px" }}>
                  <Controller
                    name="featured"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                        checkedChildren="Yes"
                        unCheckedChildren="No"
                      />
                    )}
                  />
                </div>
              </Col>

              <Col xs={24} md={12}>
                <Typography.Text style={labelStyle}>Live Link</Typography.Text>
                <PHInput name="links.live" type="text" placeholder="Live website URL" />
              </Col>

              <Col xs={24} md={12}>
                <Typography.Text style={labelStyle}>GitHub Client</Typography.Text>
                <PHInput name="links.githubClient" type="text" placeholder="Client repository URL" />
              </Col>

              <Col xs={24} md={12}>
                <Typography.Text style={labelStyle}>GitHub Server</Typography.Text>
                <PHInput name="links.githubServer" type="text" placeholder="Server repository URL" />
              </Col>

              <Col xs={24} md={12}>
                <Typography.Text style={labelStyle}>Video Demo</Typography.Text>
                <PHInput name="links.videoDemo" type="text" placeholder="Demo video link" />
              </Col>

              <Col xs={24}>
                <Typography.Text style={labelStyle}>Update Thumbnail</Typography.Text>
                <PHFileInput
                  name="file"
                  accept="image/*"
                  onFileChange={handleFileChange}
                />
              </Col>

              <Col xs={24}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  style={{
                    height: "44px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                    fontWeight: 600,
                  }}
                >
                  Save Changes
                </Button>
              </Col>
            </Row>
          </form>
        </FormProvider>
      </Modal>

      {/* View Project Modal */}
      <Modal
        title="Project Details"
        open={isViewModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        {isView && (
          <Row gutter={[20, 20]}>
            <Col xs={24} md={10}>
              <Image
                src={isView.thumbnail || "https://via.placeholder.com/300"}
                alt={isView.name}
                style={{ borderRadius: "10px", objectFit: "cover" }}
                width="100%"
                preview={true}
              />
              <div style={{ marginTop: "12px" }}>
                <Space wrap>
                  <Tag color="blue">{isView.category}</Tag>
                  <Tag color="green">{isView.status}</Tag>
                  {isView.featured && <Tag color="magenta">Featured</Tag>}
                </Space>
              </div>
            </Col>

            <Col xs={24} md={14}>
              <Typography.Title level={4} style={{ marginBottom: "4px" }}>
                {isView.name}
              </Typography.Title>
              {isView.slug && (
                <Typography.Text type="secondary" style={{ display: "block", marginBottom: "12px" }}>
                  URL Slug: /{isView.slug}
                </Typography.Text>
              )}

              {isView.tagline && (
                <p style={{ fontStyle: "italic", marginBottom: "12px", color: "rgba(255,255,255,0.8)" }}>
                  {isView.tagline}
                </p>
              )}

              <Typography.Text strong style={{ display: "block", marginTop: "12px" }}>
                Tech Stack:
              </Typography.Text>
              <div style={{ margin: "6px 0 12px" }}>
                {renderTechList(isView.technologies)}
              </div>

              {isView.keyHighlights && isView.keyHighlights.length > 0 && (
                <div style={{ marginBottom: "12px" }}>
                  <Typography.Text strong>Key Highlights:</Typography.Text>
                  <ul style={{ paddingLeft: "20px", marginTop: "4px" }}>
                    {isView.keyHighlights.map((hl, idx) => (
                      <li key={idx}>{hl}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Space wrap style={{ marginTop: "12px" }}>
                {isView.links?.live && (
                  <Button
                    type="primary"
                    icon={<GlobalOutlined />}
                    onClick={() => window.open(isView.links.live, "_blank")}
                  >
                    Live Demo
                  </Button>
                )}
                {isView.links?.githubClient && (
                  <Button
                    icon={<GithubOutlined />}
                    onClick={() => window.open(isView.links.githubClient, "_blank")}
                  >
                    Client Repo
                  </Button>
                )}
                {isView.links?.githubServer && (
                  <Button
                    icon={<GithubOutlined />}
                    onClick={() => window.open(isView.links.githubServer, "_blank")}
                  >
                    Server Repo
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        )}
      </Modal>
    </div>
  );
};

export default ManageProjects;

