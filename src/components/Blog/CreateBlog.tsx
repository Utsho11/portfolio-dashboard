import React, { useState } from "react";
import {
  Row,
  Col,
  Typography,
  Button,
  Divider,
  Select,
  Radio,
  Image,
  Space,
  Card,
} from "antd";
import { Controller, useForm, FieldValues } from "react-hook-form";
import PHTextEditor from "../form/PHTextEditor";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAddBlogMutation } from "../../redux/services/blogApi";
import {
  UploadOutlined,
  DeleteOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  PictureOutlined,
} from "@ant-design/icons";

const defaultCategories = [
  "Frontend Development",
  "Backend & Systems",
  "Next.js & React",
  "TypeScript & Architecture",
  "DevOps & Cloud",
  "Security & Performance",
  "Database & State",
  "Career & Engineering",
];

const suggestedTags = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "TailwindCSS",
  "PostgreSQL",
  "MongoDB",
  "Docker",
  "GraphQL",
  "Security",
  "Performance",
  "Architecture",
];

const CreateBlog: React.FC = () => {
  const [addBlog] = useAddBlogMutation();
  const navigate = useNavigate();

  // Cover photo state
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  // Additional gallery photos state
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<{ file: File; url: string }[]>([]);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      author: "Utsho Roy",
      category: "Next.js & React",
      tags: ["React", "TypeScript"],
      isPublished: true,
      description: "",
    },
  });

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedCoverFile(file);
      const url = URL.createObjectURL(file);
      setCoverPreviewUrl(url);
    }
  };

  const handleRemoveCover = () => {
    setSelectedCoverFile(null);
    if (coverPreviewUrl) {
      URL.revokeObjectURL(coverPreviewUrl);
      setCoverPreviewUrl(null);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newPreviews = newFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));

      setSelectedGalleryFiles((prev) => [...prev, ...newFiles]);
      setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveGalleryPhoto = (index: number) => {
    URL.revokeObjectURL(galleryPreviews[index].url);
    setSelectedGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading("Publishing blog....");
    if (!data.title?.trim()) {
      toast.error("Blog title is required", { id: toastId });
      return;
    }
    if (!data.description?.trim()) {
      toast.error("Blog description content is required", { id: toastId });
      return;
    }

    const formData = new FormData();

    try {
      formData.append("data", JSON.stringify(data));

      if (selectedCoverFile) {
        formData.append("file", selectedCoverFile);
      }

      if (selectedGalleryFiles.length > 0) {
        selectedGalleryFiles.forEach((file) => {
          formData.append("photos", file);
        });
      }

      await addBlog(formData).unwrap();
      toast.success("Successfully Created and Published Blog!", {
        id: toastId,
        duration: 2500,
      });
      navigate("/manage-blogs");
    } catch (error) {
      toast.error("Something went wrong while publishing the blog", {
        id: toastId,
        duration: 2500,
      });
      console.error(error);
    }
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: 600,
    fontSize: "13px",
    marginBottom: "6px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#010313",
        padding: "24px 16px 48px",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Top Navigation */}
        <div style={{ marginBottom: "20px" }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/manage-blogs")}
            style={{ color: "#3B82F6", padding: 0, fontWeight: 600 }}
          >
            Back to Manage Blogs
          </Button>
        </div>

        <Card
          style={{
            background: "#0D1220",
            borderColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
          }}
          bodyStyle={{ padding: "clamp(20px, 3vw, 36px)" }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <Typography.Title
              level={2}
              style={{
                color: "#F8FAFC",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              <FileTextOutlined style={{ color: "#3B82F6", marginRight: "10px" }} />
              Write &amp; Publish Blog
            </Typography.Title>
            <Typography.Text style={{ color: "#94A3B8", marginTop: "6px", display: "block" }}>
              Craft technical articles with rich code snippets, formatting, tags, cover banner &amp; photo gallery.
            </Typography.Text>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Row gutter={[24, 20]}>
              {/* Title */}
              <Col xs={24} lg={16}>
                <Typography.Text style={labelStyle}>Blog Title *</Typography.Text>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="e.g. Architecting Zero-Knowledge Encryption with Next.js 15"
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        background: "#05070D",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "8px",
                        color: "#F8FAFC",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  )}
                />
              </Col>

              {/* Author */}
              <Col xs={24} lg={8}>
                <Typography.Text style={labelStyle}>Author Name *</Typography.Text>
                <Controller
                  name="author"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="e.g. Utsho Roy"
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        background: "#05070D",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        borderRadius: "8px",
                        color: "#F8FAFC",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  )}
                />
              </Col>

              {/* Category */}
              <Col xs={24} md={12}>
                <Typography.Text style={labelStyle}>Category</Typography.Text>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      placeholder="Select or enter category"
                      showSearch
                      style={{ width: "100%", height: "46px" }}
                      options={defaultCategories.map((c) => ({ label: c, value: c }))}
                    />
                  )}
                />
              </Col>

              {/* Status (Publish / Block) */}
              <Col xs={24} md={12}>
                <Typography.Text style={labelStyle}>Publication Status</Typography.Text>
                <Controller
                  name="isPublished"
                  control={control}
                  render={({ field }) => (
                    <Radio.Group
                      {...field}
                      buttonStyle="solid"
                      style={{ display: "flex", width: "100%", height: "46px" }}
                    >
                      <Radio.Button
                        value={true}
                        style={{
                          flex: 1,
                          textAlign: "center",
                          height: "46px",
                          lineHeight: "44px",
                          fontWeight: 600,
                        }}
                      >
                        <CheckCircleOutlined style={{ marginRight: 6 }} />
                        Published (Live)
                      </Radio.Button>
                      <Radio.Button
                        value={false}
                        style={{
                          flex: 1,
                          textAlign: "center",
                          height: "46px",
                          lineHeight: "44px",
                          fontWeight: 600,
                        }}
                      >
                        Draft / Blocked
                      </Radio.Button>
                    </Radio.Group>
                  )}
                />
              </Col>

              {/* Tags */}
              <Col xs={24}>
                <Typography.Text style={labelStyle}>Tags (Press Enter to add custom tags)</Typography.Text>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      mode="tags"
                      placeholder="Add tags e.g. React, Next.js, Node.js, Performance"
                      style={{ width: "100%" }}
                      options={suggestedTags.map((tag) => ({ label: tag, value: tag }))}
                    />
                  )}
                />
              </Col>

              {/* Cover Photo Upload */}
              <Col xs={24} lg={12}>
                <Typography.Text style={labelStyle}>Primary Cover Photo / Banner</Typography.Text>
                <div
                  style={{
                    border: "1.5px dashed rgba(59, 130, 246, 0.4)",
                    borderRadius: "12px",
                    padding: "20px",
                    background: "#05070D",
                    textAlign: "center",
                    minHeight: "180px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {coverPreviewUrl ? (
                    <div style={{ position: "relative" }}>
                      <Image
                        src={coverPreviewUrl}
                        alt="Cover Preview"
                        style={{
                          maxHeight: "140px",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                      <div style={{ marginTop: "10px" }}>
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={handleRemoveCover}
                          size="small"
                        >
                          Remove Cover
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <UploadOutlined style={{ fontSize: "26px", color: "#3B82F6" }} />
                      <p style={{ color: "#94A3B8", marginTop: "8px", fontSize: "12px" }}>
                        Main header banner image (16:9 recommended)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        id="blog-cover-upload"
                        onChange={handleCoverChange}
                        style={{ display: "none" }}
                      />
                      <label
                        htmlFor="blog-cover-upload"
                        style={{
                          display: "inline-block",
                          marginTop: "6px",
                          padding: "6px 18px",
                          background: "#131B30",
                          border: "1px solid #3B82F6",
                          color: "#F8FAFC",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: "12px",
                        }}
                      >
                        Select Cover Photo
                      </label>
                    </div>
                  )}
                </div>
              </Col>

              {/* Additional Photos / Gallery Upload */}
              <Col xs={24} lg={12}>
                <Typography.Text style={labelStyle}>
                  Additional Photos &amp; Screenshots (Gallery)
                </Typography.Text>
                <div
                  style={{
                    border: "1.5px dashed rgba(34, 211, 238, 0.35)",
                    borderRadius: "12px",
                    padding: "20px",
                    background: "#05070D",
                    textAlign: "center",
                    minHeight: "180px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    id="blog-gallery-upload"
                    onChange={handleGalleryChange}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="blog-gallery-upload"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 18px",
                      background: "#131B30",
                      border: "1px solid #22D3EE",
                      color: "#F8FAFC",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "12px",
                      marginBottom: "10px",
                    }}
                  >
                    <PictureOutlined /> Add More Photos (Multiple)
                  </label>

                  {galleryPreviews.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        justifyContent: "center",
                        marginTop: "10px",
                        maxHeight: "130px",
                        overflowY: "auto",
                      }}
                    >
                      {galleryPreviews.map((p, idx) => (
                        <div key={idx} style={{ position: "relative", width: 64, height: 48 }}>
                          <img
                            src={p.url}
                            alt={`Gallery ${idx + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: 4,
                              border: "1px solid rgba(255,255,255,0.2)",
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryPhoto(idx)}
                            style={{
                              position: "absolute",
                              top: -4,
                              right: -4,
                              background: "#ef4444",
                              color: "#fff",
                              border: "none",
                              borderRadius: "50%",
                              width: 16,
                              height: 16,
                              fontSize: 10,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              lineHeight: 1,
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "#64748B", fontSize: "12px", margin: 0 }}>
                      Attach diagrams, architecture schemas, UI screenshots
                    </p>
                  )}
                </div>
              </Col>

              {/* Description Content with Upgraded Rich Text Editor */}
              <Col xs={24}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <Typography.Text style={labelStyle}>
                    Blog Content &amp; Code (Full Rich Text Editor) *
                  </Typography.Text>
                  <Typography.Text style={{ color: "#64748B", fontSize: "12px" }}>
                    Supports Headings, Bullets, Inline/Block Code, Blockquotes, Links &amp; Highlights
                  </Typography.Text>
                </div>
                <PHTextEditor
                  name="description"
                  control={control}
                  minHeight="320px"
                  placeholder="Write comprehensive article content. Use the toolbar for bold, italic, headings, bullet points, blockquotes, and code snippets..."
                />
              </Col>

              <Col xs={24}>
                <Divider style={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />
                <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                  <Button
                    onClick={() => navigate("/manage-blogs")}
                    style={{ background: "#131B30", color: "#94A3B8", borderColor: "rgba(255,255,255,0.15)" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    style={{
                      background: "#3B82F6",
                      fontWeight: 700,
                      padding: "0 32px",
                    }}
                  >
                    Publish Blog Article
                  </Button>
                </Space>
              </Col>
            </Row>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateBlog;
