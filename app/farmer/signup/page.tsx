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
  Shield,
  AlertCircle,
  Building,
  Clock,
  Users,
  DollarSign,
  MessageSquare,
} from "lucide-react";

interface FarmerSignupData {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  nationalId: string;
  dateOfBirth: string;
  address: string;
  province: string;
  region: string;

  // Experience & Qualifications
  yearsOfExperience: string;
  primarySpecialization: string;
  secondarySpecializations: string[];
  educationLevel: string;
  farmingCertifications: string[];

  // Fixed Structure Information
  structureType: string;
  structureOwnership: string;
  landSize: string;
  structureAddress: string;
  leaseAgreementDetails: string;

  // 3-Year Track Record
  previousProjects: Array<{
    year: string;
    projectType: string;
    cropType: string;
    landSize: string;
    investment: string;
    revenue: string;
    roi: string;
    challenges: string;
    outcomes: string;
  }>;

  // Financial History
  bankName: string;
  accountNumber: string;
  creditScore: string;
  monthlyIncome: string;
  monthlyExpenses: string;
  outstandingLoans: string;
  collateralAssets: string;

  // Lifestyle Information
  householdSize: string;
  dependents: string;
  otherIncomeSource: string;
  communityInvolvement: string;
  sustainabilityPractices: string;

  // Stakeholder References
  inputProviders: Array<{
    name: string;
    company: string;
    phone: string;
    email: string;
    relationshipDuration: string;
    businessVolume: string;
  }>;
  marketplaceContacts: Array<{
    name: string;
    company: string;
    phone: string;
    email: string;
    relationshipDuration: string;
    businessVolume: string;
  }>;

  // Required Documents
  nationalIdDoc: File | null;
  landOwnershipDoc: File | null;
  leaseAgreementDoc: File | null;
  bankStatements: File | null;
  incomeProof: File | null;
  educationCertificates: File | null;
  farmingCertificates: File | null;
  previousProjectDocs: File | null;
  creditReport: File | null;
  structurePhotos: File[];
  farmPhotos: File[];
}

const initialSignupData: FarmerSignupData = {
  fullName: "",
  email: "",
  phone: "",
  nationalId: "",
  dateOfBirth: "",
  address: "",
  province: "",
  region: "",
  yearsOfExperience: "",
  primarySpecialization: "",
  secondarySpecializations: [],
  educationLevel: "",
  farmingCertifications: [],
  structureType: "",
  structureOwnership: "",
  landSize: "",
  structureAddress: "",
  leaseAgreementDetails: "",
  previousProjects: [],
  bankName: "",
  accountNumber: "",
  creditScore: "",
  monthlyIncome: "",
  monthlyExpenses: "",
  outstandingLoans: "",
  collateralAssets: "",
  householdSize: "",
  dependents: "",
  otherIncomeSource: "",
  communityInvolvement: "",
  sustainabilityPractices: "",
  inputProviders: [],
  marketplaceContacts: [],
  nationalIdDoc: null,
  landOwnershipDoc: null,
  leaseAgreementDoc: null,
  bankStatements: null,
  incomeProof: null,
  educationCertificates: null,
  farmingCertificates: null,
  previousProjectDocs: null,
  creditReport: null,
  structurePhotos: [],
  farmPhotos: [],
};

const specializations = [
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

export default function FarmerSignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [signupData, setSignupData] =
    useState<FarmerSignupData>(initialSignupData);
  const totalSteps = 7;

  const updateSignupData = (field: keyof FarmerSignupData, value: any) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayUpdate = (
    field: keyof FarmerSignupData,
    value: string,
    checked: boolean
  ) => {
    setSignupData((prev) => {
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

  const addPreviousProject = () => {
    const newProject = {
      year: "",
      projectType: "",
      cropType: "",
      landSize: "",
      investment: "",
      revenue: "",
      roi: "",
      challenges: "",
      outcomes: "",
    };
    setSignupData((prev) => ({
      ...prev,
      previousProjects: [...prev.previousProjects, newProject],
    }));
  };

  const updatePreviousProject = (
    index: number,
    field: string,
    value: string
  ) => {
    setSignupData((prev) => ({
      ...prev,
      previousProjects: prev.previousProjects.map((project, i) =>
        i === index ? { ...project, [field]: value } : project
      ),
    }));
  };

  const addStakeholder = (type: "inputProviders" | "marketplaceContacts") => {
    const newStakeholder = {
      name: "",
      company: "",
      phone: "",
      email: "",
      relationshipDuration: "",
      businessVolume: "",
    };
    setSignupData((prev) => ({
      ...prev,
      [type]: [...prev[type], newStakeholder],
    }));
  };

  const updateStakeholder = (
    type: "inputProviders" | "marketplaceContacts",
    index: number,
    field: string,
    value: string
  ) => {
    setSignupData((prev) => ({
      ...prev,
      [type]: prev[type].map((stakeholder, i) =>
        i === index ? { ...stakeholder, [field]: value } : stakeholder
      ),
    }));
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
    console.log("Farmer signup data:", signupData);
    // Here you would submit the form data to your backend for due diligence processing
    alert(
      "Application submitted successfully! Our team will review your application within 5-7 business days."
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="AgriVest"
        navLinks={[
          { href: "/projects", label: "Browse Projects" },
          { href: "/how-it-works", label: "How It Works" },
        ]}
      >
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </Header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Farmer Registration & Due Diligence
          </h1>
          <p className="text-muted-foreground">
            Complete our comprehensive verification process to become a verified
            farmer on AgriVest
          </p>
        </div>

        {/* Due Diligence Requirements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Due Diligence Requirements
            </CardTitle>
            <CardDescription>
              Our verification process ensures trust and transparency for all
              stakeholders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-sm">3+ Years Experience</div>
                  <div className="text-xs text-muted-foreground">
                    Minimum farming experience required
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Building className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-sm">Fixed Structure</div>
                  <div className="text-xs text-muted-foreground">
                    Own or leased land/facilities
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium text-sm">Track Record</div>
                  <div className="text-xs text-muted-foreground">
                    3 years of project history
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Users className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="font-medium text-sm">
                    Stakeholder Feedback
                  </div>
                  <div className="text-xs text-muted-foreground">
                    References from suppliers & buyers
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
              <span>Personal Info</span>
              <span>Experience</span>
              <span>Structure</span>
              <span>Track Record</span>
              <span>Financial</span>
              <span>Stakeholders</span>
              <span>Documents</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>
                  {currentStep === 1 && "Personal Information"}
                  {currentStep === 2 && "Experience & Qualifications"}
                  {currentStep === 3 && "Fixed Structure Information"}
                  {currentStep === 4 && "3-Year Track Record"}
                  {currentStep === 5 && "Financial & Lifestyle History"}
                  {currentStep === 6 && "Stakeholder References"}
                  {currentStep === 7 && "Document Upload & Review"}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 &&
                    "Provide your basic personal and contact information"}
                  {currentStep === 2 &&
                    "Detail your farming experience and qualifications"}
                  {currentStep === 3 &&
                    "Information about your farming facilities and land"}
                  {currentStep === 4 &&
                    "Document your previous farming projects and outcomes"}
                  {currentStep === 5 &&
                    "Financial status and lifestyle information for credit analysis"}
                  {currentStep === 6 &&
                    "References from input providers and marketplace contacts"}
                  {currentStep === 7 &&
                    "Upload required documents and review your application"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          placeholder="Enter your full legal name"
                          value={signupData.fullName}
                          onChange={(e) =>
                            updateSignupData("fullName", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nationalId">National ID Number</Label>
                        <Input
                          id="nationalId"
                          placeholder="Enter your national ID"
                          value={signupData.nationalId}
                          onChange={(e) =>
                            updateSignupData("nationalId", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={signupData.email}
                          onChange={(e) =>
                            updateSignupData("email", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="+66 XX XXX XXXX"
                          value={signupData.phone}
                          onChange={(e) =>
                            updateSignupData("phone", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={signupData.dateOfBirth}
                          onChange={(e) =>
                            updateSignupData("dateOfBirth", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Full Address</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter your complete address"
                        value={signupData.address}
                        onChange={(e) =>
                          updateSignupData("address", e.target.value)
                        }
                        className="mt-2"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="region">Region</Label>
                        <Select
                          value={signupData.region}
                          onValueChange={(value) =>
                            updateSignupData("region", value)
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
                          value={signupData.province}
                          onChange={(e) =>
                            updateSignupData("province", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Experience & Qualifications */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800">
                            Minimum Experience Requirement
                          </h4>
                          <p className="text-sm text-blue-700 mt-1">
                            You must have at least 3 years of experience in your
                            primary specialization to qualify as a verified
                            farmer.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="yearsOfExperience">
                          Years of Farming Experience
                        </Label>
                        <Input
                          id="yearsOfExperience"
                          type="number"
                          placeholder="e.g., 5"
                          value={signupData.yearsOfExperience}
                          onChange={(e) =>
                            updateSignupData(
                              "yearsOfExperience",
                              e.target.value
                            )
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="primarySpecialization">
                          Primary Specialization
                        </Label>
                        <Select
                          value={signupData.primarySpecialization}
                          onValueChange={(value) =>
                            updateSignupData("primarySpecialization", value)
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select primary specialization" />
                          </SelectTrigger>
                          <SelectContent>
                            {specializations.map((spec) => (
                              <SelectItem key={spec} value={spec}>
                                {spec}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Secondary Specializations (Optional)
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {specializations
                          .filter(
                            (spec) => spec !== signupData.primarySpecialization
                          )
                          .map((spec) => (
                            <div
                              key={spec}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`secondary-${spec}`}
                                checked={signupData.secondarySpecializations.includes(
                                  spec
                                )}
                                onCheckedChange={(checked) =>
                                  handleArrayUpdate(
                                    "secondarySpecializations",
                                    spec,
                                    checked as boolean
                                  )
                                }
                              />
                              <Label
                                htmlFor={`secondary-${spec}`}
                                className="text-sm font-normal"
                              >
                                {spec}
                              </Label>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="educationLevel">Education Level</Label>
                      <Select
                        value={signupData.educationLevel}
                        onValueChange={(value) =>
                          updateSignupData("educationLevel", value)
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">
                            Primary Education
                          </SelectItem>
                          <SelectItem value="secondary">
                            Secondary Education
                          </SelectItem>
                          <SelectItem value="vocational">
                            Vocational Training
                          </SelectItem>
                          <SelectItem value="bachelor">
                            Bachelor's Degree
                          </SelectItem>
                          <SelectItem value="master">
                            Master's Degree
                          </SelectItem>
                          <SelectItem value="phd">PhD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Farming Certifications
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {certificationOptions.map((cert) => (
                          <div
                            key={cert}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`farming-cert-${cert}`}
                              checked={signupData.farmingCertifications.includes(
                                cert
                              )}
                              onCheckedChange={(checked) =>
                                handleArrayUpdate(
                                  "farmingCertifications",
                                  cert,
                                  checked as boolean
                                )
                              }
                            />
                            <Label
                              htmlFor={`farming-cert-${cert}`}
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

                {/* Step 3: Fixed Structure Information */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Building className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-800">
                            Fixed Structure Requirement
                          </h4>
                          <p className="text-sm text-green-700 mt-1">
                            You must have access to fixed farming infrastructure
                            (owned or leased) to conduct agricultural
                            operations.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="structureType">Structure Type</Label>
                        <Select
                          value={signupData.structureType}
                          onValueChange={(value) =>
                            updateSignupData("structureType", value)
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select structure type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="farmland">Farmland</SelectItem>
                            <SelectItem value="greenhouse">
                              Greenhouse
                            </SelectItem>
                            <SelectItem value="livestock_shed">
                              Livestock Shed
                            </SelectItem>
                            <SelectItem value="aquaculture_pond">
                              Aquaculture Pond
                            </SelectItem>
                            <SelectItem value="poultry_house">
                              Poultry House
                            </SelectItem>
                            <SelectItem value="processing_facility">
                              Processing Facility
                            </SelectItem>
                            <SelectItem value="storage_warehouse">
                              Storage Warehouse
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="structureOwnership">
                          Ownership Status
                        </Label>
                        <Select
                          value={signupData.structureOwnership}
                          onValueChange={(value) =>
                            updateSignupData("structureOwnership", value)
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select ownership status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owned">Owned</SelectItem>
                            <SelectItem value="leased">Leased</SelectItem>
                            <SelectItem value="family_owned">
                              Family Owned
                            </SelectItem>
                            <SelectItem value="cooperative">
                              Cooperative
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="landSize">Land/Structure Size</Label>
                        <Input
                          id="landSize"
                          placeholder="e.g., 25 hectares or 500 sq meters"
                          value={signupData.landSize}
                          onChange={(e) =>
                            updateSignupData("landSize", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="structureAddress">
                          Structure Address
                        </Label>
                        <Input
                          id="structureAddress"
                          placeholder="Address of farming structure"
                          value={signupData.structureAddress}
                          onChange={(e) =>
                            updateSignupData("structureAddress", e.target.value)
                          }
                          className="mt-2"
                        />
                      </div>
                    </div>

                    {signupData.structureOwnership === "leased" && (
                      <div>
                        <Label htmlFor="leaseAgreementDetails">
                          Lease Agreement Details
                        </Label>
                        <Textarea
                          id="leaseAgreementDetails"
                          placeholder="Provide details about your lease agreement (duration, terms, etc.)"
                          value={signupData.leaseAgreementDetails}
                          onChange={(e) =>
                            updateSignupData(
                              "leaseAgreementDetails",
                              e.target.value
                            )
                          }
                          className="mt-2"
                          rows={3}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: 3-Year Track Record */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-purple-800">
                            Track Record Requirement
                          </h4>
                          <p className="text-sm text-purple-700 mt-1">
                            Please provide details of your farming projects from
                            the last 3 years. This helps us assess your
                            experience and success rate.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Previous Projects</h3>
                      <Button
                        onClick={addPreviousProject}
                        variant="outline"
                        size="sm"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Add Project
                      </Button>
                    </div>

                    {signupData.previousProjects.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>
                          No projects added yet. Click "Add Project" to get
                          started.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {signupData.previousProjects.map((project, index) => (
                          <Card key={index}>
                            <CardHeader>
                              <CardTitle className="text-lg">
                                Project {index + 1}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <Label htmlFor={`project-year-${index}`}>
                                    Year
                                  </Label>
                                  <Input
                                    id={`project-year-${index}`}
                                    placeholder="2023"
                                    value={project.year}
                                    onChange={(e) =>
                                      updatePreviousProject(
                                        index,
                                        "year",
                                        e.target.value
                                      )
                                    }
                                    className="mt-2"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`project-type-${index}`}>
                                    Project Type
                                  </Label>
                                  <Select
                                    value={project.projectType}
                                    onValueChange={(value) =>
                                      updatePreviousProject(
                                        index,
                                        "projectType",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger className="mt-2">
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {specializations.map((spec) => (
                                        <SelectItem key={spec} value={spec}>
                                          {spec}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor={`crop-type-${index}`}>
                                    Crop/Product Type
                                  </Label>
                                  <Input
                                    id={`crop-type-${index}`}
                                    placeholder="e.g., Jasmine Rice"
                                    value={project.cropType}
                                    onChange={(e) =>
                                      updatePreviousProject(
                                        index,
                                        "cropType",
                                        e.target.value
                                      )
                                    }
                                    className="mt-2"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                  <Label htmlFor={`land-size-${index}`}>
                                    Land Size
                                  </Label>
                                  <Input
                                    id={`land-size-${index}`}
                                    placeholder="25 hectares"
                                    value={project.landSize}
                                    onChange={(e) =>
                                      updatePreviousProject(
                                        index,
                                        "landSize",
                                        e.target.value
                                      )
                                    }
                                    className="mt-2"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`investment-${index}`}>
                                    Investment (THB)
                                  </Label>
                                  <Input
                                    id={`investment-${index}`}
                                    placeholder="500000"
                                    value={project.investment}
                                    onChange={(e) =>
                                      updatePreviousProject(
                                        index,
                                        "investment",
                                        e.target.value
                                      )
                                    }
                                    className="mt-2"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`revenue-${index}`}>
                                    Revenue (THB)
                                  </Label>
                                  <Input
                                    id={`revenue-${index}`}
                                    placeholder="650000"
                                    value={project.revenue}
                                    onChange={(e) =>
                                      updatePreviousProject(
                                        index,
                                        "revenue",
                                        e.target.value
                                      )
                                    }
                                    className="mt-2"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`roi-${index}`}>
                                    ROI (%)
                                  </Label>
                                  <Input
                                    id={`roi-${index}`}
                                    placeholder="30"
                                    value={project.roi}
                                    onChange={(e) =>
                                      updatePreviousProject(
                                        index,
                                        "roi",
                                        e.target.value
                                      )
                                    }
                                    className="mt-2"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`challenges-${index}`}>
                                    Challenges Faced
                                  </Label>
                                  <Textarea
                                    id={`challenges-${index}`}
                                    placeholder="Describe any challenges encountered"
                                    value={project.challenges}
                                    onChange={(e) =>
                                      updatePreviousProject(
                                        index,
                                        "challenges",
                                        e.target.value
                                      )
                                    }
                                    className="mt-2"
                                    rows={2}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`outcomes-${index}`}>
                                    Outcomes & Lessons
                                  </Label>
                                  <Textarea
                                    id={`outcomes-${index}`}
                                    placeholder="Describe outcomes and lessons learned"
                                    value={project.outcomes}
                                    onChange={(e) =>
                                      updatePreviousProject(
                                        index,
                                        "outcomes",
                                        e.target.value
                                      )
                                    }
                                    className="mt-2"
                                    rows={2}
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 5: Financial & Lifestyle History */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-orange-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-orange-800">
                            Financial Assessment
                          </h4>
                          <p className="text-sm text-orange-700 mt-1">
                            This information is used for credit analysis and
                            risk assessment. All data is kept confidential and
                            secure.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Banking Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input
                            id="bankName"
                            placeholder="e.g., Bangkok Bank"
                            value={signupData.bankName}
                            onChange={(e) =>
                              updateSignupData("bankName", e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input
                            id="accountNumber"
                            placeholder="XXX-X-XXXXX-X"
                            value={signupData.accountNumber}
                            onChange={(e) =>
                              updateSignupData("accountNumber", e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="creditScore">
                            Credit Score (if known)
                          </Label>
                          <Input
                            id="creditScore"
                            placeholder="e.g., 750"
                            value={signupData.creditScore}
                            onChange={(e) =>
                              updateSignupData("creditScore", e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Financial Status
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="monthlyIncome">
                            Monthly Income (THB)
                          </Label>
                          <Input
                            id="monthlyIncome"
                            placeholder="50000"
                            value={signupData.monthlyIncome}
                            onChange={(e) =>
                              updateSignupData("monthlyIncome", e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="monthlyExpenses">
                            Monthly Expenses (THB)
                          </Label>
                          <Input
                            id="monthlyExpenses"
                            placeholder="30000"
                            value={signupData.monthlyExpenses}
                            onChange={(e) =>
                              updateSignupData(
                                "monthlyExpenses",
                                e.target.value
                              )
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="outstandingLoans">
                            Outstanding Loans (THB)
                          </Label>
                          <Input
                            id="outstandingLoans"
                            placeholder="200000"
                            value={signupData.outstandingLoans}
                            onChange={(e) =>
                              updateSignupData(
                                "outstandingLoans",
                                e.target.value
                              )
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="collateralAssets">
                            Collateral Assets Value (THB)
                          </Label>
                          <Input
                            id="collateralAssets"
                            placeholder="1000000"
                            value={signupData.collateralAssets}
                            onChange={(e) =>
                              updateSignupData(
                                "collateralAssets",
                                e.target.value
                              )
                            }
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Lifestyle Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="householdSize">Household Size</Label>
                          <Input
                            id="householdSize"
                            type="number"
                            placeholder="4"
                            value={signupData.householdSize}
                            onChange={(e) =>
                              updateSignupData("householdSize", e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dependents">
                            Number of Dependents
                          </Label>
                          <Input
                            id="dependents"
                            type="number"
                            placeholder="2"
                            value={signupData.dependents}
                            onChange={(e) =>
                              updateSignupData("dependents", e.target.value)
                            }
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="otherIncomeSource">
                            Other Income Sources
                          </Label>
                          <Input
                            id="otherIncomeSource"
                            placeholder="e.g., Part-time teaching"
                            value={signupData.otherIncomeSource}
                            onChange={(e) =>
                              updateSignupData(
                                "otherIncomeSource",
                                e.target.value
                              )
                            }
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <Label htmlFor="communityInvolvement">
                            Community Involvement
                          </Label>
                          <Textarea
                            id="communityInvolvement"
                            placeholder="Describe your involvement in local farming community"
                            value={signupData.communityInvolvement}
                            onChange={(e) =>
                              updateSignupData(
                                "communityInvolvement",
                                e.target.value
                              )
                            }
                            className="mt-2"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="sustainabilityPractices">
                            Sustainability Practices
                          </Label>
                          <Textarea
                            id="sustainabilityPractices"
                            placeholder="Describe your sustainable farming practices"
                            value={signupData.sustainabilityPractices}
                            onChange={(e) =>
                              updateSignupData(
                                "sustainabilityPractices",
                                e.target.value
                              )
                            }
                            className="mt-2"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 6: Stakeholder References */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-indigo-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-indigo-800">
                            Stakeholder References
                          </h4>
                          <p className="text-sm text-indigo-700 mt-1">
                            Provide references from input providers and
                            marketplace contacts who can verify your farming
                            activities and business relationships.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Input Providers */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Input Providers</h3>
                        <Button
                          onClick={() => addStakeholder("inputProviders")}
                          variant="outline"
                          size="sm"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Add Provider
                        </Button>
                      </div>

                      {signupData.inputProviders.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                          <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No input providers added yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {signupData.inputProviders.map((provider, index) => (
                            <Card key={index}>
                              <CardContent className="pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <Label htmlFor={`provider-name-${index}`}>
                                      Contact Name
                                    </Label>
                                    <Input
                                      id={`provider-name-${index}`}
                                      placeholder="Full name"
                                      value={provider.name}
                                      onChange={(e) =>
                                        updateStakeholder(
                                          "inputProviders",
                                          index,
                                          "name",
                                          e.target.value
                                        )
                                      }
                                      className="mt-2"
                                    />
                                  </div>
                                  <div>
                                    <Label
                                      htmlFor={`provider-company-${index}`}
                                    >
                                      Company
                                    </Label>
                                    <Input
                                      id={`provider-company-${index}`}
                                      placeholder="Company name"
                                      value={provider.company}
                                      onChange={(e) =>
                                        updateStakeholder(
                                          "inputProviders",
                                          index,
                                          "company",
                                          e.target.value
                                        )
                                      }
                                      className="mt-2"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`provider-phone-${index}`}>
                                      Phone
                                    </Label>
                                    <Input
                                      id={`provider-phone-${index}`}
                                      placeholder="Phone number"
                                      value={provider.phone}
                                      onChange={(e) =>
                                        updateStakeholder(
                                          "inputProviders",
                                          index,
                                          "phone",
                                          e.target.value
                                        )
                                      }
                                      className="mt-2"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`provider-email-${index}`}>
                                      Email
                                    </Label>
                                    <Input
                                      id={`provider-email-${index}`}
                                      placeholder="Email address"
                                      value={provider.email}
                                      onChange={(e) =>
                                        updateStakeholder(
                                          "inputProviders",
                                          index,
                                          "email",
                                          e.target.value
                                        )
                                      }
                                      className="mt-2"
                                    />
                                  </div>
                                  <div>
                                    <Label
                                      htmlFor={`provider-duration-${index}`}
                                    >
                                      Relationship Duration
                                    </Label>
                                    <Input
                                      id={`provider-duration-${index}`}
                                      placeholder="e.g., 3 years"
                                      value={provider.relationshipDuration}
                                      onChange={(e) =>
                                        updateStakeholder(
                                          "inputProviders",
                                          index,
                                          "relationshipDuration",
                                          e.target.value
                                        )
                                      }
                                      className="mt-2"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`provider-volume-${index}`}>
                                      Business Volume
                                    </Label>
                                    <Input
                                      id={`provider-volume-${index}`}
                                      placeholder="e.g., 100,000 THB/year"
                                      value={provider.businessVolume}
                                      onChange={(e) =>
                                        updateStakeholder(
                                          "inputProviders",
                                          index,
                                          "businessVolume",
                                          e.target.value
                                        )
                                      }
                                      className="mt-2"
                                    />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Marketplace Contacts */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">
                          Marketplace Contacts
                        </h3>
                        <Button
                          onClick={() => addStakeholder("marketplaceContacts")}
                          variant="outline"
                          size="sm"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Add Contact
                        </Button>
                      </div>

                      {signupData.marketplaceContacts.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                          <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No marketplace contacts added yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {signupData.marketplaceContacts.map(
                            (contact, index) => (
                              <Card key={index}>
                                <CardContent className="pt-4">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <Label htmlFor={`contact-name-${index}`}>
                                        Contact Name
                                      </Label>
                                      <Input
                                        id={`contact-name-${index}`}
                                        placeholder="Full name"
                                        value={contact.name}
                                        onChange={(e) =>
                                          updateStakeholder(
                                            "marketplaceContacts",
                                            index,
                                            "name",
                                            e.target.value
                                          )
                                        }
                                        className="mt-2"
                                      />
                                    </div>
                                    <div>
                                      <Label
                                        htmlFor={`contact-company-${index}`}
                                      >
                                        Company
                                      </Label>
                                      <Input
                                        id={`contact-company-${index}`}
                                        placeholder="Company name"
                                        value={contact.company}
                                        onChange={(e) =>
                                          updateStakeholder(
                                            "marketplaceContacts",
                                            index,
                                            "company",
                                            e.target.value
                                          )
                                        }
                                        className="mt-2"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor={`contact-phone-${index}`}>
                                        Phone
                                      </Label>
                                      <Input
                                        id={`contact-phone-${index}`}
                                        placeholder="Phone number"
                                        value={contact.phone}
                                        onChange={(e) =>
                                          updateStakeholder(
                                            "marketplaceContacts",
                                            index,
                                            "phone",
                                            e.target.value
                                          )
                                        }
                                        className="mt-2"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor={`contact-email-${index}`}>
                                        Email
                                      </Label>
                                      <Input
                                        id={`contact-email-${index}`}
                                        placeholder="Email address"
                                        value={contact.email}
                                        onChange={(e) =>
                                          updateStakeholder(
                                            "marketplaceContacts",
                                            index,
                                            "email",
                                            e.target.value
                                          )
                                        }
                                        className="mt-2"
                                      />
                                    </div>
                                    <div>
                                      <Label
                                        htmlFor={`contact-duration-${index}`}
                                      >
                                        Relationship Duration
                                      </Label>
                                      <Input
                                        id={`contact-duration-${index}`}
                                        placeholder="e.g., 2 years"
                                        value={contact.relationshipDuration}
                                        onChange={(e) =>
                                          updateStakeholder(
                                            "marketplaceContacts",
                                            index,
                                            "relationshipDuration",
                                            e.target.value
                                          )
                                        }
                                        className="mt-2"
                                      />
                                    </div>
                                    <div>
                                      <Label
                                        htmlFor={`contact-volume-${index}`}
                                      >
                                        Business Volume
                                      </Label>
                                      <Input
                                        id={`contact-volume-${index}`}
                                        placeholder="e.g., 200,000 THB/year"
                                        value={contact.businessVolume}
                                        onChange={(e) =>
                                          updateStakeholder(
                                            "marketplaceContacts",
                                            index,
                                            "businessVolume",
                                            e.target.value
                                          )
                                        }
                                        className="mt-2"
                                      />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 7: Document Upload & Review */}
                {currentStep === 7 && (
                  <div className="space-y-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Upload className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-red-800">
                            Required Documents
                          </h4>
                          <p className="text-sm text-red-700 mt-1">
                            Upload all required documents to complete your
                            application. These will be stored securely on-chain
                            for verification purposes.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Required Documents */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          Required Documents
                        </h3>

                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                          <div className="text-center">
                            <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                            <Label
                              htmlFor="nationalIdDoc"
                              className="cursor-pointer"
                            >
                              <span className="font-medium">
                                National ID Document
                              </span>
                              <span className="text-muted-foreground block text-sm">
                                PDF or Image
                              </span>
                            </Label>
                            <Input
                              id="nationalIdDoc"
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) =>
                                updateSignupData(
                                  "nationalIdDoc",
                                  e.target.files?.[0] || null
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                          <div className="text-center">
                            <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                            <Label
                              htmlFor="landOwnershipDoc"
                              className="cursor-pointer"
                            >
                              <span className="font-medium">
                                Land Ownership/Lease Document
                              </span>
                              <span className="text-muted-foreground block text-sm">
                                PDF
                              </span>
                            </Label>
                            <Input
                              id="landOwnershipDoc"
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) =>
                                updateSignupData(
                                  "landOwnershipDoc",
                                  e.target.files?.[0] || null
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                          <div className="text-center">
                            <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                            <Label
                              htmlFor="bankStatements"
                              className="cursor-pointer"
                            >
                              <span className="font-medium">
                                Bank Statements (3 months)
                              </span>
                              <span className="text-muted-foreground block text-sm">
                                PDF
                              </span>
                            </Label>
                            <Input
                              id="bankStatements"
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) =>
                                updateSignupData(
                                  "bankStatements",
                                  e.target.files?.[0] || null
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                          <div className="text-center">
                            <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                            <Label
                              htmlFor="incomeProof"
                              className="cursor-pointer"
                            >
                              <span className="font-medium">Income Proof</span>
                              <span className="text-muted-foreground block text-sm">
                                Tax returns, salary slips, etc.
                              </span>
                            </Label>
                            <Input
                              id="incomeProof"
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) =>
                                updateSignupData(
                                  "incomeProof",
                                  e.target.files?.[0] || null
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                          <div className="text-center">
                            <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                            <Label
                              htmlFor="previousProjectDocs"
                              className="cursor-pointer"
                            >
                              <span className="font-medium">
                                Previous Project Documentation
                              </span>
                              <span className="text-muted-foreground block text-sm">
                                Contracts, receipts, harvest records
                              </span>
                            </Label>
                            <Input
                              id="previousProjectDocs"
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) =>
                                updateSignupData(
                                  "previousProjectDocs",
                                  e.target.files?.[0] || null
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* Optional Documents */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">
                          Optional Documents
                        </h3>

                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                          <div className="text-center">
                            <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                            <Label
                              htmlFor="educationCertificates"
                              className="cursor-pointer"
                            >
                              <span className="font-medium">
                                Education Certificates
                              </span>
                              <span className="text-muted-foreground block text-sm">
                                Degrees, diplomas
                              </span>
                            </Label>
                            <Input
                              id="educationCertificates"
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) =>
                                updateSignupData(
                                  "educationCertificates",
                                  e.target.files?.[0] || null
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                          <div className="text-center">
                            <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                            <Label
                              htmlFor="farmingCertificatesDoc"
                              className="cursor-pointer"
                            >
                              <span className="font-medium">
                                Farming Certificates
                              </span>
                              <span className="text-muted-foreground block text-sm">
                                Organic, GAP, etc.
                              </span>
                            </Label>
                            <Input
                              id="farmingCertificatesDoc"
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) =>
                                updateSignupData(
                                  "farmingCertificates",
                                  e.target.files?.[0] || null
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                          <div className="text-center">
                            <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                            <Label
                              htmlFor="creditReport"
                              className="cursor-pointer"
                            >
                              <span className="font-medium">Credit Report</span>
                              <span className="text-muted-foreground block text-sm">
                                If available
                              </span>
                            </Label>
                            <Input
                              id="creditReport"
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) =>
                                updateSignupData(
                                  "creditReport",
                                  e.target.files?.[0] || null
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                          <div className="text-center">
                            <Camera className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                            <Label
                              htmlFor="structurePhotos"
                              className="cursor-pointer"
                            >
                              <span className="font-medium">
                                Structure Photos
                              </span>
                              <span className="text-muted-foreground block text-sm">
                                Farm, shed, facilities
                              </span>
                            </Label>
                            <Input
                              id="structurePhotos"
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) =>
                                updateSignupData(
                                  "structurePhotos",
                                  Array.from(e.target.files || [])
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                          <div className="text-center">
                            <Camera className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                            <Label
                              htmlFor="farmPhotos"
                              className="cursor-pointer"
                            >
                              <span className="font-medium">Farm Photos</span>
                              <span className="text-muted-foreground block text-sm">
                                Crops, livestock, operations
                              </span>
                            </Label>
                            <Input
                              id="farmPhotos"
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) =>
                                updateSignupData(
                                  "farmPhotos",
                                  Array.from(e.target.files || [])
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Application Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Application Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Name:</span>{" "}
                            {signupData.fullName || "Not provided"}
                          </div>
                          <div>
                            <span className="font-medium">Experience:</span>{" "}
                            {signupData.yearsOfExperience || "0"} years
                          </div>
                          <div>
                            <span className="font-medium">Specialization:</span>{" "}
                            {signupData.primarySpecialization ||
                              "Not specified"}
                          </div>
                          <div>
                            <span className="font-medium">Structure:</span>{" "}
                            {signupData.structureType || "Not specified"}
                          </div>
                          <div>
                            <span className="font-medium">Projects:</span>{" "}
                            {signupData.previousProjects.length}
                          </div>
                          <div>
                            <span className="font-medium">
                              Input Providers:
                            </span>{" "}
                            {signupData.inputProviders.length}
                          </div>
                          <div>
                            <span className="font-medium">
                              Marketplace Contacts:
                            </span>{" "}
                            {signupData.marketplaceContacts.length}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Terms and Conditions */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800">
                            Ready to Submit
                          </h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Your application will be reviewed by our due
                            diligence team. All information and documents will
                            be stored securely on-chain for verification
                            purposes.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to the terms and conditions and privacy policy
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="accuracy" />
                        <Label htmlFor="accuracy" className="text-sm">
                          I confirm that all information provided is accurate
                          and complete
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="verification" />
                        <Label htmlFor="verification" className="text-sm">
                          I consent to verification of the provided information
                          and references
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="blockchain" />
                        <Label htmlFor="blockchain" className="text-sm">
                          I understand that my due diligence data will be stored
                          on-chain for transparency
                        </Label>
                      </div>
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
                        Submit Application
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
                    <span className="text-sm">Personal Information</span>
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
                    <span className="text-sm">Experience</span>
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
                    <span className="text-sm">Structure</span>
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
                    <span className="text-sm">Track Record</span>
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
                    <span className="text-sm">Financial</span>
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
                    <span className="text-sm">Stakeholders</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        currentStep >= 7
                          ? "bg-green-600 text-white"
                          : "bg-muted"
                      }`}
                    >
                      {currentStep > 7 ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        "7"
                      )}
                    </div>
                    <span className="text-sm">Documents</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Due Diligence Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Due Diligence Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Minimum 3 years farming experience</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Fixed structure (owned or leased)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>3-year track record documentation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Financial and lifestyle verification</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Stakeholder references</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Complete document submission</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Review Process</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                      1
                    </div>
                    <div>
                      <div className="font-medium">Application Review</div>
                      <div className="text-muted-foreground">
                        1-2 business days
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                      2
                    </div>
                    <div>
                      <div className="font-medium">Document Verification</div>
                      <div className="text-muted-foreground">
                        2-3 business days
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                      3
                    </div>
                    <div>
                      <div className="font-medium">Reference Check</div>
                      <div className="text-muted-foreground">
                        2-3 business days
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-medium">
                      4
                    </div>
                    <div>
                      <div className="font-medium">Final Approval</div>
                      <div className="text-muted-foreground">
                        1 business day
                      </div>
                    </div>
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
                    Application Guide
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
                    <Shield className="w-4 h-4 mr-2" />
                    Due Diligence FAQ
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
