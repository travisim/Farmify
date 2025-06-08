"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Grid3X3,
  List,
  Leaf,
} from "lucide-react";

// Mock data for all projects with new properties
const allProjects = [
  {
    id: "1",
    title: "Organic Jasmine Rice Farm - Season 2024",
    category: "Rice",
    location: "Pune, India",
    province: "Maharashtra",
    region: "West",
    farmer: "Somchai Jaidee",
    farmerRating: 4.8,
    investmentGoal: 25000,
    currentFunding: 18500,
    minimumInvestment: 100,
    expectedROI: 18,
    duration: 180,
    daysRemaining: 45,
    riskLevel: "Medium",
    stage: "funding",
    image: "/placeholder.svg?height=200&width=300",
    certifications: ["Organic", "Fair Trade"],
    description:
      "Premium organic jasmine rice cultivation with sustainable farming practices",
    createdAt: new Date("2024-01-15"),
    termType: "long", // short, long
    returnType: "variable", // variable, fixed
  },
  {
    id: "2",
    title: "Hydroponic Tomato Greenhouse",
    category: "Vegetables",
    location: "Bangalore, India",
    province: "Karnataka",
    region: "South",
    farmer: "Malee Srisuk",
    farmerRating: 4.9,
    investmentGoal: 45000,
    currentFunding: 32000,
    minimumInvestment: 200,
    expectedROI: 25,
    duration: 365,
    daysRemaining: 120,
    riskLevel: "Low",
    stage: "active",
    image: "/placeholder.svg?height=200&width=300",
    certifications: ["GAP", "Hydroponic"],
    description:
      "Year-round hydroponic tomato production using advanced greenhouse technology",
    createdAt: new Date("2024-02-01"),
    termType: "long",
    returnType: "fixed",
  },
  {
    id: "3",
    title: "Medicinal Herb Cultivation Farm",
    category: "Herbs",
    location: "Hyderabad, India",
    province: "Telangana",
    region: "South",
    farmer: "Niran Thanakit",
    farmerRating: 4.7,
    investmentGoal: 28000,
    currentFunding: 15000,
    minimumInvestment: 150,
    expectedROI: 45,
    duration: 200,
    daysRemaining: 80,
    riskLevel: "High",
    stage: "funding",
    image: "/placeholder.svg?height=200&width=300",
    certifications: ["Organic", "Medicinal Grade"],
    description:
      "High-value medicinal herbs for pharmaceutical and wellness markets",
    createdAt: new Date("2024-01-20"),
    termType: "long",
    returnType: "variable",
  },
  {
    id: "4",
    title: "Sweet Corn Commercial Farm",
    category: "Corn",
    location: "Lucknow, India",
    province: "Uttar Pradesh",
    region: "North",
    farmer: "Prasert Kaewmala",
    farmerRating: 4.6,
    investmentGoal: 30000,
    currentFunding: 22000,
    minimumInvestment: 100,
    expectedROI: 20,
    duration: 120,
    daysRemaining: 30,
    riskLevel: "Medium",
    stage: "funding",
    image: "/placeholder.svg?height=200&width=300",
    certifications: ["GMP", "Global GAP"],
    description:
      "Large-scale sweet corn production using modern farming techniques",
    createdAt: new Date("2024-02-10"),
    termType: "short",
    returnType: "fixed",
  },
  {
    id: "5",
    title: "Organic Wheat Production Initiative",
    category: "Wheat",
    location: "Indore, India",
    province: "Madhya Pradesh",
    region: "Central",
    farmer: "Wichai Boonmee",
    farmerRating: 4.5,
    investmentGoal: 35000,
    currentFunding: 8000,
    minimumInvestment: 120,
    expectedROI: 16,
    duration: 150,
    daysRemaining: 90,
    riskLevel: "Medium",
    stage: "funding",
    image: "/placeholder.svg?height=200&width=300",
    certifications: ["Organic", "Sustainable"],
    description:
      "Sustainable wheat farming with organic practices and modern storage",
    createdAt: new Date("2024-01-25"),
    termType: "short",
    returnType: "variable",
  },
  {
    id: "6",
    title: "Premium Coffee Bean Plantation",
    category: "Specialty Crops",
    location: "Darjeeling, India",
    province: "West Bengal",
    region: "East",
    farmer: "Anan Hillside",
    farmerRating: 4.9,
    investmentGoal: 50000,
    currentFunding: 35000,
    minimumInvestment: 250,
    expectedROI: 30,
    duration: 300,
    daysRemaining: 60,
    riskLevel: "Medium",
    stage: "funding",
    image: "/placeholder.svg?height=200&width=300",
    certifications: ["Organic", "Single Origin"],
    description:
      "High-altitude premium coffee beans with direct trade partnerships",
    createdAt: new Date("2024-02-05"),
    termType: "long",
    returnType: "variable",
  },
  {
    id: "7",
    title: "Mushroom Cultivation Facility",
    category: "Vegetables",
    location: "Mumbai, India",
    province: "Maharashtra",
    region: "West",
    farmer: "Siriporn Mushroom",
    farmerRating: 4.4,
    investmentGoal: 20000,
    currentFunding: 12000,
    minimumInvestment: 80,
    expectedROI: 22,
    duration: 90,
    daysRemaining: 25,
    riskLevel: "Low",
    stage: "funding",
    image: "/placeholder.svg?height=200&width=300",
    certifications: ["Organic", "Indoor Farming"],
    description:
      "Controlled environment mushroom production with year-round harvests",
    createdAt: new Date("2024-02-12"),
    termType: "short",
    returnType: "fixed",
  },
  {
    id: "8",
    title: "Dragon Fruit Orchard Expansion",
    category: "Fruits",
    location: "Chennai, India",
    province: "Tamil Nadu",
    region: "South",
    farmer: "Kamon Fruitland",
    farmerRating: 4.8,
    investmentGoal: 40000,
    currentFunding: 28000,
    minimumInvestment: 200,
    expectedROI: 28,
    duration: 240,
    daysRemaining: 75,
    riskLevel: "Medium",
    stage: "funding",
    image: "/placeholder.svg?height=200&width=300",
    certifications: ["GAP", "Export Quality"],
    description:
      "Expanding dragon fruit orchard for domestic and export markets",
    createdAt: new Date("2024-01-30"),
    termType: "long",
    returnType: "fixed",
  },
];

interface ProjectFilters {
  search: string;
  projectType: string;
  category: string;
  region: string;
  riskLevel: string;
  investmentRange: [number, number];
  roiRange: [number, number];
  // certifications: string[] // Removed
  sortBy: string;
}

function ProjectCard({
  project,
  viewMode,
}: {
  project: (typeof allProjects)[0];
  viewMode: "grid" | "list";
}) {
  const fundingPercentage =
    (project.currentFunding / project.investmentGoal) * 100;
  const investorCount = Math.floor(
    project.currentFunding / project.minimumInvestment
  );

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-white rounded-2xl border-0 shadow-sm">
        <div className="flex">
          <div className="w-48 flex-shrink-0 relative">
            <Image
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              width={200}
              height={150}
              className="w-full h-full object-cover"
            />
            {/* Risk Badge */}
            <div className="absolute top-2 right-2">
              <Badge
                className={`${
                  project.riskLevel === "Low"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : project.riskLevel === "Medium"
                    ? "bg-orange-100 text-orange-800 border-orange-200"
                    : "bg-red-100 text-red-800 border-red-200"
                } font-medium text-xs`}
                variant="outline"
              >
                {project.riskLevel} Risk
              </Badge>
            </div>
          </div>
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                {/* Farmer Info */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-medium text-sm">
                      {project.farmer
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {project.farmer}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500 text-sm">★</span>
                      <span className="text-sm text-gray-600">
                        {project.farmerRating}
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {project.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {project.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {project.daysRemaining} days left
                  </div>
                </div>
                {/* Description and Tags moved below location */}
                <p className="text-gray-600 mb-3 text-sm">
                  {project.description}
                </p>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-700 text-xs"
                  >
                    {project.category}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-gray-100 text-gray-700"
                  >
                    {project.termType === "short" ? "Short Term" : "Long Term"}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="text-xs bg-gray-100 text-gray-700"
                  >
                    {project.returnType === "fixed"
                      ? "Fixed Return"
                      : "Variable Return"}
                  </Badge>
                  {project.certifications.slice(0, 2).map((cert) => (
                    <Badge
                      key={cert}
                      variant="outline"
                      className="text-xs border-gray-200 text-gray-600"
                    >
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {project.expectedROI}%
                </div>
                <div className="text-sm text-gray-600">Expected ROI</div>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div className="flex-1 mr-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Funding Progress</span>
                  <span className="font-medium text-gray-900">
                    {Math.round(fundingPercentage)}%
                  </span>
                </div>
                <Progress
                  value={fundingPercentage}
                  className="h-2 mb-2 bg-gray-100"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>${project.currentFunding.toLocaleString()} raised</span>
                  <span>{investorCount} investors</span>
                </div>
              </div>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium"
                asChild
              >
                <Link href={`/projects/${project.id}`}>View Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-white rounded-2xl border-0 shadow-sm">
      <div className="relative">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />

        {/* Min Investment Overlay */}
        <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
          Min: ${project.minimumInvestment}
        </div>

        {/* Risk Badge */}
        <div className="absolute top-3 right-3">
          <Badge
            className={`${
              project.riskLevel === "Low"
                ? "bg-green-100 text-green-800 border-green-200"
                : project.riskLevel === "Medium"
                ? "bg-orange-100 text-orange-800 border-orange-200"
                : "bg-red-100 text-red-800 border-red-200"
            } font-medium`}
            variant="outline"
          >
            {project.riskLevel} Risk
          </Badge>
        </div>

        {/* ROI Badge */}
        <div className="absolute bottom-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
          {project.expectedROI}% ROI
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Farmer Info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-medium text-sm">
              {project.farmer
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{project.farmer}</div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-sm">★</span>
              <span className="text-sm text-gray-600">
                {project.farmerRating}
              </span>
            </div>
          </div>
        </div>

        {/* Project Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">
          {project.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{project.location}</span>
        </div>

        {/* Description - Added for Grid View */}
        <p className="text-gray-600 text-sm line-clamp-2">
          {project.description}
        </p>

        {/* Categories and Certifications - Moved below location and description */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="secondary"
            className="bg-gray-100 text-gray-700 text-xs"
          >
            {project.category}
          </Badge>
          <Badge
            variant="secondary"
            className="text-xs bg-gray-100 text-gray-700"
          >
            {project.termType === "short" ? "Short Term" : "Long Term"}
          </Badge>
          <Badge
            variant="secondary"
            className="text-xs bg-gray-100 text-gray-700"
          >
            {project.returnType === "fixed" ? "Fixed" : "Variable"}
          </Badge>
          {/* Optionally, add certifications here if desired for grid view */}
        </div>

        {/* Funding Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Funding Progress</span>
            <span className="font-medium text-gray-900">
              {Math.round(fundingPercentage)}%
            </span>
          </div>
          <Progress value={fundingPercentage} className="h-2 bg-gray-100" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>${project.currentFunding.toLocaleString()} raised</span>
            <span>{project.daysRemaining} days left</span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          asChild
          className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium"
        >
          <Link href={`/projects/${project.id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<ProjectFilters>({
    search: "",
    projectType: "all",
    category: "all",
    region: "all",
    riskLevel: "all",
    investmentRange: [0, 100000],
    roiRange: [0, 50],
    // certifications: [], // Removed
    sortBy: "newest",
  });

  // Filter and sort projects
  const filteredProjects = allProjects
    .filter((project) => {
      if (
        filters.search &&
        !project.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !project.farmer.toLowerCase().includes(filters.search.toLowerCase()) &&
        !project.category.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.projectType !== "all") {
        if (filters.projectType === "short" && project.termType !== "short")
          return false;
        if (filters.projectType === "long" && project.termType !== "long")
          return false;
        if (
          filters.projectType === "variable" &&
          project.returnType !== "variable"
        )
          return false;
        if (filters.projectType === "fixed" && project.returnType !== "fixed")
          return false;
      }
      if (filters.category !== "all" && project.category !== filters.category)
        return false;
      if (filters.region !== "all" && project.region !== filters.region)
        return false;
      if (
        filters.riskLevel !== "all" &&
        project.riskLevel !== filters.riskLevel
      )
        return false;
      if (
        project.investmentGoal < filters.investmentRange[0] ||
        project.investmentGoal > filters.investmentRange[1]
      )
        return false;
      if (
        project.expectedROI < filters.roiRange[0] ||
        project.expectedROI > filters.roiRange[1]
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "funding_goal":
          return b.investmentGoal - a.investmentGoal;
        case "roi":
          return b.expectedROI - a.expectedROI;
        case "ending_soon":
          return a.daysRemaining - b.daysRemaining;
        case "most_funded":
          return (
            b.currentFunding / b.investmentGoal -
            a.currentFunding / a.investmentGoal
          );
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="AgriVest"
        navLinks={[
          { href: "/projects", label: "Browse Projects", isPrimary: true },
          { href: "/how-it-works", label: "How It Works" },
          { href: "/about", label: "About" },
        ]}
      >
        <Button variant="outline" asChild>
          <Link href="/investor">Investor</Link>
        </Button>
        <Button asChild>
          <Link href="/farmer">Start Farming</Link>
        </Button>
      </Header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Browse Agricultural Projects
          </h1>
          <p className="text-muted-foreground">
            Discover and invest in verified farming projects across India
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <Label htmlFor="search">Search Projects</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by crop, farmer, or location..."
                      value={filters.search}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          search: e.target.value,
                        }))
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Project Type */}
                <div>
                  <Label
                    htmlFor="projectType"
                    className="text-sm font-medium mb-2 block"
                  >
                    Project Type
                  </Label>
                  <Select
                    value={filters.projectType}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, projectType: value }))
                    }
                  >
                    <SelectTrigger id="projectType">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        { value: "all", label: "All Projects" },
                        { value: "short", label: "Short Term" },
                        { value: "long", label: "Long Term" },
                        { value: "variable", label: "Variable Return" },
                        { value: "fixed", label: "Fixed Return" },
                      ].map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div>
                  <Label
                    htmlFor="category"
                    className="text-sm font-medium mb-2 block"
                  >
                    Category
                  </Label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        { value: "all", label: "All Categories" },
                        { value: "Rice", label: "Rice" },
                        { value: "Vegetables", label: "Vegetables" },
                        { value: "Herbs", label: "Herbs" },
                        { value: "Corn", label: "Corn" },
                        { value: "Wheat", label: "Wheat" },
                        { value: "Fruits", label: "Fruits" },
                        { value: "Specialty Crops", label: "Specialty Crops" },
                      ].map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div>
                  <Label
                    htmlFor="region"
                    className="text-sm font-medium mb-2 block"
                  >
                    Location
                  </Label>
                  <Select
                    value={filters.region}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, region: value }))
                    }
                  >
                    <SelectTrigger id="region">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        { value: "all", label: "All Regions" },
                        { value: "North", label: "North India" },
                        { value: "East", label: "East India" },
                        { value: "West", label: "West India" },
                        { value: "South", label: "South India" },
                        { value: "Central", label: "Central India" },
                        { value: "Northeast", label: "Northeast India" },
                      ].map((region) => (
                        <SelectItem key={region.value} value={region.value}>
                          {region.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Investment Range */}
                <div>
                  <Label
                    htmlFor="investmentRange"
                    className="text-sm font-medium mb-2 block"
                  >
                    Investment Goal Range
                  </Label>
                  <Select
                    value={`${filters.investmentRange[0]}-${filters.investmentRange[1]}`}
                    onValueChange={(value) => {
                      const [min, max] = value.split("-").map(Number);
                      setFilters((prev) => ({
                        ...prev,
                        investmentRange: [min, max],
                      }));
                    }}
                  >
                    <SelectTrigger id="investmentRange">
                      <SelectValue placeholder="Select investment range" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        { min: 0, max: 100000, label: "All Ranges" }, // Added "All Ranges" option
                        { min: 0, max: 10000, label: "Under $10,000" },
                        { min: 10000, max: 25000, label: "$10,000 - $25,000" },
                        { min: 25000, max: 50000, label: "$25,000 - $50,000" },
                        {
                          min: 50000,
                          max: 100000,
                          label: "$50,000 - $100,000",
                        },
                        { min: 100000, max: 1000000, label: "Over $100,000" },
                      ].map((range) => (
                        <SelectItem
                          key={`${range.min}-${range.max}`}
                          value={`${range.min}-${range.max}`}
                        >
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Expected ROI */}
                <div>
                  <Label
                    htmlFor="roiRange"
                    className="text-sm font-medium mb-2 block"
                  >
                    Expected ROI
                  </Label>
                  <Select
                    value={`${filters.roiRange[0]}-${filters.roiRange[1]}`}
                    onValueChange={(value) => {
                      const [min, max] = value.split("-").map(Number);
                      setFilters((prev) => ({ ...prev, roiRange: [min, max] }));
                    }}
                  >
                    <SelectTrigger id="roiRange">
                      <SelectValue placeholder="Select ROI range" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        { min: 0, max: 50, label: "All ROIs" }, // Added "All ROIs" option
                        { min: 0, max: 15, label: "Under 15%" },
                        { min: 15, max: 25, label: "15% - 25%" },
                        { min: 25, max: 35, label: "25% - 35%" },
                        { min: 35, max: 50, label: "35% - 50%" },
                        { min: 50, max: 100, label: "Over 50%" },
                      ].map((range) => (
                        <SelectItem
                          key={`${range.min}-${range.max}`}
                          value={`${range.min}-${range.max}`}
                        >
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Risk Level */}
                <div>
                  <Label
                    htmlFor="riskLevel"
                    className="text-sm font-medium mb-2 block"
                  >
                    Risk Level
                  </Label>
                  <Select
                    value={filters.riskLevel}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, riskLevel: value }))
                    }
                  >
                    <SelectTrigger id="riskLevel">
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        { value: "all", label: "All Risk Levels" },
                        { value: "Low", label: "Low Risk" },
                        { value: "Medium", label: "Medium Risk" },
                        { value: "High", label: "High Risk" },
                      ].map((risk) => (
                        <SelectItem key={risk.value} value={risk.value}>
                          {risk.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    setFilters({
                      search: "",
                      projectType: "all",
                      category: "all",
                      region: "all",
                      riskLevel: "all",
                      investmentRange: [0, 100000],
                      roiRange: [0, 50],
                      // certifications: [], // Removed
                      sortBy: "newest",
                    })
                  }
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {filteredProjects.length} projects found
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, sortBy: value }))
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="funding_goal">Highest Goal</SelectItem>
                    <SelectItem value="roi">Highest ROI</SelectItem>
                    <SelectItem value="ending_soon">Ending Soon</SelectItem>
                    <SelectItem value="most_funded">Most Funded</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Projects Grid/List */}
            {filteredProjects.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    No projects found
                  </h3>
                  <p>Try adjusting your filters to see more results</p>
                </div>
              </Card>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-6"
                }
              >
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}

            {/* Load More */}
            {filteredProjects.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Projects
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
