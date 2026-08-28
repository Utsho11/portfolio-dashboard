import React, { useState, useMemo } from "react";
import {
  Button,
  Col,
  Divider,
  Image,
  Modal,
  Row,
  Typography,
  Table,
  Input,
  Select,
  Tag,
  Space,
  Card,
  Switch,
  Tooltip,
  Radio,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  useDeleteBlogMutation,
  useGetBlogsQuery,
  useUpdateBlogMutation,
  useTogglePublishBlogMutation,
} from "../redux/services/blogApi";
import { TBlog } from "../types/blog";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  StopOutlined,
  UploadOutlined,
  CalendarOutlined,
  UserOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { useForm, Controller, FieldValues } from "react-hook-form";
import PHTextEditor from "../components/form/PHTextEditor";
import { toast } from "sonner";

const defaultCategories = [
  "All",
  "Frontend Development",
  "Backend & Systems",
  "Next.js & React",
  "TypeScript & Architecture",
  "DevOps & Cloud",
  "Security & Performance",
  "Database & State",
  "Career & Engineering",
];

const ManageBlogs: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setViewIsModalOpen] = useState(false);
  const { data, isLoading } = useGetBlogsQuery(null);
  const [deleteBlog] = useDeleteBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const [togglePublishBlog] = useTogglePublishBlogMutation();

  const [isEditing, setIsEditing] = useState<TBlog | null>(null);
  const [isView, setIsView] = useState<TBlog | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      author: "",
      category: "Frontend Development",
      tags: [] as string[],
      isPublished: true,
      description: "",
    },
  });

  const blogs: TBlog[] = data?.data || [];

  // Filtered & Searched Blogs
  const filteredBlogs = useMemo(() => {
    return blogs
      .filter((blog) => {
        // Search Filter
        const query = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !query ||
          blog.title?.toLowerCase().includes(query) ||
          blog.author?.toLowerCase().includes(query) ||
          blog.description?.toLowerCase().includes(query) ||
          blog.tags?.some((t) => t.toLowerCase().includes(query));

        // Category Filter
        const matchesCategory =
          selectedCategory === "All" || blog.category === selectedCategory;

        // Status Filter
        const matchesStatus =
          selectedStatus === "All" ||
          (selectedStatus === "Published" && blog.isPublished !== false) ||
          (selectedStatus === "Blocked" && blog.isPublished === false);

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
      });
  }, [blogs, searchTerm, selectedCategory, selectedStatus, sortOrder]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const showModal = (record: TBlog) => {
    setIsEditing(record);
    setSelectedFile(null);
    setPreviewUrl(null);
    reset({
      title: record.title,
      author: record.author,
      category: record.category || "Frontend Development",
      tags: record.tags || [],
      isPublished: record.isPublished !== false,
      description: record.description,
    });
    setIsModalOpen(true);
  };

  const showViewModal = (record: TBlog) => {
    setIsView(record);
    setViewIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setViewIsModalOpen(false);
    setIsEditing(null);
    setIsView(null);
  };

  const onTogglePublish = async (record: TBlog) => {
    const toastId = toast.loading("Updating status...");
    try {
      if (record._id) {
        await togglePublishBlog(record._id).unwrap();
        toast.success(
          `Blog is now ${record.isPublished === false ? "Published" : "Blocked"}`,
          { id: toastId, duration: 2000 }
        );
      }
    } catch {
      // Fallback update via updateBlog
      const formData = new FormData();
      const updatedData = {
        _id: record._id,
        id: record._id,
        isPublished: record.isPublished === false ? true : false,
      };
      formData.append("data", JSON.stringify(updatedData));
      try {
        await updateBlog(formData).unwrap();
        toast.success("Status updated", { id: toastId, duration: 2000 });
      } catch (err) {
        toast.error("Failed to update publish status", { id: toastId });
        console.error(err);
      }
    }
  };

  const onDeleteBlog = (record: TBlog) => {
    Modal.confirm({
      title: "Delete Blog Article",
      content: `Are you sure you want to permanently delete "${record.title}"?`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        const toastId = toast.loading("Deleting blog...");
        try {
          await deleteBlog(record._id).unwrap();
          toast.success("Blog deleted successfully", { id: toastId });
        } catch {
          toast.error("Failed to delete blog", { id: toastId });
        }
      },
    });
  };

  const onSubmit = async (formValues: FieldValues) => {
    const toastId = toast.loading("Updating blog....");
    const formData = new FormData();

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    const updatedData = {
      _id: isEditing?._id,
      id: isEditing?._id,
      key: isEditing?._id,
      ...formValues,
    };

    try {
      formData.append("data", JSON.stringify(updatedData));
      await updateBlog(formData).unwrap();
      toast.success("Successfully Updated Blog.", {
        id: toastId,
        duration: 2000,
      });
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
      console.error(error);
    }
  };

  const columns = [
    {
      title: "Cover",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (image: string, record: TBlog) => (
        <div style={{ width: 80, height: 50, borderRadius: 6, overflow: "hidden", background: "#131b30" }}>
          {image ? (
            <Image
              src={image}
              alt={record.title}
              width={80}
              height={50}
              style={{ objectFit: "cover" }}
              preview={true}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontSize: 10 }}>
              No Cover
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Title & Category",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: TBlog) => (
        <div>
          <Typography.Text strong style={{ color: "#f8fafc", fontSize: 14, display: "block" }}>
            {title}
          </Typography.Text>
          <div style={{ marginTop: 4 }}>
            <Tag color="blue" style={{ fontSize: 11 }}>
              {record.category || "General"}
            </Tag>
            {record.tags && record.tags.slice(0, 2).map((t, idx) => (
              <Tag key={idx} color="cyan" style={{ fontSize: 10 }}>
                #{t}
              </Tag>
            ))}
            {record.tags && record.tags.length > 2 && (
              <span style={{ color: "#64748b", fontSize: 10 }}>+{record.tags.length - 2}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      width: 140,
      render: (author: string) => (
        <span style={{ color: "#cbd5e1", fontSize: 13 }}>
          <UserOutlined style={{ marginRight: 6, color: "#3b82f6" }} />
          {author}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "isPublished",
      key: "isPublished",
      width: 150,
      render: (isPublished: boolean, record: TBlog) => {
        const isLive = isPublished !== false;
        return (
          <Space orientation="horizontal" size="small">
            <Switch
              checked={isLive}
              onChange={() => onTogglePublish(record)}
              checkedChildren="Live"
              unCheckedChildren="Blocked"
              style={{ background: isLive ? "#10b981" : "#f59e0b" }}
            />
            <Tag color={isLive ? "success" : "warning"}>
              {isLive ? "Published" : "Blocked"}
            </Tag>
          </Space>
        );
      },
    },
    {
      title: "Post Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      render: (createdAt: string) => (
        <span style={{ color: "#94a3b8", fontSize: 12 }}>
          <CalendarOutlined style={{ marginRight: 4 }} />
          {new Date(createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      width: 130,
      render: (record: TBlog) => (
        <Space size="middle">
          <Tooltip title="View Full Article">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => showViewModal(record)}
              style={{ color: "#22d3ee" }}
            />
          </Tooltip>
          <Tooltip title="Edit Article">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
              style={{ color: "#3b82f6" }}
            />
          </Tooltip>
          <Tooltip title="Delete Article">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => onDeleteBlog(record)}
              style={{ color: "#ef4444" }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const labelStyle: React.CSSProperties = {
    marginBottom: "6px",
    display: "block",
    color: "#cbd5e1",
    fontWeight: 600,
    fontSize: "13px",
  };

  return (
    <div style={{ background: "#010313", minHeight: "100vh", padding: "24px 16px 48px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header Ribbon */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div>
            <Typography.Title level={2} style={{ color: "#f8fafc", margin: 0, fontWeight: 800 }}>
              Manage Blog Articles
            </Typography.Title>
            <Typography.Text style={{ color: "#94a3b8" }}>
              Publish, filter, edit, view, and organize technical articles for your portfolio.
            </Typography.Text>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate("/add-blog")}
            style={{ background: "#3b82f6", fontWeight: 700 }}
          >
            Create New Blog
          </Button>
        </div>

        {/* Filter & Search Bar */}
        <Card
          style={{
            background: "#0d1220",
            borderColor: "rgba(255,255,255,0.08)",
            borderRadius: "12px",
            marginBottom: "24px",
          }}
          bodyStyle={{ padding: "16px" }}
        >
          <Row gutter={[16, 16]} align="middle">
            {/* Search Input */}
            <Col xs={24} md={10} lg={8}>
              <Input
                placeholder="Search by title, author, description, tags..."
                prefix={<SearchOutlined style={{ color: "#3b82f6" }} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
                style={{
                  background: "#05070d",
                  borderColor: "rgba(255,255,255,0.15)",
                  color: "#f8fafc",
                  height: "40px",
                }}
              />
            </Col>

            {/* Category Filter */}
            <Col xs={12} md={7} lg={6}>
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                style={{ width: "100%", height: "40px" }}
                options={defaultCategories.map((c) => ({
                  label: c === "All" ? "All Categories" : c,
                  value: c,
                }))}
              />
            </Col>

            {/* Status Filter */}
            <Col xs={12} md={7} lg={5}>
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                style={{ width: "100%", height: "40px" }}
                options={[
                  { label: "All Statuses", value: "All" },
                  { label: "Published (Live)", value: "Published" },
                  { label: "Blocked (Draft)", value: "Blocked" },
                ]}
              />
            </Col>

            {/* Sort Order */}
            <Col xs={24} lg={5} style={{ textAlign: "right" }}>
              <Select
                value={sortOrder}
                onChange={setSortOrder}
                style={{ width: "100%", height: "40px" }}
                options={[
                  { label: "Date: Newest First", value: "desc" },
                  { label: "Date: Oldest First", value: "asc" },
                ]}
              />
            </Col>
          </Row>
        </Card>

        {/* Blog Table */}
        <Card
          style={{
            background: "#0d1220",
            borderColor: "rgba(255,255,255,0.08)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
          bodyStyle={{ padding: 0 }}
        >
          <Table
            loading={isLoading}
            dataSource={filteredBlogs}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 8, showSizeChanger: true }}
            scroll={{ x: 800 }}
          />
        </Card>

        {/* ------------------------------------------------------------- */}
        {/* EDIT BLOG MODAL */}
        {/* ------------------------------------------------------------- */}
        <Modal
          title={
            <span style={{ color: "#f8fafc", fontSize: "18px", fontWeight: 700 }}>
              <EditOutlined style={{ color: "#3b82f6", marginRight: 8 }} />
              Edit Blog Article
            </span>
          }
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          width={900}
          style={{ top: 20 }}
          styles={{
            content: { background: "#0d1220", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16 },
            header: { background: "#0d1220", borderBottom: "1px solid rgba(255,255,255,0.1)" },
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 20 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={16}>
                <Typography.Text style={labelStyle}>Title *</Typography.Text>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Blog title"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "#05070d",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: "8px",
                        color: "#f8fafc",
                        outline: "none",
                      }}
                    />
                  )}
                />
              </Col>

              <Col xs={24} md={8}>
                <Typography.Text style={labelStyle}>Author *</Typography.Text>
                <Controller
                  name="author"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Author name"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "#05070d",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: "8px",
                        color: "#f8fafc",
                        outline: "none",
                      }}
                    />
                  )}
                />
              </Col>

              <Col xs={24} md={12}>
                <Typography.Text style={labelStyle}>Category</Typography.Text>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select category"
                      showSearch
                      style={{ width: "100%" }}
                      options={defaultCategories.filter((c) => c !== "All").map((c) => ({ label: c, value: c }))}
                    />
                  )}
                />
              </Col>

              <Col xs={24} md={12}>
                <Typography.Text style={labelStyle}>Publication Status</Typography.Text>
                <Controller
                  name="isPublished"
                  control={control}
                  render={({ field }) => (
                    <Radio.Group
                      {...field}
                      buttonStyle="solid"
                      style={{ display: "flex", width: "100%" }}
                    >
                      <Radio.Button value={true} style={{ flex: 1, textAlign: "center" }}>
                        <CheckCircleOutlined style={{ marginRight: 4 }} /> Published
                      </Radio.Button>
                      <Radio.Button value={false} style={{ flex: 1, textAlign: "center" }}>
                        <StopOutlined style={{ marginRight: 4 }} /> Blocked
                      </Radio.Button>
                    </Radio.Group>
                  )}
                />
              </Col>

              <Col xs={24}>
                <Typography.Text style={labelStyle}>Tags</Typography.Text>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      mode="tags"
                      placeholder="Add tags e.g. React, Node.js"
                      style={{ width: "100%" }}
                    />
                  )}
                />
              </Col>

              <Col xs={24}>
                <Typography.Text style={labelStyle}>Update Cover Photo (Optional)</Typography.Text>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  {(previewUrl || isEditing?.image) && (
                    <Image
                      src={previewUrl || isEditing?.image}
                      alt="Cover Preview"
                      width={100}
                      height={60}
                      style={{ objectFit: "cover", borderRadius: 6 }}
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    id="edit-cover-upload"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="edit-cover-upload"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      background: "#131b30",
                      border: "1px solid #3b82f6",
                      color: "#f8fafc",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    <UploadOutlined /> Change Cover Photo
                  </label>
                </div>
              </Col>

              <Col xs={24}>
                <Typography.Text style={labelStyle}>Description &amp; Code Snippets *</Typography.Text>
                <PHTextEditor name="description" minHeight="260px" />
              </Col>

              <Col xs={24} style={{ textAlign: "right", marginTop: 12 }}>
                <Space>
                  <Button onClick={handleCancel} style={{ background: "#131b30", color: "#94a3b8" }}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit" style={{ background: "#3b82f6", fontWeight: 700 }}>
                    Save &amp; Update Blog
                  </Button>
                </Space>
              </Col>
            </Row>
          </form>
        </Modal>

        {/* ------------------------------------------------------------- */}
        {/* VIEW FULL BLOG MODAL */}
        {/* ------------------------------------------------------------- */}
        <Modal
          title={
            <span style={{ color: "#f8fafc", fontSize: "18px", fontWeight: 700 }}>
              <EyeOutlined style={{ color: "#22d3ee", marginRight: 8 }} />
              Article Preview
            </span>
          }
          open={isViewModalOpen}
          onCancel={handleCancel}
          footer={null}
          width={850}
          style={{ top: 20 }}
          styles={{
            content: { background: "#0d1220", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16 },
            header: { background: "#0d1220", borderBottom: "1px solid rgba(255,255,255,0.1)" },
          }}
        >
          {isView && (
            <div style={{ color: "#f8fafc", marginTop: 16 }}>
              {/* Cover Banner */}
              {isView.image && (
                <div style={{ width: "100%", maxHeight: 300, overflow: "hidden", borderRadius: 10, marginBottom: 20 }}>
                  <Image
                    src={isView.image}
                    alt={isView.title}
                    width="100%"
                    height={280}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}

              {/* Title & Metadata */}
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                <Tag color="blue">{isView.category || "General"}</Tag>
                <Tag color={isView.isPublished !== false ? "success" : "warning"}>
                  {isView.isPublished !== false ? "Published" : "Blocked"}
                </Tag>
                <span style={{ color: "#64748b", fontSize: 12 }}>
                  <CalendarOutlined style={{ marginRight: 4 }} />
                  {new Date(isView.createdAt).toLocaleDateString()}
                </span>
              </div>

              <Typography.Title level={3} style={{ color: "#f8fafc", marginTop: 0 }}>
                {isView.title}
              </Typography.Title>

              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94a3b8", fontSize: 13, marginBottom: 16 }}>
                <UserOutlined style={{ color: "#3b82f6" }} />
                <span>Written by: <strong style={{ color: "#f8fafc" }}>{isView.author}</strong></span>
              </div>

              {/* Tags */}
              {isView.tags && isView.tags.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <Space size={[0, 8]} wrap>
                    {isView.tags.map((tag, idx) => (
                      <Tag key={idx} color="cyan" icon={<TagOutlined />}>
                        {tag}
                      </Tag>
                    ))}
                  </Space>
                </div>
              )}

              <Divider style={{ borderColor: "rgba(255,255,255,0.1)" }} />

              {/* Content Preview with Formatted HTML */}
              <div
                className="blog-preview-content"
                dangerouslySetInnerHTML={{
                  __html: isView.description || "<p>No content written.</p>",
                }}
                style={{
                  color: "#cbd5e1",
                  lineHeight: 1.8,
                  fontSize: 15,
                }}
              />
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ManageBlogs;
