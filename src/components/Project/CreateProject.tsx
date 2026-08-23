import {
  Row,
  Col,
  Typography,
  Button,
  Input,
  Divider,
  Select,
  Switch,
  Tabs,
  Space,
} from "antd";
import PHInput from "../form/PHInput";
import {
  Controller,
  FieldValues,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import PHFileInput from "../form/PHFileInput";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useAddProjectMutation } from "../../redux/services/projectApi";

const { TextArea } = Input;
const { Option } = Select;

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const CreateProject = () => {
  const [addProject] = useAddProjectMutation();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const methods = useForm({
    defaultValues: {
      category: "Full-Stack",
      status: "Active",
      featured: false,
      technologies: {
        frontend: [""],
        backend: [""],
        database: [""],
        devops: [""],
      },
      keyHighlights: [""],
      metrics: [{ label: "", value: "" }],
      links: {
        live: "",
        githubClient: "",
        githubServer: "",
        apiDocs: "",
        videoDemo: "",
      },
      caseStudy: {
        theProblem: "",
        architectureOverview: "",
        technicalChallenges: [""],
        futureRoadmap: [""],
      },
    },
  });

  const { control, handleSubmit, watch, setValue } = methods;

  const {
    fields: highlightFields,
    append: appendHighlight,
    remove: removeHighlight,
  } = useFieldArray({ control, name: "keyHighlights" });

  const {
    fields: metricFields,
    append: appendMetric,
    remove: removeMetric,
  } = useFieldArray({ control, name: "metrics" });

  const {
    fields: feTechFields,
    append: appendFeTech,
    remove: removeFeTech,
  } = useFieldArray({ control, name: "technologies.frontend" as any });

  const {
    fields: beTechFields,
    append: appendBeTech,
    remove: removeBeTech,
  } = useFieldArray({ control, name: "technologies.backend" as any });

  const {
    fields: dbTechFields,
    append: appendDbTech,
    remove: removeDbTech,
  } = useFieldArray({ control, name: "technologies.database" as any });

  const {
    fields: devopsTechFields,
    append: appendDevopsTech,
    remove: removeDevopsTech,
  } = useFieldArray({ control, name: "technologies.devops" as any });

  const {
    fields: challengeFields,
    append: appendChallenge,
    remove: removeChallenge,
  } = useFieldArray({ control, name: "caseStudy.technicalChallenges" as any });

  const {
    fields: roadmapFields,
    append: appendRoadmap,
    remove: removeRoadmap,
  } = useFieldArray({ control, name: "caseStudy.futureRoadmap" as any });

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
  };

  const projectName = watch("name");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("name", e.target.value);
    if (!watch("slug")) {
      setValue("slug", generateSlug(e.target.value));
    }
  };

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading("Publishing modern project....");
    const formData = new FormData();

    // Clean up empty array items
    const cleanArray = (arr?: string[]) =>
      Array.isArray(arr) ? arr.filter((item) => item && item.trim() !== "") : [];

    const cleanedData = {
      ...data,
      slug: data.slug || generateSlug(data.name || ""),
      keyHighlights: cleanArray(data.keyHighlights),
      metrics: Array.isArray(data.metrics)
        ? data.metrics.filter((m: any) => m?.label && m?.value)
        : [],
      technologies: {
        frontend: cleanArray(data.technologies?.frontend),
        backend: cleanArray(data.technologies?.backend),
        database: cleanArray(data.technologies?.database),
        devops: cleanArray(data.technologies?.devops),
      },
      caseStudy: {
        theProblem: data.caseStudy?.theProblem || "",
        architectureOverview: data.caseStudy?.architectureOverview || "",
        technicalChallenges: cleanArray(data.caseStudy?.technicalChallenges),
        futureRoadmap: cleanArray(data.caseStudy?.futureRoadmap),
      },
    };

    if (cleanedData.keyHighlights.length === 0) {
      toast.error("Please add at least one key highlight.", { id: toastId });
      return;
    }

    try {
      formData.append("data", JSON.stringify(cleanedData));
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      await addProject(formData).unwrap();
      toast.success("Successfully Published Project.", {
        id: toastId,
        duration: 2000,
      });
      navigate("/manage-projects");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMsg =
        error?.data?.message || "Failed to publish project. Please check fields.";
      toast.error(errorMsg, { id: toastId, duration: 2000 });
    }
  };

  const labelStyle: React.CSSProperties = {
    marginBottom: "4px",
    display: "block",
    color: "rgba(255,255,255,0.85)",
    fontWeight: 500,
  };

  const tabItems = [
    {
      key: "basic",
      label: "Basic Info",
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Typography.Text style={labelStyle}>Project Name *</Typography.Text>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleNameChange(e);
                  }}
                  placeholder="e.g. ZLocker - End-to-End Encrypted Storage"
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
          </Col>

          <Col xs={24} md={12}>
            <Typography.Text style={labelStyle}>SEO Slug *</Typography.Text>
            <Controller
              name="slug"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="e.g. zlocker"
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
          </Col>

          <Col xs={24}>
            <Typography.Text style={labelStyle}>
              Tagline (Crisp summary for cards) *
            </Typography.Text>
            <Controller
              name="tagline"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="e.g. High-performance zero-knowledge file encryption platform with real-time audit logs."
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
          </Col>

          <Col xs={24} md={8}>
            <Typography.Text style={labelStyle}>Category *</Typography.Text>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  style={{ width: "100%", height: "42px" }}
                  dropdownStyle={{ background: "#170F21" }}
                >
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
            <Typography.Text style={labelStyle}>Status *</Typography.Text>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  style={{ width: "100%", height: "42px" }}
                  dropdownStyle={{ background: "#170F21" }}
                >
                  <Option value="Active">Active</Option>
                  <Option value="Production">Production</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              )}
            />
          </Col>

          <Col xs={24} md={8}>
            <Typography.Text style={labelStyle}>Featured on Home</Typography.Text>
            <div style={{ marginTop: "8px" }}>
              <Controller
                name="featured"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    checkedChildren="Featured"
                    unCheckedChildren="Normal"
                  />
                )}
              />
            </div>
          </Col>
        </Row>
      ),
    },
    {
      key: "links",
      label: "Links",
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Typography.Text style={labelStyle}>Live Website URL *</Typography.Text>
            <Controller
              name="links.live"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="https://myproject.com"
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
          </Col>

          <Col xs={24} md={12}>
            <Typography.Text style={labelStyle}>GitHub Client URL</Typography.Text>
            <Controller
              name="links.githubClient"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="https://github.com/user/project-client"
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
          </Col>

          <Col xs={24} md={12}>
            <Typography.Text style={labelStyle}>GitHub Server URL</Typography.Text>
            <Controller
              name="links.githubServer"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="https://github.com/user/project-server"
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
          </Col>

          <Col xs={24} md={12}>
            <Typography.Text style={labelStyle}>API Docs / Swagger</Typography.Text>
            <Controller
              name="links.apiDocs"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="https://api.myproject.com/docs"
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
          </Col>

          <Col xs={24}>
            <Typography.Text style={labelStyle}>Video Demo URL</Typography.Text>
            <Controller
              name="links.videoDemo"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="https://youtube.com/watch?v=..."
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
          </Col>
        </Row>
      ),
    },
    {
      key: "tech",
      label: "Tech & Architecture",
      children: (
        <div>
          <Row gutter={[16, 16]}>
            {/* Frontend */}
            <Col xs={24} md={12}>
              <Typography.Text style={labelStyle}>Frontend Technologies</Typography.Text>
              <Button
                type="dashed"
                onClick={() => appendFeTech("")}
                style={{
                  marginBottom: "8px",
                  width: "100%",
                  borderRadius: "8px",
                  borderColor: "rgba(255,255,255,0.2)",
                  color: "#fff",
                }}
              >
                + Add Frontend Tech
              </Button>
              {feTechFields.map((field, idx) => (
                <Space key={field.id} style={{ display: "flex", marginBottom: "8px" }}>
                  <Controller
                    name={`technologies.frontend.${idx}` as any}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="e.g. Next.js 15, Tailwind, Redux"
                        style={{
                          background: "#24182f",
                          borderColor: "rgba(255,255,255,0.12)",
                          color: "#fff",
                        }}
                      />
                    )}
                  />
                  <Button danger onClick={() => removeFeTech(idx)}>
                    <DeleteOutlined />
                  </Button>
                </Space>
              ))}
            </Col>

            {/* Backend */}
            <Col xs={24} md={12}>
              <Typography.Text style={labelStyle}>Backend Technologies</Typography.Text>
              <Button
                type="dashed"
                onClick={() => appendBeTech("")}
                style={{
                  marginBottom: "8px",
                  width: "100%",
                  borderRadius: "8px",
                  borderColor: "rgba(255,255,255,0.2)",
                  color: "#fff",
                }}
              >
                + Add Backend Tech
              </Button>
              {beTechFields.map((field, idx) => (
                <Space key={field.id} style={{ display: "flex", marginBottom: "8px" }}>
                  <Controller
                    name={`technologies.backend.${idx}` as any}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="e.g. Node.js, Express, TypeScript"
                        style={{
                          background: "#24182f",
                          borderColor: "rgba(255,255,255,0.12)",
                          color: "#fff",
                        }}
                      />
                    )}
                  />
                  <Button danger onClick={() => removeBeTech(idx)}>
                    <DeleteOutlined />
                  </Button>
                </Space>
              ))}
            </Col>

            {/* Database */}
            <Col xs={24} md={12}>
              <Typography.Text style={labelStyle}>Database & Caching</Typography.Text>
              <Button
                type="dashed"
                onClick={() => appendDbTech("")}
                style={{
                  marginBottom: "8px",
                  width: "100%",
                  borderRadius: "8px",
                  borderColor: "rgba(255,255,255,0.2)",
                  color: "#fff",
                }}
              >
                + Add Database Tech
              </Button>
              {dbTechFields.map((field, idx) => (
                <Space key={field.id} style={{ display: "flex", marginBottom: "8px" }}>
                  <Controller
                    name={`technologies.database.${idx}` as any}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="e.g. MongoDB, Redis, PostgreSQL"
                        style={{
                          background: "#24182f",
                          borderColor: "rgba(255,255,255,0.12)",
                          color: "#fff",
                        }}
                      />
                    )}
                  />
                  <Button danger onClick={() => removeDbTech(idx)}>
                    <DeleteOutlined />
                  </Button>
                </Space>
              ))}
            </Col>

            {/* DevOps */}
            <Col xs={24} md={12}>
              <Typography.Text style={labelStyle}>DevOps & Cloud</Typography.Text>
              <Button
                type="dashed"
                onClick={() => appendDevopsTech("")}
                style={{
                  marginBottom: "8px",
                  width: "100%",
                  borderRadius: "8px",
                  borderColor: "rgba(255,255,255,0.2)",
                  color: "#fff",
                }}
              >
                + Add DevOps Tech
              </Button>
              {devopsTechFields.map((field, idx) => (
                <Space key={field.id} style={{ display: "flex", marginBottom: "8px" }}>
                  <Controller
                    name={`technologies.devops.${idx}` as any}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="e.g. Docker, Vercel, AWS S3"
                        style={{
                          background: "#24182f",
                          borderColor: "rgba(255,255,255,0.12)",
                          color: "#fff",
                        }}
                      />
                    )}
                  />
                  <Button danger onClick={() => removeDevopsTech(idx)}>
                    <DeleteOutlined />
                  </Button>
                </Space>
              ))}
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: "badges",
      label: "Highlights & Metrics",
      children: (
        <Row gutter={[16, 16]}>
          {/* Key Highlights */}
          <Col xs={24} md={12}>
            <Typography.Text style={labelStyle}>
              Key Highlights (Recruiter bullet points) *
            </Typography.Text>
            <Button
              type="dashed"
              onClick={() => appendHighlight("")}
              style={{
                marginBottom: "8px",
                width: "100%",
                borderRadius: "8px",
                borderColor: "rgba(255,255,255,0.2)",
                color: "#fff",
              }}
            >
              + Add Key Highlight
            </Button>
            {highlightFields.map((field, idx) => (
              <Space key={field.id} style={{ display: "flex", marginBottom: "8px" }}>
                <Controller
                  name={`keyHighlights.${idx}`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="e.g. Built zero-knowledge AES-256 client-side file encryption."
                      style={{
                        background: "#24182f",
                        borderColor: "rgba(255,255,255,0.12)",
                        color: "#fff",
                      }}
                    />
                  )}
                />
                <Button danger onClick={() => removeHighlight(idx)}>
                  <DeleteOutlined />
                </Button>
              </Space>
            ))}
          </Col>

          {/* Metrics */}
          <Col xs={24} md={12}>
            <Typography.Text style={labelStyle}>
              Metrics & Fast-Scan Badges
            </Typography.Text>
            <Button
              type="dashed"
              onClick={() => appendMetric({ label: "", value: "" })}
              style={{
                marginBottom: "8px",
                width: "100%",
                borderRadius: "8px",
                borderColor: "rgba(255,255,255,0.2)",
                color: "#fff",
              }}
            >
              + Add Metric
            </Button>
            {metricFields.map((field, idx) => (
              <Space key={field.id} style={{ display: "flex", marginBottom: "8px" }}>
                <Controller
                  name={`metrics.${idx}.label`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Label (e.g. Encryption)"
                      style={{
                        background: "#24182f",
                        borderColor: "rgba(255,255,255,0.12)",
                        color: "#fff",
                      }}
                    />
                  )}
                />
                <Controller
                  name={`metrics.${idx}.value`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Value (e.g. AES-256-GCM)"
                      style={{
                        background: "#24182f",
                        borderColor: "rgba(255,255,255,0.12)",
                        color: "#fff",
                      }}
                    />
                  )}
                />
                <Button danger onClick={() => removeMetric(idx)}>
                  <DeleteOutlined />
                </Button>
              </Space>
            ))}
          </Col>
        </Row>
      ),
    },
    {
      key: "caseStudy",
      label: "Case Study & Media",
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Typography.Text style={labelStyle}>Hero Thumbnail Image *</Typography.Text>
            <PHFileInput
              name="file"
              accept="image/*"
              onFileChange={handleFileChange}
            />
          </Col>

          <Col xs={24}>
            <Typography.Text style={labelStyle}>The Problem</Typography.Text>
            <Controller
              name="caseStudy.theProblem"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  rows={3}
                  placeholder="Describe what problem this project solves..."
                  style={{
                    background: "#24182f",
                    borderColor: "rgba(255,255,255,0.12)",
                    color: "#fff",
                  }}
                />
              )}
            />
          </Col>

          <Col xs={24}>
            <Typography.Text style={labelStyle}>
              Architecture Overview
            </Typography.Text>
            <Controller
              name="caseStudy.architectureOverview"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  rows={3}
                  placeholder="Explain system architecture, data flow, and layers..."
                  style={{
                    background: "#24182f",
                    borderColor: "rgba(255,255,255,0.12)",
                    color: "#fff",
                  }}
                />
              )}
            />
          </Col>

          <Col xs={24} md={12}>
            <Typography.Text style={labelStyle}>
              Technical Challenges Solved
            </Typography.Text>
            <Button
              type="dashed"
              onClick={() => appendChallenge("")}
              style={{
                marginBottom: "8px",
                width: "100%",
                borderRadius: "8px",
                borderColor: "rgba(255,255,255,0.2)",
                color: "#fff",
              }}
            >
              + Add Challenge
            </Button>
            {challengeFields.map((field, idx) => (
              <Space key={field.id} style={{ display: "flex", marginBottom: "8px" }}>
                <Controller
                  name={`caseStudy.technicalChallenges.${idx}` as any}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="e.g. Preventing memory leaks during large file streaming."
                      style={{
                        background: "#24182f",
                        borderColor: "rgba(255,255,255,0.12)",
                        color: "#fff",
                      }}
                    />
                  )}
                />
                <Button danger onClick={() => removeChallenge(idx)}>
                  <DeleteOutlined />
                </Button>
              </Space>
            ))}
          </Col>

          <Col xs={24} md={12}>
            <Typography.Text style={labelStyle}>Future Roadmap</Typography.Text>
            <Button
              type="dashed"
              onClick={() => appendRoadmap("")}
              style={{
                marginBottom: "8px",
                width: "100%",
                borderRadius: "8px",
                borderColor: "rgba(255,255,255,0.2)",
                color: "#fff",
              }}
            >
              + Add Roadmap Item
            </Button>
            {roadmapFields.map((field, idx) => (
              <Space key={field.id} style={{ display: "flex", marginBottom: "8px" }}>
                <Controller
                  name={`caseStudy.futureRoadmap.${idx}` as any}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="e.g. Implement WebAuthn / Passkeys biometric login."
                      style={{
                        background: "#24182f",
                        borderColor: "rgba(255,255,255,0.12)",
                        color: "#fff",
                      }}
                    />
                  )}
                />
                <Button danger onClick={() => removeRoadmap(idx)}>
                  <DeleteOutlined />
                </Button>
              </Space>
            ))}
          </Col>
        </Row>
      ),
    },
  ];

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
      <Col xs={24} sm={22} md={22} lg={20} xl={18}>
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
            Publish Modern Project
          </Typography.Title>

          <Typography.Text
            style={{
              display: "block",
              textAlign: "center",
              color: "rgba(255,255,255,0.55)",
              marginBottom: "24px",
            }}
          >
            Enter full engineering details, fast-scan badges, and case study
          </Typography.Text>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Tabs
                defaultActiveKey="basic"
                items={tabItems}
                style={{ color: "#fff" }}
              />

              <Divider style={{ borderColor: "rgba(255,255,255,0.15)" }} />

              <Button
                type="primary"
                htmlType="submit"
                block
                style={{
                  height: "48px",
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
            </form>
          </FormProvider>
        </div>
      </Col>
    </Row>
  );
};

export default CreateProject;

