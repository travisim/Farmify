"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Leaf,
  Upload,
  FileText,
  Camera,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Save,
  Eye,
  MessageSquare,
} from "lucide-react";

interface ProjectFormData {
  // Basic Information
  title: string;
  category: string;
  description: string;
  location: string;
  province: string;
  region: string;
  farmSize: string;

  // Financial Details
  investmentGoal: string;
  minimumInvestment: string;
  expectedROI: string;
  duration: string;
  termType: string;
  returnType: string;

  // Project Details
  cropType: string;
  plantingDate: string;
  expectedHarvest: string;
  expectedYield: string;
  marketPrice: string;

  // Risk Assessment
  riskLevel: string;
  riskFactors: string[];
  mitigationStrategies: string;

  // Certifications
  certifications: string[];

  // Budget Breakdown
  seeds: string;
  fertilizer: string;
  labor: string;
  equipment: string;
  irrigation: string;
  certification: string;
  misc: string;

  // Timeline
  landPreparation: string;
  planting: string;
  growing: string;
  harvesting: string;
  processing: string;

  // Documents
  businessPlan: File | null;
  landOwnership: File | null;
  certificationDocs: File | null;

  // Images
  projectImages: File[];
}

const initialFormData: ProjectFormData = {
  title: "",
  category: "",
  description: "",
  location: "",
  province: "",
  region: "",
  farmSize: "",
  investmentGoal: "",
  minimumInvestment: "",
  expectedROI: "",
  duration: "",
  termType: "",
  returnType: "",
  cropType: "",
  plantingDate: "",
  expectedHarvest: "",
  expectedYield: "",
  marketPrice: "",
  riskLevel: "",
  riskFactors: [],
  mitigationStrategies: "",
  certifications: [],
  seeds: "",
  fertilizer: "",
  labor: "",
  equipment: "",
  irrigation: "",
  certification: "",
  misc: "",
  landPreparation: "",
  planting: "",
  growing: "",
  harvesting: "",
  processing: "",
  businessPlan: null,
  landOwnership: null,
  certificationDocs: null,
  projectImages: [],
};

const categories = [
  "Crops",
  "Vegetables",
  "Fruits",
  "Cattles",
  "Fisheries",
  "Poultry",
];

const regions = [
  { value: "North", label: "North Thailand" },
  { value: "Northeast", label: "Northeast Thailand" },
  { value: "Central", label: "Central Thailand" },
  { value: "South", label: "South Thailand" },
];

const riskFactors = [
  "Weather conditions",
  "Market price fluctuation",
  "Pest and disease",
  "Water availability",
  "Labor shortage",
  "Equipment failure",
  "Certification delays",
];

const certificationOptions = [
  "Organic",
  "Fair Trade",
  "GAP",
  "GMP",
  "Hydroponic",
  "Medicinal Grade",
  "Sustainable",
  "Single Origin",
  "Global GAP",
  "Indoor Farming",
  "Export Quality",
];

export default function CreateProjectPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const totalSteps = 6;

  const updateFormData = (field: keyof ProjectFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayUpdate = (
    field: keyof ProjectFormData,
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => {
      const currentArray = prev[field] as string[];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return {
          ...prev,
          [field]: currentArray.filter((item) => item !== value),
        };
      }
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateProgress = () => {
    return (currentStep / totalSteps) * 100;
  };

  const handleSubmit = () => {
    console.log("Project data:", formData);
    // Here you would submit the form data to your backend
    alert("Project created successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="AgriVest"
        navLinks={[
          { href: "/projects", label: "Browse Projects" },
          { href: "/farmer/dashboard", label: "Farmer Dashboard" },
          { href: "/how-it-works", label: "How It Works" },
        ]}
      >
        <Button variant="outline" asChild>
          <Link href="/farmer/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </Header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Create New Project</h1>
          <p className="text-muted-foreground">
            Set up your agricultural project to attract investors and secure
            funding
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(calculateProgress())}% Complete
              </span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
            <div className="flex justify-between mt-4 text-xs text-muted-foreground">
              <span>Basic Info</span>
              <span>Financial</span>
              <span>Project Details</span>
              <span>Risk & Timeline</span>
              <span>Documents</span>
              <span>Review</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 && "Basic Information"}
                  {currentStep === 2 && "Financial Details"}
                  {currentStep === 3 && "Project Details"}
                  {currentStep === 4 && "Risk Assessment & Timeline"}
                  {currentStep === 5 && "Documents & Images"}
                  {currentStep === 6 && "Review & Submit"}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 &&
                    "Tell us about your project and location"}
                  {currentStep === 2 &&
                    "Set your funding goals and expected returns"}
                  {currentStep === 3 &&
                    "Provide details about your crop and farming approach"}
                  {currentStep === 4 &&
                    "Assess risks and create project timeline"}
                  {currentStep === 5 &&
                    "Upload supporting documents and project images"}
                  {currentStep === 6 &&
                    "Review all information before submitting"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="title">Project Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Organic Jasmine Rice Farm - Season 2024"
                        value={formData.title}
                        onChange={(e) =>
                          updateFormData("title", e.target.value)
                        }
                        className="mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) =>
                            updateFormData("category", value)
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select crop category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="farmSize">Farm Size (hectares)</Label>
                        <Input
                          id="farmSize"
                          type="number"
                          placeholder="25"
                          value={formData.farmSize}
                          onChange={(e) =>
                            updateFormData("farmSize", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Project Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your farming project, methods, and goals..."
                        value={formData.description}
                        onChange={(e) =>
                          updateFormData("description", e.target.value)
                        }
                        className="mt-2"
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="region">Region</Label>
                        <Select
                          value={formData.region}
                          onValueChange={(value) =>
                            updateFormData("region", value)
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent>
                            {regions.map((region) => (
                              <SelectItem
                                key={region.value}
                                value={region.value}
                              >
                                {region.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="province">Province</Label>
                        <Input
                          id="province"
                          placeholder="e.g., Chiang Mai"
                          value={formData.province}
                          onChange={(e) =>
                            updateFormData("province", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="location">Specific Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g., Chiang Mai, Thailand"
                          value={formData.location}
                          onChange={(e) =>
                            updateFormData("location", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Certifications
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {certificationOptions.map((cert) => (
                          <div
                            key={cert}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`cert-${cert}`}
                              checked={formData.certifications.includes(cert)}
                              onCheckedChange={(checked) =>
                                handleArrayUpdate(
                                  "certifications",
                                  cert,
                                  checked as boolean
                                )
                              }
                            />
                            <Label
                              htmlFor={`cert-${cert}`}
                              className="text-sm font-normal"
                            >
                              {cert}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Financial Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="investmentGoal">
                          Investment Goal (RLUSD)
                        </Label>
                        <Input
                          id="investmentGoal"
                          type="number"
                          placeholder="25000"
                          value={formData.investmentGoal}
                          onChange={(e) =>
                            updateFormData("investmentGoal", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="minimumInvestment">
                          Minimum Investment (RLUSD)
                        </Label>
                        <Input
                          id="minimumInvestment"
                          type="number"
                          placeholder="100"
                          value={formData.minimumInvestment}
                          onChange={(e) =>
                            updateFormData("minimumInvestment", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="expectedROI">Expected ROI (%)</Label>
                        <Input
                          id="expectedROI"
                          type="number"
                          placeholder="18"
                          value={formData.expectedROI}
                          onChange={(e) =>
                            updateFormData("expectedROI", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="duration">Duration (days)</Label>
                        <Input
                          id="duration"
                          type="number"
                          placeholder="180"
                          value={formData.duration}
                          onChange={(e) =>
                            updateFormData("duration", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="termType">Term Type</Label>
                        <Select
                          value={formData.termType}
                          onValueChange={(value) =>
                            updateFormData("termType", value)
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select term type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short">
                              Short Term (&lt;= 6 months)
                            </SelectItem>
                            <SelectItem value="long">
                              Long Term (&gt; 6 months)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="returnType">Return Type</Label>
                      <Select
                        value={formData.returnType}
                        onValueChange={(value) =>
                          updateFormData("returnType", value)
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select return type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed Return</SelectItem>
                          <SelectItem value="variable">
                            Variable Return
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Budget Breakdown
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="seeds">Seeds (RLUSD)</Label>
                          <Input
                            id="seeds"
                            type="number"
                            placeholder="3000"
                            value={formData.seeds}
                            onChange={(e) =>
                              updateFormData("seeds", e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="fertilizer">Fertilizer (RLUSD)</Label>
                          <Input
                            id="fertilizer"
                            type="number"
                            placeholder="4000"
                            value={formData.fertilizer}
                            onChange={(e) =>
                              updateFormData("fertilizer", e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="labor">Labor (RLUSD)</Label>
                          <Input
                            id="labor"
                            type="number"
                            placeholder="8000"
                            value={formData.labor}
                            onChange={(e) =>
                              updateFormData("labor", e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="equipment">Equipment (RLUSD)</Label>
                          <Input
                            id="equipment"
                            type="number"
                            placeholder="5000"
                            value={formData.equipment}
                            onChange={(e) =>
                              updateFormData("equipment", e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="irrigation">Irrigation (RLUSD)</Label>
                          <Input
                            id="irrigation"
                            type="number"
                            placeholder="2500"
                            value={formData.irrigation}
                            onChange={(e) =>
                              updateFormData("irrigation", e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="certification">
                            Certification (RLUSD)
                          </Label>
                          <Input
                            id="certification"
                            type="number"
                            placeholder="1500"
                            value={formData.certification}
                            onChange={(e) =>
                              updateFormData("certification", e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="misc">Miscellaneous (RLUSD)</Label>
                          <Input
                            id="misc"
                            type="number"
                            placeholder="1000"
                            value={formData.misc}
                            onChange={(e) =>
                              updateFormData("misc", e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Project Details */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="cropType">Crop Type</Label>
                        <Input
                          id="cropType"
                          placeholder="e.g., Jasmine Rice"
                          value={formData.cropType}
                          onChange={(e) =>
                            updateFormData("cropType", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="expectedYield">
                          Expected Yield (tons)
                        </Label>
                        <Input
                          id="expectedYield"
                          type="number"
                          placeholder="45"
                          value={formData.expectedYield}
                          onChange={(e) =>
                            updateFormData("expectedYield", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="plantingDate">Planting Date</Label>
                        <Input
                          id="plantingDate"
                          type="date"
                          value={formData.plantingDate}
                          onChange={(e) =>
                            updateFormData("plantingDate", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="expectedHarvest">
                          Expected Harvest Date
                        </Label>
                        <Input
                          id="expectedHarvest"
                          type="date"
                          value={formData.expectedHarvest}
                          onChange={(e) =>
                            updateFormData("expectedHarvest", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="marketPrice">
                          Market Price (per ton)
                        </Label>
                        <Input
                          id="marketPrice"
                          type="number"
                          placeholder="1200"
                          value={formData.marketPrice}
                          onChange={(e) =>
                            updateFormData("marketPrice", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Risk Assessment & Timeline */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="riskLevel">Risk Level</Label>
                      <Select
                        value={formData.riskLevel}
                        onValueChange={(value) =>
                          updateFormData("riskLevel", value)
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low Risk</SelectItem>
                          <SelectItem value="Medium">Medium Risk</SelectItem>
                          <SelectItem value="High">High Risk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Risk Factors
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {riskFactors.map((factor) => (
                          <div
                            key={factor}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`risk-${factor}`}
                              checked={formData.riskFactors.includes(factor)}
                              onCheckedChange={(checked) =>
                                handleArrayUpdate(
                                  "riskFactors",
                                  factor,
                                  checked as boolean
                                )
                              }
                            />
                            <Label
                              htmlFor={`risk-${factor}`}
                              className="text-sm font-normal"
                            >
                              {factor}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="mitigationStrategies">
                        Mitigation Strategies
                      </Label>
                      <Textarea
                        id="mitigationStrategies"
                        placeholder="Describe how you plan to mitigate the identified risks..."
                        value={formData.mitigationStrategies}
                        onChange={(e) =>
                          updateFormData("mitigationStrategies", e.target.value)
                        }
                        className="mt-2"
                        rows={4}
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Project Timeline
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="landPreparation">
                            Land Preparation (days)
                          </Label>
                          <Input
                            id="landPreparation"
                            type="number"
                            placeholder="14"
                            value={formData.landPreparation}
                            onChange={(e) =>
                              updateFormData("landPreparation", e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="planting">Planting (days)</Label>
                          <Input
                            id="planting"
                            type="number"
                            placeholder="7"
                            value={formData.planting}
                            onChange={(e) =>
                              updateFormData("planting", e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="growing">Growing (days)</Label>
                          <Input
                            id="growing"
                            type="number"
                            placeholder="120"
                            value={formData.growing}
                            onChange={(e) =>
                              updateFormData("growing", e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="harvesting">Harvesting (days)</Label>
                          <Input
                            id="harvesting"
                            type="number"
                            placeholder="14"
                            value={formData.harvesting}
                            onChange={(e) =>
                              updateFormData("harvesting", e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="processing">
                            Processing & Sale (days)
                          </Label>
                          <Input
                            id="processing"
                            type="number"
                            placeholder="25"
                            value={formData.processing}
                            onChange={(e) =>
                              updateFormData("processing", e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Documents & Images */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Required Documents
                      </h3>
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                          <div className="text-center">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <Label
                              htmlFor="businessPlan"
                              className="cursor-pointer"
                            >
                              <span className="font-medium">Business Plan</span>
                              <span className="text-muted-foreground block text-sm">
                                Upload your detailed business plan (PDF)
                              </span>
                            </Label>
                            <Input
                              id="businessPlan"
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) =>
                                updateFormData(
                                  "businessPlan",
                                  e.target.files?.[0] || null
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                          <div className="text-center">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <Label
                              htmlFor="landOwnership"
                              className="cursor-pointer"
                            >
                              <span className="font-medium">
                                Land Ownership Certificate
                              </span>
                              <span className="text-muted-foreground block text-sm">
                                Upload land ownership documents (PDF)
                              </span>
                            </Label>
                            <Input
                              id="landOwnership"
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) =>
                                updateFormData(
                                  "landOwnership",
                                  e.target.files?.[0] || null
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                          <div className="text-center">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <Label
                              htmlFor="certificationDocs"
                              className="cursor-pointer"
                            >
                              <span className="font-medium">
                                Certification Documents
                              </span>
                              <span className="text-muted-foreground block text-sm">
                                Upload certification documents (PDF)
                              </span>
                            </Label>
                            <Input
                              id="certificationDocs"
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) =>
                                updateFormData(
                                  "certificationDocs",
                                  e.target.files?.[0] || null
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Project Images
                      </h3>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                        <div className="text-center">
                          <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <Label
                            htmlFor="projectImages"
                            className="cursor-pointer"
                          >
                            <span className="font-medium">
                              Upload Project Images
                            </span>
                            <span className="text-muted-foreground block text-sm">
                              Add photos of your farm, crops, and facilities
                              (JPG, PNG)
                            </span>
                          </Label>
                          <Input
                            id="projectImages"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) =>
                              updateFormData(
                                "projectImages",
                                Array.from(e.target.files || [])
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 6: Review & Submit */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="bg-muted/50 rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">
                        Project Summary
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Title:</span>{" "}
                          {formData.title || "Not specified"}
                        </div>
                        <div>
                          <span className="font-medium">Category:</span>{" "}
                          {formData.category || "Not specified"}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span>{" "}
                          {formData.location || "Not specified"}
                        </div>
                        <div>
                          <span className="font-medium">Investment Goal:</span>{" "}
                          ${formData.investmentGoal || "0"} RLUSD
                        </div>
                        <div>
                          <span className="font-medium">Expected ROI:</span>{" "}
                          {formData.expectedROI || "0"}%
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span>{" "}
                          {formData.duration || "0"} days
                        </div>
                        <div>
                          <span className="font-medium">Term Type:</span>{" "}
                          {formData.termType || "Not specified"}
                        </div>
                        <div>
                          <span className="font-medium">Return Type:</span>{" "}
                          {formData.returnType || "Not specified"}
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800">
                            Ready to Submit
                          </h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Please review all information carefully. Once
                            submitted, your project will be reviewed by our team
                            before going live.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the terms and conditions and confirm that all
                        information provided is accurate
                      </Label>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Draft
                    </Button>

                    {currentStep < totalSteps ? (
                      <Button
                        onClick={nextStep}
                        className="flex items-center gap-2"
                      >
                        Next
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Submit Project
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        currentStep >= 1
                          ? "bg-green-600 text-white"
                          : "bg-muted"
                      }`}
                    >
                      {currentStep > 1 ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        "1"
                      )}
                    </div>
                    <span className="text-sm">Basic Information</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        currentStep >= 2
                          ? "bg-green-600 text-white"
                          : "bg-muted"
                      }`}
                    >
                      {currentStep > 2 ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        "2"
                      )}
                    </div>
                    <span className="text-sm">Financial Details</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        currentStep >= 3
                          ? "bg-green-600 text-white"
                          : "bg-muted"
                      }`}
                    >
                      {currentStep > 3 ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        "3"
                      )}
                    </div>
                    <span className="text-sm">Project Details</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        currentStep >= 4
                          ? "bg-green-600 text-white"
                          : "bg-muted"
                      }`}
                    >
                      {currentStep > 4 ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        "4"
                      )}
                    </div>
                    <span className="text-sm">Risk & Timeline</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        currentStep >= 5
                          ? "bg-green-600 text-white"
                          : "bg-muted"
                      }`}
                    >
                      {currentStep > 5 ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        "5"
                      )}
                    </div>
                    <span className="text-sm">Documents</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        currentStep >= 6
                          ? "bg-green-600 text-white"
                          : "bg-muted"
                      }`}
                    >
                      {currentStep > 6 ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        "6"
                      )}
                    </div>
                    <span className="text-sm">Review & Submit</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tips for Success</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>
                      Provide detailed project descriptions to attract more
                      investors
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>
                      Upload high-quality images of your farm and crops
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>
                      Set realistic ROI expectations based on market conditions
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>
                      Include all relevant certifications to build trust
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Project Guidelines
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Examples
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
