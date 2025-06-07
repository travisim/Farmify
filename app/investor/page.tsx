"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Leaf,
  TrendingUp,
  DollarSign,
  Bell,
  Filter,
  PieChart,
  Target,
  Clock,
  Eye,
  Star,
  Download,
  RefreshCw,
  Plus,
  Bookmark,
  MapPin,
} from "lucide-react"
import { InvestorPortfolioChart } from "@/components/investor/portfolio-chart"
import { InvestorROIChart } from "@/components/investor/roi-chart"
import { InvestorRiskChart } from "@/components/investor/risk-chart"
import { InvestorGeographicChart } from "@/components/investor/geographic-chart"

// Mock investor data
const investorData = {
  profile: {
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=100&width=100",
    walletAddress: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
    joinedDate: "2023-05-10",
    verified: true,
  },
  portfolioSummary: {
    totalInvested: 15000,
    activeInvestments: 8,
    returnsReceived: 3200,
    portfolioROI: 21.3,
    pendingReturns: 1800,
    totalProjects: 12,
  },
  portfolioDistribution: {
    byCategory: [
      { category: "Rice", percentage: 35, amount: 5250 },
      { category: "Vegetables", percentage: 25, amount: 3750 },
      { category: "Herbs", percentage: 20, amount: 3000 },
      { category: "Fruits", percentage: 15, amount: 2250 },
      { category: "Specialty", percentage: 5, amount: 750 },
    ],
    byRisk: [
      { risk: "Low", percentage: 30, amount: 4500 },
      { risk: "Medium", percentage: 50, amount: 7500 },
      { risk: "High", percentage: 20, amount: 3000 },
    ],
    byRegion: [
      { region: "North", percentage: 40, amount: 6000 },
      { region: "Central", percentage: 35, amount: 5250 },
      { region: "Northeast", percentage: 15, amount: 2250 },
      { region: "South", percentage: 10, amount: 1500 },
    ],
  },
  activeInvestments: [
    {
      id: "1",
      title: "Organic Jasmine Rice Farm - Season 2024",
      category: "Rice",
      location: "Chiang Mai, Thailand",
      farmer: "Somchai Jaidee",
      farmerRating: 4.8,
      investmentAmount: 2500,
      investmentDate: "2024-01-20",
      expectedROI: 18,
      expectedReturn: 2950,
      daysRemaining: 45,
      progress: 65,
      riskLevel: "Medium",
      stage: "Growing",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "2",
      title: "Hydroponic Tomato Greenhouse",
      category: "Vegetables",
      location: "Nonthaburi, Thailand",
      farmer: "Malee Srisuk",
      farmerRating: 4.9,
      investmentAmount: 3000,
      investmentDate: "2024-02-05",
      expectedROI: 25,
      expectedReturn: 3750,
      daysRemaining: 120,
      progress: 40,
      riskLevel: "Low",
      stage: "Planting",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "3",
      title: "Medicinal Herb Cultivation Farm",
      category: "Herbs",
      location: "Chiang Rai, Thailand",
      farmer: "Niran Thanakit",
      farmerRating: 4.7,
      investmentAmount: 2000,
      investmentDate: "2024-01-25",
      expectedROI: 45,
      expectedReturn: 2900,
      daysRemaining: 80,
      progress: 50,
      riskLevel: "High",
      stage: "Growing",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "4",
      title: "Sweet Corn Commercial Farm",
      category: "Corn",
      location: "Lopburi, Thailand",
      farmer: "Prasert Kaewmala",
      farmerRating: 4.6,
      investmentAmount: 1500,
      investmentDate: "2024-02-10",
      expectedROI: 20,
      expectedReturn: 1800,
      daysRemaining: 30,
      progress: 75,
      riskLevel: "Medium",
      stage: "Harvesting",
      image: "/placeholder.svg?height=200&width=300",
    },
  ],
  completedInvestments: [
    {
      id: "c1",
      title: "Organic Rice Farm 2023",
      category: "Rice",
      location: "Chiang Mai, Thailand",
      farmer: "Somchai Jaidee",
      investmentAmount: 2000,
      investmentDate: "2023-01-15",
      completionDate: "2023-07-15",
      projectedROI: 18,
      actualROI: 22,
      returnAmount: 2440,
      profit: 440,
    },
    {
      id: "c2",
      title: "Sustainable Vegetable Garden 2023",
      category: "Vegetables",
      location: "Nonthaburi, Thailand",
      farmer: "Malee Srisuk",
      investmentAmount: 1500,
      investmentDate: "2023-02-20",
      completionDate: "2023-06-20",
      projectedROI: 20,
      actualROI: 19,
      returnAmount: 1785,
      profit: 285,
    },
    {
      id: "c3",
      title: "Herb Cultivation Project 2023",
      category: "Herbs",
      location: "Chiang Rai, Thailand",
      farmer: "Niran Thanakit",
      investmentAmount: 1000,
      investmentDate: "2023-03-10",
      completionDate: "2023-09-10",
      projectedROI: 40,
      actualROI: 42,
      returnAmount: 1420,
      profit: 420,
    },
  ],
  watchlist: [
    {
      id: "w1",
      title: "Premium Coffee Bean Plantation",
      category: "Specialty Crops",
      location: "Doi Chang, Thailand",
      farmer: "Anan Hillside",
      farmerRating: 4.9,
      investmentGoal: 50000,
      currentFunding: 35000,
      minimumInvestment: 250,
      expectedROI: 30,
      daysRemaining: 60,
      riskLevel: "Medium",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "w2",
      title: "Organic Wheat Production Initiative",
      category: "Wheat",
      location: "Saraburi, Thailand",
      farmer: "Wichai Boonmee",
      farmerRating: 4.5,
      investmentGoal: 35000,
      currentFunding: 8000,
      minimumInvestment: 120,
      expectedROI: 16,
      daysRemaining: 90,
      riskLevel: "Medium",
      image: "/placeholder.svg?height=200&width=300",
    },
  ],
  recentActivity: [
    {
      type: "investment",
      message: "You invested $2,500 in Organic Jasmine Rice Farm",
      timestamp: "2024-01-20",
    },
    {
      type: "return",
      message: "Received $1,420 return from Herb Cultivation Project",
      timestamp: "2023-09-10",
    },
    {
      type: "update",
      message: "Hydroponic Tomato Greenhouse reached planting stage",
      timestamp: "2024-02-15",
    },
    {
      type: "milestone",
      message: "Sweet Corn Commercial Farm entered harvesting phase",
      timestamp: "2024-03-01",
    },
  ],
  projectRecommendations: [
    {
      id: "r1",
      title: "Dragon Fruit Orchard Expansion",
      category: "Fruits",
      location: "Nakhon Pathom, Thailand",
      farmer: "Kamon Fruitland",
      farmerRating: 4.8,
      investmentGoal: 40000,
      currentFunding: 28000,
      minimumInvestment: 200,
      expectedROI: 28,
      daysRemaining: 75,
      riskLevel: "Medium",
      matchScore: 92,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "r2",
      title: "Mushroom Cultivation Facility",
      category: "Vegetables",
      location: "Bangkok, Thailand",
      farmer: "Siriporn Mushroom",
      farmerRating: 4.4,
      investmentGoal: 20000,
      currentFunding: 12000,
      minimumInvestment: 80,
      expectedROI: 22,
      daysRemaining: 25,
      riskLevel: "Low",
      matchScore: 87,
      image: "/placeholder.svg?height=200&width=300",
    },
  ],
  marketAnalysis: {
    categoryPerformance: [
      { category: "Rice", averageROI: 19.5, trend: "stable" },
      { category: "Vegetables", averageROI: 22.3, trend: "up" },
      { category: "Herbs", averageROI: 38.7, trend: "up" },
      { category: "Fruits", averageROI: 25.1, trend: "stable" },
      { category: "Specialty Crops", averageROI: 32.6, trend: "up" },
    ],
    seasonalTrends: [
      { season: "Dry (Nov-Feb)", bestCrops: ["Rice", "Vegetables"], averageROI: 21.5 },
      { season: "Hot (Mar-Jun)", bestCrops: ["Fruits", "Herbs"], averageROI: 28.3 },
      { season: "Rainy (Jul-Oct)", bestCrops: ["Rice", "Specialty Crops"], averageROI: 24.7 },
    ],
  },
  projectUpdates: [
    {
      projectId: "1",
      projectTitle: "Organic Jasmine Rice Farm",
      date: "2024-02-15",
      title: "Planting Phase Completed Successfully",
      message:
        "All 15 hectares have been planted with premium organic jasmine rice seeds. Germination rate is excellent at 95%. Weather conditions have been favorable.",
      images: ["/placeholder.svg?height=300&width=400"],
      milestone: "Planting",
    },
    {
      projectId: "2",
      projectTitle: "Hydroponic Tomato Greenhouse",
      date: "2024-03-01",
      title: "First Month Growth Update",
      message:
        "Tomato seedlings are showing healthy growth. Applied organic nutrients and implemented climate control measures. No major issues detected.",
      images: ["/placeholder.svg?height=300&width=400"],
      milestone: "Growing",
    },
    {
      projectId: "4",
      projectTitle: "Sweet Corn Commercial Farm",
      date: "2024-03-05",
      title: "Harvesting Begins",
      message:
        "We've begun harvesting the sweet corn. Initial quality assessment shows excellent results with high sugar content. Market prices remain favorable.",
      images: ["/placeholder.svg?height=300&width=400"],
      milestone: "Harvesting",
    },
  ],
}

function InvestmentCard({ investment }: { investment: (typeof investorData.activeInvestments)[0] }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-white rounded-2xl border-0 shadow-sm">
      <div className="relative">
        <Image
          src={investment.image || "/placeholder.svg"}
          alt={investment.title}
          width={300}
          height={200}
          className="w-full h-40 object-cover"
        />

        {/* Investment Amount Overlay */}
        <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
          Invested: ${investment.investmentAmount.toLocaleString()}
        </div>

        {/* Risk Badge */}
        <div className="absolute top-3 right-3">
          <Badge
            className={`${
              investment.riskLevel === "Low"
                ? "bg-green-100 text-green-800 border-green-200"
                : investment.riskLevel === "Medium"
                  ? "bg-orange-100 text-orange-800 border-orange-200"
                  : "bg-red-100 text-red-800 border-red-200"
            } font-medium`}
            variant="outline"
          >
            {investment.riskLevel} Risk
          </Badge>
        </div>

        {/* ROI Badge */}
        <div className="absolute bottom-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
          {investment.expectedROI}% ROI
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Farmer Info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-medium text-sm">
              {investment.farmer
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{investment.farmer}</div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">{investment.farmerRating}</span>
            </div>
          </div>
        </div>

        {/* Project Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">{investment.title}</h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{investment.location}</span>
        </div>

        {/* Investment Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Expected Return</span>
            <div className="font-semibold text-green-600">${investment.expectedReturn.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-gray-600">Days Remaining</span>
            <div className="font-semibold text-gray-900">{investment.daysRemaining}</div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">{investment.stage}</span>
          </div>
          <Progress value={investment.progress} className="h-2 bg-gray-100" />
          <div className="text-xs text-gray-500 text-center">{investment.progress}% complete</div>
        </div>

        {/* Action Button */}
        <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium">
          <Link href={`/projects/${investment.id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function WatchlistCard({ project }: { project: (typeof investorData.watchlist)[0] }) {
  const fundingPercentage = (project.currentFunding / project.investmentGoal) * 100

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-white rounded-2xl border-0 shadow-sm">
      <div className="relative">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          width={300}
          height={200}
          className="w-full h-40 object-cover"
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
            <span>${project.currentFunding.toLocaleString()}</span>
            <span>{project.daysRemaining} days left</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 rounded-xl">
            <Bookmark className="w-4 h-4" />
          </Button>
          <Button asChild className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium">
            <Link href={`/projects/${project.id}`}>Invest</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function RecommendationCard({ project }: { project: (typeof investorData.projectRecommendations)[0] }) {
  const fundingPercentage = (project.currentFunding / project.investmentGoal) * 100

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-white rounded-2xl border-0 shadow-sm">
      <div className="relative">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          width={300}
          height={200}
          className="w-full h-40 object-cover"
        />

        {/* Match Score Overlay */}
        <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {project.matchScore}% Match
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
            <span>${project.currentFunding.toLocaleString()}</span>
            <span>{project.daysRemaining} days left</span>
          </div>
        </div>

        {/* Action Button */}
        <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium">
          <Link href={`/projects/${project.id}`}>View Details</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default function InvestorDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Agri-Trust"
        navLinks={[
          { href: "/projects", label: "Browse Projects" },
          { href: "/investor", label: "Investor Dashboard", isPrimary: true },
          { href: "/how-it-works", label: "How It Works" },
        ]}
      >
        <Button variant="outline" size="sm">
          <Bell className="w-4 h-4 mr-2" />
          Notifications
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={investorData.profile.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {investorData.profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Wallet</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Investor Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {investorData.profile.name}</p>
          </div>
          <Button asChild>
            <Link href="/projects">
              <Plus className="w-4 h-4 mr-2" />
              Discover Projects
            </Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="finances">Finances</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${investorData.portfolioSummary.totalInvested.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    RLUSD across {investorData.portfolioSummary.activeInvestments} projects
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Returns Received</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${investorData.portfolioSummary.returnsReceived.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">Total returns to date</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Portfolio ROI</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{investorData.portfolioSummary.portfolioROI}%</div>
                  <p className="text-xs text-muted-foreground">Average return on investment</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Returns</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${investorData.portfolioSummary.pendingReturns.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">Expected future returns</p>
                </CardContent>
              </Card>
            </div>

            {/* Portfolio Performance Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Portfolio Performance</CardTitle>
                  <CardDescription>Value over time (RLUSD)</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <InvestorPortfolioChart />
                </CardContent>
              </Card>
            </div>

            {/* Active Investments */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Active Investments</CardTitle>
                  <CardDescription>Your current agricultural investments</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {investorData.activeInvestments.map((investment) => (
                    <InvestmentCard key={investment.id} investment={investment} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Investment by Category</CardTitle>
                  <CardDescription>Distribution across crop types</CardDescription>
                </CardHeader>
                <CardContent className="h-64">
                  <InvestorROIChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Distribution</CardTitle>
                  <CardDescription>Portfolio risk allocation</CardDescription>
                </CardHeader>
                <CardContent className="h-64">
                  <InvestorRiskChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Geographic Diversity</CardTitle>
                  <CardDescription>Investments by region</CardDescription>
                </CardHeader>
                <CardContent className="h-64">
                  <InvestorGeographicChart />
                </CardContent>
              </Card>
            </div>

            {/* Recommendations
            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>Projects that match your investment profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {investorData.projectRecommendations.map((project) => (
                    <RecommendationCard key={project.id} project={project} />
                  ))}
                </div>
              </CardContent>
            </Card> */}

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your investments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investorData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activity.type === "investment"
                            ? "bg-blue-100 text-blue-600"
                            : activity.type === "return"
                              ? "bg-green-100 text-green-600"
                              : activity.type === "update"
                                ? "bg-purple-100 text-purple-600"
                                : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {activity.type === "investment" ? (
                          <DollarSign className="w-4 h-4" />
                        ) : activity.type === "return" ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : activity.type === "update" ? (
                          <RefreshCw className="w-4 h-4" />
                        ) : (
                          <Target className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-8">
            {/* Portfolio Overview */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Investment Portfolio</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Active Investments */}
            <Card>
              <CardHeader>
                <CardTitle>Active Investments</CardTitle>
                <CardDescription>Currently funded agricultural projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {investorData.activeInvestments.map((investment) => (
                    <div key={investment.id} className="border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{investment.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{investment.category}</Badge>
                            <Badge
                              variant={
                                investment.riskLevel === "Low"
                                  ? "default"
                                  : investment.riskLevel === "Medium"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {investment.riskLevel} Risk
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{investment.expectedROI}%</div>
                          <div className="text-sm text-muted-foreground">Expected ROI</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <Label className="text-sm font-medium">Your Investment</Label>
                          <div className="mt-2">
                            <div className="text-xl font-bold">${investment.investmentAmount} RLUSD</div>
                            <div className="text-xs text-muted-foreground">Invested on {investment.investmentDate}</div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Expected Return</Label>
                          <div className="mt-2">
                            <div className="text-xl font-bold text-green-600">${investment.expectedReturn} RLUSD</div>
                            <div className="text-xs text-muted-foreground">
                              Profit: ${investment.expectedReturn - investment.investmentAmount} RLUSD
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Project Progress</Label>
                          <div className="mt-2">
                            <Progress value={investment.progress} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>
                                {investment.stage} ({investment.progress}%)
                              </span>
                              <span>{investment.daysRemaining} days remaining</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end mt-4">
                        <Button asChild size="sm">
                          <Link href={`/projects/${investment.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Investment History */}
            <Card>
              <CardHeader>
                <CardTitle>Investment History</CardTitle>
                <CardDescription>Completed investments and returns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investorData.completedInvestments.map((investment) => (
                    <div key={investment.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{investment.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {investment.investmentDate} to {investment.completionDate}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="default">Completed</Badge>
                          <div className="text-sm text-green-600 mt-1">+{investment.actualROI}% ROI</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Invested:</span> ${investment.investmentAmount} RLUSD
                        </div>
                        <div>
                          <span className="text-muted-foreground">Returned:</span> ${investment.returnAmount} RLUSD
                        </div>
                        <div>
                          <span className="text-muted-foreground">Profit:</span>{" "}
                          <span className="text-green-600">${investment.profit} RLUSD</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Projected ROI:</span> {investment.projectedROI}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Watchlist */}
            <Card>
              <CardHeader>
                <CardTitle>Watchlist</CardTitle>
                <CardDescription>Projects you're monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {investorData.watchlist.map((project) => (
                    <WatchlistCard key={project.id} project={project} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discover" className="space-y-8">
            <h2 className="text-2xl font-bold">Discovery and Analysis</h2>

            {/* Project Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Personalized Recommendations</CardTitle>
                <CardDescription>Projects that match your investment profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {investorData.projectRecommendations.map((project) => (
                    <RecommendationCard key={project.id} project={project} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Market Analysis</CardTitle>
                <CardDescription>Agricultural investment trends and opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Category Performance</h3>
                    <div className="space-y-4">
                      {investorData.marketAnalysis.categoryPerformance.map((category, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-primary rounded-sm"></div>
                            <span>{category.category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{category.averageROI}% Avg. ROI</span>
                            {category.trend === "up" ? (
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            ) : (
                              <div className="w-4 h-4 text-blue-600">—</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Seasonal Trends</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {investorData.marketAnalysis.seasonalTrends.map((season, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{season.season}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-green-600">{season.averageROI}%</div>
                            <div className="text-sm text-muted-foreground">Average ROI</div>
                            <div className="mt-2">
                              <div className="text-sm font-medium">Best Crops:</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {season.bestCrops.map((crop) => (
                                  <Badge key={crop} variant="outline">
                                    {crop}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investment Strategy */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Strategy</CardTitle>
                <CardDescription>Optimize your agricultural portfolio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Risk Tolerance</Label>
                  <div className="mt-4 px-2">
                    <Slider defaultValue={[50]} max={100} step={10} className="w-full" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Conservative</span>
                      <span>Balanced</span>
                      <span>Aggressive</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Investment Horizon</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short Term (1-3 months)</SelectItem>
                        <SelectItem value="medium">Medium Term (3-6 months)</SelectItem>
                        <SelectItem value="long">Long Term (6+ months)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Preferred Categories</Label>
                    <Select defaultValue="all">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="vegetables">Vegetables</SelectItem>
                        <SelectItem value="herbs">Herbs</SelectItem>
                        <SelectItem value="fruits">Fruits</SelectItem>
                        <SelectItem value="specialty">Specialty Crops</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Monthly Investment Budget</Label>
                    <Input type="number" placeholder="RLUSD amount" className="mt-2" defaultValue="1000" />
                  </div>

                  <div>
                    <Label>Auto-Reinvest Returns</Label>
                    <div className="flex items-center gap-2 mt-4">
                      <Switch id="auto-reinvest" />
                      <Label htmlFor="auto-reinvest">Enable automatic reinvestment</Label>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Update Investment Strategy</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="updates" className="space-y-8">
            <h2 className="text-2xl font-bold">Project Updates</h2>

            {/* Project Updates Feed */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Updates</CardTitle>
                <CardDescription>Latest news from your investments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {investorData.projectUpdates.map((update, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{update.title}</CardTitle>
                            <CardDescription>
                              {update.projectTitle} • {update.date}
                            </CardDescription>
                          </div>
                          <Badge variant="outline">{update.milestone}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">{update.message}</p>
                        {update.images && (
                          <div className="grid grid-cols-2 gap-4">
                            {update.images.map((image, idx) => (
                              <Image
                                key={idx}
                                src={image || "/placeholder.svg"}
                                alt={`Update image ${idx + 1}`}
                                width={300}
                                height={200}
                                className="rounded-lg object-cover"
                              />
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Update Preferences</CardTitle>
                <CardDescription>Customize how you receive project updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="milestone-updates" className="font-medium">
                          Milestone Updates
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications when projects reach important milestones
                        </p>
                      </div>
                      <Switch id="milestone-updates" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weekly-updates" className="font-medium">
                          Weekly Updates
                        </Label>
                        <p className="text-sm text-muted-foreground">Receive regular weekly progress updates</p>
                      </div>
                      <Switch id="weekly-updates" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="return-notifications" className="font-medium">
                          Return Distributions
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about return distributions
                        </p>
                      </div>
                      <Switch id="return-notifications" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="risk-alerts" className="font-medium">
                          Risk Alerts
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about potential risks to your investments
                        </p>
                      </div>
                      <Switch id="risk-alerts" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Delivery Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Email Frequency</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="daily">Daily Digest</SelectItem>
                          <SelectItem value="weekly">Weekly Summary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Push Notifications</Label>
                      <Select defaultValue="important">
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Updates</SelectItem>
                          <SelectItem value="important">Important Only</SelectItem>
                          <SelectItem value="none">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finances" className="space-y-8">
            <h2 className="text-2xl font-bold">Financial Management</h2>

            {/* Return Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Return Tracking</CardTitle>
                <CardDescription>Monitor your investment returns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          ${investorData.portfolioSummary.returnsReceived.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">Lifetime returns</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pending Returns</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          ${investorData.portfolioSummary.pendingReturns.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">Expected future returns</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Average ROI</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{investorData.portfolioSummary.portfolioROI}%</div>
                        <p className="text-xs text-muted-foreground">Portfolio average</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Return History</h3>
                    <div className="space-y-4">
                      {investorData.completedInvestments.map((investment) => (
                        <div key={investment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">{investment.title}</div>
                            <div className="text-sm text-muted-foreground">{investment.completionDate}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-green-600">+${investment.profit} RLUSD</div>
                            <div className="text-sm text-muted-foreground">{investment.actualROI}% ROI</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reinvestment Options */}
            <Card>
              <CardHeader>
                <CardTitle>Reinvestment Options</CardTitle>
                <CardDescription>Manage your returns and reinvestment strategy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-reinvest" className="font-medium">
                      Automatic Reinvestment
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically reinvest returns into new projects that match your criteria
                    </p>
                  </div>
                  <Switch id="auto-reinvest" />
                </div>

                <div>
                  <Label>Reinvestment Percentage</Label>
                  <div className="mt-4 px-2">
                    <Slider defaultValue={[75]} max={100} step={5} className="w-full" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    75% of your returns will be automatically reinvested
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Reinvestment Criteria</Label>
                    <Select defaultValue="similar">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="similar">Similar Projects</SelectItem>
                        <SelectItem value="diversify">Diversify Portfolio</SelectItem>
                        <SelectItem value="high-roi">Highest ROI</SelectItem>
                        <SelectItem value="low-risk">Lowest Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Maximum Project Risk</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Risk Only</SelectItem>
                        <SelectItem value="medium">Up to Medium Risk</SelectItem>
                        <SelectItem value="high">Any Risk Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button>Save Reinvestment Settings</Button>
              </CardContent>
            </Card>

            {/* Tax Reporting */}
            <Card>
              <CardHeader>
                <CardTitle>Tax Reporting</CardTitle>
                <CardDescription>Export investment data for tax purposes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Tax Year</Label>
                    <Select defaultValue="2024">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Report Type</Label>
                    <Select defaultValue="all">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Complete Tax Report</SelectItem>
                        <SelectItem value="returns">Returns Only</SelectItem>
                        <SelectItem value="investments">Investments Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
