"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, MapPin, Calendar, Grid3X3, List, Leaf } from "lucide-react"

// Mock data for all projects with new properties
const allProjects = [
  {
    id: "1",
    title: "Organic Jasmine Rice Farm - Season 2024",
    category: "Rice",
    location: "Chiang Mai, Thailand",
    province: "Chiang Mai",
    region: "North",
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
    description: "Premium organic jasmine rice cultivation with sustainable farming practices",
    createdAt: new Date("2024-01-15"),
    termType: "long", // short, long
    returnType: "variable", // variable, fixed
  },
  {
    id: "2",
    title: "Hydroponic Tomato Greenhouse",
    category: "Vegetables",
    location: "Nonthaburi, Thailand",
    province: "Nonthaburi",
    region: "Central",
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
    description: "Year-round hydroponic tomato production using advanced greenhouse technology",
    createdAt: new Date("2024-02-01"),
    termType: "long",
    returnType: "fixed",
  },
  {
    id: "3",
    title: "Medicinal Herb Cultivation Farm",
    category: "Herbs",
    location: "Chiang Rai, Thailand",
    province: "Chiang Rai",
    region: "North",
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
    description: "High-value medicinal herbs for pharmaceutical and wellness markets",
    createdAt: new Date("2024-01-20"),
    termType: "long",
    returnType: "variable",
  },
  {
    id: "4",
    title: "Sweet Corn Commercial Farm",
    category: "Corn",
    location: "Lopburi, Thailand",
    province: "Lopburi",
    region: "Central",
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
    description: "Large-scale sweet corn production using modern farming techniques",
    createdAt: new Date("2024-02-10"),
    termType: "short",
    returnType: "fixed",
  },
  {
    id: "5",
    title: "Organic Wheat Production Initiative",
    category: "Wheat",
    location: "Saraburi, Thailand",
    province: "Saraburi",
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
    description: "Sustainable wheat farming with organic practices and modern storage",
    createdAt: new Date("2024-01-25"),
    termType: "short",
    returnType: "variable",
  },
  {
    id: "6",
    title: "Premium Coffee Bean Plantation",
    category: "Specialty Crops",
    location: "Doi Chang, Thailand",
    province: "Chiang Mai",
    region: "North",
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
    description: "High-altitude premium coffee beans with direct trade partnerships",
    createdAt: new Date("2024-02-05"),
    termType: "long",
    returnType: "variable",
  },
  {
    id: "7",
    title: "Mushroom Cultivation Facility",
    category: "Vegetables",
    location: "Bangkok, Thailand",
    province: "Bangkok",
    region: "Central",
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
    description: "Controlled environment mushroom production with year-round harvests",
    createdAt: new Date("2024-02-12"),
    termType: "short",
    returnType: "fixed",
  },
  {
    id: "8",
    title: "Dragon Fruit Orchard Expansion",
    category: "Fruits",
    location: "Nakhon Pathom, Thailand",
    province: "Nakhon Pathom",
    region: "Central",
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
    description: "Expanding dragon fruit orchard for domestic and export markets",
    createdAt: new Date("2024-01-30"),
    termType: "long",
    returnType: "fixed",
  },
]

interface ProjectFilters {
  search: string
  projectType: string
  category: string
  region: string
  riskLevel: string
  stage: string
  investmentRange: [number, number]
  roiRange: [number, number]
  certifications: string[]
  sortBy: string
}

function ProjectCard({ project, viewMode }: { project: (typeof allProjects)[0]; viewMode: "grid" | "list" }) {
  const fundingPercentage = (project.currentFunding / project.investmentGoal) * 100
  const investorCount = Math.floor(project.currentFunding / project.minimumInvestment)

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
                    <div className="font-medium text-gray-900">{project.farmer}</div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500 text-sm">★</span>
                      <span className="text-sm text-gray-600">{project.farmerRating}</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-2 text-gray-900">{project.title}</h3>
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
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    {project.category}
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                    {project.termType === "short" ? "Short Term" : "Long Term"}
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                    {project.returnType === "fixed" ? "Fixed Return" : "Variable Return"}
                  </Badge>
                  {project.certifications.slice(0, 2).map((cert) => (
                    <Badge key={cert} variant="outline" className="text-xs border-gray-200 text-gray-600">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 mb-1">{project.expectedROI}%</div>
                <div className="text-sm text-gray-600">Expected ROI</div>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div className="flex-1 mr-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Funding Progress</span>
                  <span className="font-medium text-gray-900">{Math.round(fundingPercentage)}%</span>
                </div>
                <Progress value={fundingPercentage} className="h-2 mb-2 bg-gray-100" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>${project.currentFunding.toLocaleString()} raised</span>
                  <span>{investorCount} investors</span>
                </div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium" asChild>
                <Link href={`/projects/${project.id}`}>View Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
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
              <span className="text-sm text-gray-600">{project.farmerRating}</span>
            </div>
          </div>
        </div>

        {/* Project Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">{project.title}</h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{project.location}</span>
        </div>

        {/* Funding Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Funding Progress</span>
            <span className="font-medium text-gray-900">{Math.round(fundingPercentage)}%</span>
          </div>
          <Progress value={fundingPercentage} className="h-2 bg-gray-100" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>${project.currentFunding.toLocaleString()} raised</span>
            <span>{project.daysRemaining} days left</span>
          </div>
        </div>

        {/* Categories and Certifications */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
            {project.category}
          </Badge>
          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
            {project.termType === "short" ? "Short Term" : "Long Term"}
          </Badge>
          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
            {project.returnType === "fixed" ? "Fixed" : "Variable"}
          </Badge>
        </div>

        {/* Action Button */}
        <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium">
          <Link href={`/projects/${project.id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState<ProjectFilters>({
    search: "",
    projectType: "all",
    category: "all",
    region: "all",
    riskLevel: "all",
    stage: "all",
    investmentRange: [0, 100000],
    roiRange: [0, 50],
    certifications: [],
    sortBy: "newest",
  })

  // Filter and sort projects
  const filteredProjects = allProjects
    .filter((project) => {
      if (
        filters.search &&
        !project.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !project.farmer.toLowerCase().includes(filters.search.toLowerCase()) &&
        !project.category.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false
      }
      if (filters.projectType !== "all") {
        if (filters.projectType === "short" && project.termType !== "short") return false
        if (filters.projectType === "long" && project.termType !== "long") return false
        if (filters.projectType === "variable" && project.returnType !== "variable") return false
        if (filters.projectType === "fixed" && project.returnType !== "fixed") return false
      }
      if (filters.category !== "all" && project.category !== filters.category) return false
      if (filters.region !== "all" && project.region !== filters.region) return false
      if (filters.riskLevel !== "all" && project.riskLevel !== filters.riskLevel) return false
      if (filters.stage !== "all" && project.stage !== filters.stage) return false
      if (project.investmentGoal < filters.investmentRange[0] || project.investmentGoal > filters.investmentRange[1])
        return false
      if (project.expectedROI < filters.roiRange[0] || project.expectedROI > filters.roiRange[1]) return false
      if (
        filters.certifications.length > 0 &&
        !filters.certifications.some((cert) => project.certifications.includes(cert))
      )
        return false
      return true
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime()
        case "funding_goal":
          return b.investmentGoal - a.investmentGoal
        case "roi":
          return b.expectedROI - a.expectedROI
        case "ending_soon":
          return a.daysRemaining - b.daysRemaining
        case "most_funded":
          return b.currentFunding / b.investmentGoal - a.currentFunding / a.investmentGoal
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Leaf className="h-8 w-8 text-green-600" />
                <span className="font-bold text-xl">Agri-Trust</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/projects" className="text-foreground font-medium">
                Browse Projects
              </Link>
              <Link href="/how-it-works" className="text-foreground/80 hover:text-foreground">
                How It Works
              </Link>
              <Link href="/about" className="text-foreground/80 hover:text-foreground">
                About
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/investor">Investor</Link>
              </Button>
              <Button asChild>
                <Link href="/farmer">Start Farming</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Browse Agricultural Projects</h1>
          <p className="text-muted-foreground">Discover and invest in verified farming projects across Thailand</p>
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
                      onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Project Type */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Project Type</Label>
                  <div className="space-y-2">
                    {[
                      { value: "all", label: "All Projects" },
                      { value: "short", label: "Short Term" },
                      { value: "long", label: "Long Term" },
                      { value: "variable", label: "Variable Return" },
                      { value: "fixed", label: "Fixed Return" },
                    ].map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={type.value}
                          checked={filters.projectType === type.value}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters((prev) => ({ ...prev, projectType: type.value }))
                            }
                          }}
                        />
                        <Label htmlFor={type.value} className="text-sm font-normal">
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Category</Label>
                  <div className="space-y-2">
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
                      <div key={category.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.value}
                          checked={filters.category === category.value}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters((prev) => ({ ...prev, category: category.value }))
                            }
                          }}
                        />
                        <Label htmlFor={category.value} className="text-sm font-normal">
                          {category.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Location</Label>
                  <div className="space-y-2">
                    {[
                      { value: "all", label: "All Regions" },
                      { value: "North", label: "North Thailand" },
                      { value: "Northeast", label: "Northeast Thailand" },
                      { value: "Central", label: "Central Thailand" },
                      { value: "South", label: "South Thailand" },
                    ].map((region) => (
                      <div key={region.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`region-${region.value}`}
                          checked={filters.region === region.value}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters((prev) => ({ ...prev, region: region.value }))
                            }
                          }}
                        />
                        <Label htmlFor={`region-${region.value}`} className="text-sm font-normal">
                          {region.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Investment Range */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Investment Goal Range</Label>
                  <div className="space-y-2">
                    {[
                      { min: 0, max: 10000, label: "Under $10,000" },
                      { min: 10000, max: 25000, label: "$10,000 - $25,000" },
                      { min: 25000, max: 50000, label: "$25,000 - $50,000" },
                      { min: 50000, max: 100000, label: "$50,000 - $100,000" },
                      { min: 100000, max: 1000000, label: "Over $100,000" },
                    ].map((range, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`investment-${index}`}
                          checked={filters.investmentRange[0] === range.min && filters.investmentRange[1] === range.max}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters((prev) => ({ ...prev, investmentRange: [range.min, range.max] }))
                            }
                          }}
                        />
                        <Label htmlFor={`investment-${index}`} className="text-sm font-normal">
                          {range.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expected ROI */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Expected ROI</Label>
                  <div className="space-y-2">
                    {[
                      { min: 0, max: 15, label: "Under 15%" },
                      { min: 15, max: 25, label: "15% - 25%" },
                      { min: 25, max: 35, label: "25% - 35%" },
                      { min: 35, max: 50, label: "35% - 50%" },
                      { min: 50, max: 100, label: "Over 50%" },
                    ].map((range, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`roi-${index}`}
                          checked={filters.roiRange[0] === range.min && filters.roiRange[1] === range.max}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters((prev) => ({ ...prev, roiRange: [range.min, range.max] }))
                            }
                          }}
                        />
                        <Label htmlFor={`roi-${index}`} className="text-sm font-normal">
                          {range.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Level */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Risk Level</Label>
                  <div className="space-y-2">
                    {[
                      { value: "all", label: "All Risk Levels" },
                      { value: "Low", label: "Low Risk" },
                      { value: "Medium", label: "Medium Risk" },
                      { value: "High", label: "High Risk" },
                    ].map((risk) => (
                      <div key={risk.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`risk-${risk.value}`}
                          checked={filters.riskLevel === risk.value}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters((prev) => ({ ...prev, riskLevel: risk.value }))
                            }
                          }}
                        />
                        <Label htmlFor={`risk-${risk.value}`} className="text-sm font-normal">
                          {risk.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Status */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Project Status</Label>
                  <div className="space-y-2">
                    {[
                      { value: "all", label: "All Statuses" },
                      { value: "funding", label: "Funding" },
                      { value: "active", label: "Active" },
                      { value: "harvesting", label: "Harvesting" },
                    ].map((status) => (
                      <div key={status.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status.value}`}
                          checked={filters.stage === status.value}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters((prev) => ({ ...prev, stage: status.value }))
                            }
                          }}
                        />
                        <Label htmlFor={`status-${status.value}`} className="text-sm font-normal">
                          {status.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Certifications</Label>
                  <div className="space-y-2">
                    {[
                      "Organic",
                      "Fair Trade",
                      "GAP",
                      "GMP",
                      "Hydroponic",
                      "Medicinal Grade",
                      "Sustainable",
                      "Single Origin",
                    ].map((cert) => (
                      <div key={cert} className="flex items-center space-x-2">
                        <Checkbox
                          id={`cert-${cert}`}
                          checked={filters.certifications.includes(cert)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters((prev) => ({ ...prev, certifications: [...prev.certifications, cert] }))
                            } else {
                              setFilters((prev) => ({
                                ...prev,
                                certifications: prev.certifications.filter((c) => c !== cert),
                              }))
                            }
                          }}
                        />
                        <Label htmlFor={`cert-${cert}`} className="text-sm font-normal">
                          {cert}
                        </Label>
                      </div>
                    ))}
                  </div>
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
                      stage: "all",
                      investmentRange: [0, 100000],
                      roiRange: [0, 50],
                      certifications: [],
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
                <span className="text-sm text-muted-foreground">{filteredProjects.length} projects found</span>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, sortBy: value }))}
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
                  <h3 className="text-lg font-medium mb-2">No projects found</h3>
                  <p>Try adjusting your filters to see more results</p>
                </div>
              </Card>
            ) : (
              <div
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-6"}
              >
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} viewMode={viewMode} />
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
  )
}
