import { Button, Col, Image, Modal, Row, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import {
  useDeleteBlogMutation,
  useGetBlogsQuery,
  useUpdateBlogMutation,
} from "../redux/services/blogApi";
import { TBlog } from "../types/blog";
import { Table } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import PHForm from "../components/form/PHForm";
import PHInput from "../components/form/PHInput";
import PHTextEditor from "../components/form/PHTextEditor";
import { FieldValues } from "react-hook-form";
import PHFileInput from "../components/form/PHFileInput";
import { toast } from "sonner";

type TRecord = {
  key: string;
  title: string;
  image?: string;
  description: string;
  author: string;
  createdAt: string;
};

const ManageBlogs = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setViewIsModalOpen] = useState(false);
  const { data } = useGetBlogsQuery(null);
  const [deleteBlog] = useDeleteBlogMutation();
  const [isEditing, setIsEditing] = useState<TRecord>();
  const [isView, setIsView] = useState<TRecord>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [updateBlog] = useUpdateBlogMutation();

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  // console.log(data?.data);

  const blogs: TBlog[] = data?.data || [];

  const dataSource = blogs.map((blog) => {
    return {
      key: blog._id,
      title: blog.title,
      description: blog.description,
      image: blog.image,
      author: blog.author,
      createdAt: new Date(blog.createdAt).toLocaleString(),
    };
  });

  const onDeleteStudent = (record: TRecord) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this blog record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        deleteBlog(record.key);
      },
    });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },

    {
      title: "Author",
      dataIndex: "author",
      key: "author",
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
    const toastId = toast.loading("Blog posting....");
    const formData = new FormData();
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      formData.append("data", JSON.stringify(data));
      await updateBlog(formData).unwrap();
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

  return (
    <div style={{ background: "#010313" }} className="">
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#010313",
        }}
      >
        <h3 style={{ color: "white" }}>Click here to post a blog...</h3>
        <Button
          type="primary"
          onClick={() => {
            navigate("/add-blog");
          }}
        >
          <PlusOutlined />
          Edit Blog
        </Button>
      </div>
      <div className="">
        <Table
          style={{ background: "#010313" }}
          dataSource={dataSource}
          columns={columns}
        />
        <Modal
          title="Edit blog"
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
                Post Blog
              </Typography.Title>
              <PHForm onSubmit={onSubmit} defaultValues={isEditing}>
                <div style={{ marginBottom: "16px" }}>
                  <PHInput
                    type="text"
                    name="title"
                    label="Title:"
                    placeholder="Enter blog title"
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <PHInput
                    type="text"
                    name="author"
                    label="Author Name:"
                    placeholder="Enter author name"
                  />
                </div>
                <div style={{ marginBottom: "16px", height: "15rem" }}>
                  <PHTextEditor
                    type="text"
                    name="description"
                    label="Description:"
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
                  Edit Blog
                </Button>
              </PHForm>
            </Col>
          </Row>
        </Modal>
        <Modal
          title="View blog"
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
                  alt={isView?.title || "Blog Image"}
                  style={{ borderRadius: "8px" }}
                  width="100%"
                  height="auto"
                  preview={true}
                />
              </div>
            </Col>

            {/* Right side: Blog details */}
            <Col span={14}>
              <Typography.Title level={3}>{isView?.title}</Typography.Title>
              <Typography.Text strong>Author:</Typography.Text>
              <Typography.Paragraph>{isView?.author}</Typography.Paragraph>
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

export default ManageBlogs;
