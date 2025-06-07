"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Plus,
  TrendingUp,
  DollarSign,
  Bell,
  MessageSquare,
  Camera,
  Settings,
  Star,
  Leaf,
  Target,
  BarChart,
  Download,
  Upload,
  CheckCircle,
  Clock,
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
} from "lucide-react"
import { FarmerRevenueChart } from "@/components/farmer/revenue-chart"
import { FarmerProjectChart } from "@/components/farmer/project-chart"
import { FarmerWeatherChart } from "@/components/farmer/weather-chart"

// Enhanced farmer data with more comprehensive information
const farmerData = {
  profile: {
    name: "Somchai Jaidee",
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4.8,
    experience: 12,
    specialization: "Organic Rice Farming",
    location: "Chiang Mai, Thailand",
    joinedDate: "2022-03-15",
    verified: true,
    farmSize: 25,
    certifications: ["Organic", "Fair Trade", "GAP"],
    languages: ["Thai", "English"],
  },
  stats: {
    activeProjects: 3,
    totalRaised: 125000,
    successRate: 87.5,
    totalInvestors: 450,
    completedProjects: 8,
    averageROI: 22.3,
    totalRevenue: 185000,
    pendingReturns: 12500,
  },
  activeProjects: [
    {
      id: "1",
      title: "Organic Jasmine Rice Farm - Season 2024",
      category: "Rice",
      status: "funding",
      fundingGoal: 25000,
      currentFunding: 18500,
      investorCount: 185,
      daysRemaining: 45,
      stage: "Growing",
      progress: 65,
      image: "/placeholder.svg?height=200&width=300",
      plantingDate: "2024-01-15",
      expectedHarvest: "2024-06-30",
      cropHealth: "Excellent",
      weatherRisk: "Low",
      marketPrice: 1200,
      expectedYield: 45,
    },
    {
      id: "2",
      title: "Sustainable Vegetable Garden",
      category: "Vegetables",
      status: "active",
      fundingGoal: 15000,
      currentFunding: 15000,
      investorCount: 120,
      daysRemaining: 90,
      stage: "Planting",
      progress: 25,
      image: "/placeholder.svg?height=200&width=300",
      plantingDate: "2024-02-01",
      expectedHarvest: "2024-05-01",
      cropHealth: "Good",
      weatherRisk: "Medium",
      marketPrice: 800,
      expectedYield: 30,
    },
    {
      id: "3",
      title: "Herb Cultivation Project",
      category: "Herbs",
      status: "harvesting",
      fundingGoal: 20000,
      currentFunding: 20000,
      investorCount: 95,
      daysRemaining: 15,
      stage: "Harvesting",
      progress: 90,
      image: "/placeholder.svg?height=200&width=300",
      plantingDate: "2023-09-01",
      expectedHarvest: "2024-03-15",
      cropHealth: "Excellent",
      weatherRisk: "Low",
      marketPrice: 2500,
      expectedYield: 12,
    },
  ],
  completedProjects: [
    {
      id: "c1",
      title: "Organic Rice Farm 2023",
      category: "Rice",
      completionDate: "2023-12-15",
      investmentAmount: 30000,
      returnAmount: 36600,
      roi: 22,
      investorCount: 150,
      actualYield: 48,
      projectedYield: 45,
    },
    {
      id: "c2",
      title: "Sustainable Vegetable Garden 2023",
      category: "Vegetables",
      completionDate: "2023-10-20",
      investmentAmount: 20000,
      returnAmount: 23800,
      roi: 19,
      investorCount: 95,
      actualYield: 32,
      projectedYield: 30,
    },
  ],
  notifications: [
    {
      id: "1",
      type: "investment",
      message: "New investment of $500 RLUSD in Organic Rice Farm",
      timestamp: "2 minutes ago",
      unread: true,
    },
    {
      id: "2",
      type: "milestone",
      message: "Herb Cultivation Project reached harvesting stage",
      timestamp: "1 hour ago",
      unread: true,
    },
    {
      id: "3",
      type: "weather_alert",
      message: "Heavy rain expected in your area for next 3 days",
      timestamp: "2 hours ago",
      unread: true,
    },
    {
      id: "4",
      type: "update_reminder",
      message: "Weekly update due for Vegetable Garden project",
      timestamp: "3 hours ago",
      unread: false,
    },
    {
      id: "5",
      type: "message",
      message: "New message from investor about Rice Farm project",
      timestamp: "5 hours ago",
      unread: false,
    },
    {
      id: "6",
      type: "market_price",
      message: "Rice market price increased by 5% this week",
      timestamp: "1 day ago",
      unread: false,
    },
  ],
  recentActivity: [
    {
      type: "investment_received",
      message: "Received $500 investment in Organic Rice Farm",
      timestamp: "2 minutes ago",
    },
    {
      type: "update_posted",
      message: "Posted growth update for Vegetable Garden",
      timestamp: "1 day ago",
    },
    {
      type: "milestone_reached",
      message: "Herb project reached harvesting milestone",
      timestamp: "2 days ago",
    },
    {
      type: "return_distributed",
      message: "Distributed returns for completed Corn project",
      timestamp: "1 week ago",
    },
    {
      type: "weather_monitored",
      message: "Updated weather monitoring for all active projects",
      timestamp: "1 week ago",
    },
  ],
  weatherData: {
    current: {
      temperature: 28,
      humidity: 75,
      rainfall: 2.5,
      windSpeed: 12,
      condition: "Partly Cloudy",
    },
    forecast: [
      { day: "Today", temp: 28, humidity: 75, rainfall: 2.5, condition: "Partly Cloudy" },
      { day: "Tomorrow", temp: 30, humidity: 70, rainfall: 0, condition: "Sunny" },
      { day: "Day 3", temp: 26, humidity: 85, rainfall: 15, condition: "Heavy Rain" },
      { day: "Day 4", temp: 25, humidity: 90, rainfall: 20, condition: "Heavy Rain" },
      { day: "Day 5", temp: 27, humidity: 80, rainfall: 5, condition: "Light Rain" },
    ],
  },
  marketPrices: {
    rice: { current: 1200, change: 5, trend: "up" },
    vegetables: { current: 800, change: -2, trend: "down" },
    herbs: { current: 2500, change: 8, trend: "up" },
    corn: { current: 950, change: 0, trend: "stable" },
    wheat: { current: 1100, change: 3, trend: "up" },
  },
  farmOperations: {
    equipment: [
      { name: "Tractor", status: "Operational", lastMaintenance: "2024-02-01", nextMaintenance: "2024-05-01" },
      {
        name: "Irrigation System",
        status: "Operational",
        lastMaintenance: "2024-01-15",
        nextMaintenance: "2024-04-15",
      },
      {
        name: "Harvester",
        status: "Maintenance Required",
        lastMaintenance: "2023-12-01",
        nextMaintenance: "2024-03-01",
      },
    ],
    laborSchedule: [
      { task: "Planting", workers: 5, date: "2024-03-15", status: "Scheduled" },
      { task: "Fertilizing", workers: 3, date: "2024-03-20", status: "Scheduled" },
      { task: "Harvesting", workers: 8, date: "2024-06-01", status: "Planned" },
    ],
    expenses: {
      seeds: 3000,
      fertilizer: 4000,
      labor: 8000,
      equipment: 5000,
      irrigation: 2500,
      certification: 1500,
      misc: 1000,
    },
  },
  investorCommunication: {
    messages: [
      {
        id: "1",
        from: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
        subject: "Question about Rice Farm irrigation",
        message:
          "Hi Somchai, I noticed in your last update that you mentioned upgrading the irrigation system. Could you provide more details about the improvements and how they will affect the crop yield?",
        timestamp: "2 hours ago",
        projectId: "1",
        status: "unread",
      },
      {
        id: "2",
        from: "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
        subject: "Harvest timeline inquiry",
        message:
          "When do you expect to begin harvesting the herb cultivation project? The timeline shows we're at 90% completion.",
        timestamp: "1 day ago",
        projectId: "3",
        status: "unread",
      },
      {
        id: "3",
        from: "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
        subject: "Weather concerns",
        message:
          "I saw the weather forecast shows heavy rain coming. How will this affect the vegetable garden project?",
        timestamp: "2 days ago",
        projectId: "2",
        status: "replied",
      },
    ],
    updates: [
      {
        id: "1",
        projectId: "1",
        title: "Planting Phase Completed Successfully",
        message:
          "All 15 hectares have been planted with premium organic jasmine rice seeds. Germination rate is excellent at 95%. Weather conditions have been favorable.",
        timestamp: "2024-02-15",
        images: ["/placeholder.svg?height=300&width=400"],
        milestone: "Planting",
      },
      {
        id: "2",
        projectId: "2",
        title: "First Month Growth Update",
        message:
          "Vegetable seedlings are showing healthy growth. Applied organic nutrients and implemented pest control measures. No major issues detected.",
        timestamp: "2024-03-01",
        images: ["/placeholder.svg?height=300&width=400"],
        milestone: "Growing",
      },
    ],
  },
}

function ProjectCard({ project }: { project: (typeof farmerData.activeProjects)[0] }) {
  const fundingPercentage = (project.currentFunding / project.fundingGoal) * 100

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-white rounded-2xl border-0 shadow-sm">
      <div className="relative">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          width={300}
          height={200}
          className="w-full h-32 object-cover"
        />

        {/* Funding Amount Overlay */}
        <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
          ${project.currentFunding.toLocaleString()} raised
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge
            className={`${
              project.status === "funding"
                ? "bg-blue-100 text-blue-800 border-blue-200"
                : project.status === "active"
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-orange-100 text-orange-800 border-orange-200"
            } font-medium`}
            variant="outline"
          >
            {project.status}
          </Badge>
        </div>

        {/* Progress Badge */}
        <div className="absolute bottom-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
          {project.progress}%
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Project Title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight">{project.title}</h3>

        {/* Category */}
        <Badge variant="secondary" className="bg-gray-100 text-gray-700 w-fit">
          {project.category}
        </Badge>

        {/* Health and Risk Status */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Health:</span>
            <div
              className={`font-medium ${
                project.cropHealth === "Excellent"
                  ? "text-green-600"
                  : project.cropHealth === "Good"
                    ? "text-blue-600"
                    : "text-yellow-600"
              }`}
            >
              {project.cropHealth}
            </div>
          </div>
          <div>
            <span className="text-gray-600">Weather Risk:</span>
            <div
              className={`font-medium ${
                project.weatherRisk === "Low"
                  ? "text-green-600"
                  : project.weatherRisk === "Medium"
                    ? "text-yellow-600"
                    : "text-red-600"
              }`}
            >
              {project.weatherRisk}
            </div>
          </div>
        </div>

        {/* Funding Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Funding Progress</span>
            <span className="font-medium text-gray-900">{Math.round(fundingPercentage)}%</span>
          </div>
          <Progress value={fundingPercentage} className="h-2 bg-gray-100" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              ${project.currentFunding.toLocaleString()} / ${project.fundingGoal.toLocaleString()}
            </span>
            <span>{project.investorCount} investors</span>
          </div>
        </div>

        {/* Project Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Project Progress</span>
            <span className="font-medium text-gray-900">{project.stage}</span>
          </div>
          <Progress value={project.progress} className="h-2 bg-gray-100" />
          <div className="text-xs text-gray-500 text-center">{project.progress}% complete</div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-2">
          <div className="text-sm text-gray-600">{project.daysRemaining} days remaining</div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="rounded-xl" asChild>
              <Link href={`/projects/${project.id}`}>View</Link>
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-xl">
              Update
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function FarmerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

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
              <Link href="/projects" className="text-foreground/80 hover:text-foreground">
                Browse Projects
              </Link>
              <Link href="/farmer" className="text-foreground font-medium">
                Farmer Dashboard
              </Link>
              <Link href="/how-it-works" className="text-foreground/80 hover:text-foreground">
                How It Works
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={farmerData.profile.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {farmerData.profile.name
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
                  <DropdownMenuItem>Farm Management</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Farmer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {farmerData.profile.name}</p>
          </div>
          <Button asChild>
            <Link href="/create-project">
              <Plus className="w-4 h-4 mr-2" />
              Create New Project
            </Link>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 max-w-3xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="investors">Investors</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{farmerData.stats.activeProjects}</div>
                  <p className="text-xs text-muted-foreground">Currently running</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${farmerData.stats.totalRaised.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Lifetime funding</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{farmerData.stats.successRate}%</div>
                  <p className="text-xs text-muted-foreground">Project success rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Farmer Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{farmerData.profile.rating}</div>
                  <p className="text-xs text-muted-foreground">Average rating</p>
                </CardContent>
              </Card>
            </div>

            {/* Weather & Market Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CloudRain className="w-5 h-5" />
                    Weather Conditions
                  </CardTitle>
                  <CardDescription>Current weather in {farmerData.profile.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-orange-500" />
                      <div>
                        <div className="font-medium">{farmerData.weatherData.current.temperature}°C</div>
                        <div className="text-xs text-muted-foreground">Temperature</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="font-medium">{farmerData.weatherData.current.humidity}%</div>
                        <div className="text-xs text-muted-foreground">Humidity</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CloudRain className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-medium">{farmerData.weatherData.current.rainfall}mm</div>
                        <div className="text-xs text-muted-foreground">Rainfall</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="font-medium">{farmerData.weatherData.current.windSpeed} km/h</div>
                        <div className="text-xs text-muted-foreground">Wind Speed</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <div className="font-medium">{farmerData.weatherData.current.condition}</div>
                    <div className="text-sm text-muted-foreground">Current conditions</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="w-5 h-5" />
                    Market Prices
                  </CardTitle>
                  <CardDescription>Current market prices (THB per ton)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(farmerData.marketPrices).map(([crop, data]) => (
                      <div key={crop} className="flex items-center justify-between">
                        <div className="capitalize font-medium">{crop}</div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">₿{data.current}</span>
                          <div
                            className={`flex items-center gap-1 text-sm ${
                              data.trend === "up"
                                ? "text-green-600"
                                : data.trend === "down"
                                  ? "text-red-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {data.trend === "up" ? "↗" : data.trend === "down" ? "↘" : "→"}
                            {data.change}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex-col" variant="outline" asChild>
                    <Link href="/create-project">
                      <Plus className="w-6 h-6 mb-2" />
                      Create Project
                    </Link>
                  </Button>
                  <Button className="h-20 flex-col" variant="outline">
                    <Camera className="w-6 h-6 mb-2" />
                    Post Update
                  </Button>
                  <Button className="h-20 flex-col" variant="outline">
                    <DollarSign className="w-6 h-6 mb-2" />
                    Distribute Returns
                  </Button>
                  <Button className="h-20 flex-col" variant="outline">
                    <MessageSquare className="w-6 h-6 mb-2" />
                    Message Investors
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Active Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Active Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {farmerData.activeProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Recent Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {farmerData.notifications.slice(0, 5).map((notification) => (
                    <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? "bg-blue-600" : "bg-gray-300"}`}
                      />
                      <div className="flex-1">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-8">
            {/* Project Management */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Project Management</h2>
              <Button asChild>
                <Link href="/create-project">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Project
                </Link>
              </Button>
            </div>

            {/* Ongoing Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Ongoing Projects</CardTitle>
                <CardDescription>Projects currently in progress or seeking funding</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {farmerData.activeProjects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{project.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{project.category}</Badge>
                            <Badge variant={project.status === "funding" ? "secondary" : "default"}>
                              {project.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Camera className="w-4 h-4 mr-2" />
                            Post Update
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="w-4 h-4 mr-2" />
                            Manage
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                          <Label className="text-sm font-medium">Funding Progress</Label>
                          <div className="mt-2">
                            <Progress value={(project.currentFunding / project.fundingGoal) * 100} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>${project.currentFunding.toLocaleString()}</span>
                              <span>${project.fundingGoal.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Project Progress</Label>
                          <div className="mt-2">
                            <Progress value={project.progress} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>{project.stage}</span>
                              <span>{project.progress}%</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Crop Health</Label>
                          <div className="mt-2">
                            <div
                              className={`text-lg font-bold ${
                                project.cropHealth === "Excellent"
                                  ? "text-green-600"
                                  : project.cropHealth === "Good"
                                    ? "text-blue-600"
                                    : "text-yellow-600"
                              }`}
                            >
                              {project.cropHealth}
                            </div>
                            <div className="text-xs text-muted-foreground">Current status</div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Expected Yield</Label>
                          <div className="mt-2">
                            <div className="text-lg font-bold">{project.expectedYield} tons</div>
                            <div className="text-xs text-muted-foreground">Projected harvest</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Planting Date:</span> {project.plantingDate}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expected Harvest:</span> {project.expectedHarvest}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Market Price:</span> ₿{project.marketPrice}/ton
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Completed Projects - Settlement Flow */}
            <Card>
              <CardHeader>
                <CardTitle>Completed Projects</CardTitle>
                <CardDescription>Projects requiring settlement or already completed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Settlement Required Project */}
                  <div className="p-4 border rounded-lg bg-orange-50 border-orange-ge-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-orange-900">Organic Tomato Greenhouse 2024</h4>
                        <p className="text-sm text-orange-700">Completed • Harvest finished on March 15, 2024</p>
                      </div>
                      <Badge variant="destructive" className="bg-orange-600">
                        🔴 Settlement Required
                      </Badge>
                    </div>

                    <div className="bg-orange-100 p-3 rounded-lg mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span className="font-medium text-orange-900">Action Required</span>
                      </div>
                      <p className="text-sm text-orange-800">
                        Upload sales invoice to complete settlement and distribute returns to investors.
                      </p>
                      <p className="text-xs text-orange-700 mt-1">
                        Deadline: Submit within 30 days of harvest completion (15 days remaining)
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Invested:</span>
                        <div className="font-medium">$45,000 RLUSD</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Investors:</span>
                        <div className="font-medium">127 investors</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expected Revenue:</span>
                        <div className="font-medium">$58,500 RLUSD</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Projected ROI:</span>
                        <div className="font-medium text-green-600">30%</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        <Upload className="w-4 h-4 mr-2" />
                        Submit Revenue Proof
                      </Button>
                      <Button variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message Investors
                      </Button>
                    </div>
                  </div>

                  {/* Verification Pending Project */}
                  <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-blue-900">Sweet Corn Farm 2024</h4>
                        <p className="text-sm text-blue-700">Settlement submitted • Under admin verification</p>
                      </div>
                      <Badge variant="secondary" className="bg-blue-600 text-white">
                        🔍 Verification Pending
                      </Badge>
                    </div>

                    <div className="bg-blue-100 p-3 rounded-lg mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-900">Revenue Proof Submitted</span>
                      </div>
                      <p className="text-sm text-blue-800">
                        Sales invoice uploaded and under admin verification. You'll be notified when verification is
                        complete.
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Submitted: March 20, 2024 • Estimated verification: 24-48 hours
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Reported Revenue:</span>
                        <div className="font-medium">$32,400 RLUSD</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Invested:</span>
                        <div className="font-medium">$25,000 RLUSD</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Net Profit:</span>
                        <div className="font-medium text-green-600">$7,400 RLUSD</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Actual ROI:</span>
                        <div className="font-medium text-green-600">29.6%</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" disabled>
                        <Clock className="w-4 h-4 mr-2" />
                        Awaiting Verification
                      </Button>
                      <Button variant="outline">View Submission</Button>
                    </div>
                  </div>

                  {/* Successfully Completed Projects */}
                  {farmerData.completedProjects.map((project) => (
                    <div key={project.id} className="p-4 border rounded-lg bg-green-50 border-green-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-green-900">{project.title}</h4>
                          <p className="text-sm text-green-700">Completed {project.completionDate}</p>
                        </div>
                        <Badge variant="default" className="bg-green-600">
                          ✅ Settlement Completed
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Raised:</span>
                          <div className="font-medium">${project.investmentAmount.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Returned:</span>
                          <div className="font-medium">${project.returnAmount.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Investors:</span>
                          <div className="font-medium">{project.investorCount}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Yield:</span>
                          <div className="font-medium">
                            {project.actualYield}/{project.projectedYield} tons
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">ROI Delivered:</span>
                          <div className="font-medium text-green-600">+{project.roi}%</div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Settlement Report
                        </Button>
                        <Button variant="outline" size="sm">
                          View on XRPL
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations" className="space-y-8">
            <h2 className="text-2xl font-bold">Farm Operations</h2>

            {/* Weather Monitoring */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudRain className="w-5 h-5" />
                  Weather Monitoring
                </CardTitle>
                <CardDescription>5-day weather forecast for your farm</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 mb-4">
                  <FarmerWeatherChart />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {farmerData.weatherData.forecast.map((day, index) => (
                    <Card key={index}>
                      <CardContent className="p-4 text-center">
                        <div className="font-medium">{day.day}</div>
                        <div className="text-2xl font-bold">{day.temp}°C</div>
                        <div className="text-sm text-muted-foreground">{day.condition}</div>
                        <div className="text-xs text-blue-600">{day.rainfall}mm rain</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Equipment Management */}
            <Card>
              <CardHeader>
                <CardTitle>Equipment Management</CardTitle>
                <CardDescription>Monitor and maintain your farm equipment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {farmerData.farmOperations.equipment.map((equipment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{equipment.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Last maintenance: {equipment.lastMaintenance}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={equipment.status === "Operational" ? "default" : "destructive"}>
                          {equipment.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">Next: {equipment.nextMaintenance}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Labor Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Labor Schedule</CardTitle>
                <CardDescription>Upcoming farm activities and labor requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {farmerData.farmOperations.laborSchedule.map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{task.task}</div>
                        <div className="text-sm text-muted-foreground">{task.workers} workers required</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{task.date}</div>
                        <Badge variant={task.status === "Scheduled" ? "default" : "secondary"}>{task.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Expense Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Expense Tracking</CardTitle>
                <CardDescription>Monitor your farm operational costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(farmerData.farmOperations.expenses).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-primary rounded-sm"></div>
                        <span className="capitalize">{category.replace("_", " ")}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${amount.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Expenses</span>
                    <span className="text-xl font-bold">
                      $
                      {Object.values(farmerData.farmOperations.expenses)
                        .reduce((a, b) => a + b, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investors" className="space-y-8">
            <h2 className="text-2xl font-bold">Investor Communication</h2>

            {/* Update Scheduler */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule Updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="project-select">Select Project</Label>
                    <Select defaultValue="1">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Organic Jasmine Rice Farm</SelectItem>
                        <SelectItem value="2">Sustainable Vegetable Garden</SelectItem>
                        <SelectItem value="3">Herb Cultivation Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="update-type">Update Type</Label>
                    <Select defaultValue="progress">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="progress">Progress Update</SelectItem>
                        <SelectItem value="milestone">Milestone Achievement</SelectItem>
                        <SelectItem value="issue">Issue Report</SelectItem>
                        <SelectItem value="harvest">Harvest Update</SelectItem>
                        <SelectItem value="weather">Weather Impact</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="update-message">Update Message</Label>
                  <Textarea
                    id="update-message"
                    placeholder="Share progress, achievements, or important information with your investors..."
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-4">
                  <Button>
                    <Camera className="w-4 h-4 mr-2" />
                    Add Photos
                  </Button>
                  <Button variant="outline">Schedule Update</Button>
                  <Button>Post Now</Button>
                </div>
              </CardContent>
            </Card>

            {/* Messaging System */}
            <Card>
              <CardHeader>
                <CardTitle>Investor Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {farmerData.investorCommunication.messages.map((message) => (
                    <div key={message.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{message.subject}</div>
                        <div className="flex items-center gap-2">
                          <Badge variant={message.status === "unread" ? "default" : "secondary"}>
                            {message.status}
                          </Badge>
                          <div className="text-sm text-muted-foreground">{message.timestamp}</div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        From: {message.from.slice(0, 8)}...{message.from.slice(-8)}
                      </p>
                      <p className="text-sm mb-3">{message.message}</p>
                      <div className="flex gap-2">
                        <Button size="sm">Reply</Button>
                        <Button size="sm" variant="outline">
                          Mark as Read
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Updates */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Updates Posted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {farmerData.investorCommunication.updates.map((update) => (
                    <div key={update.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{update.title}</div>
                        <Badge variant="outline">{update.milestone}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{update.timestamp}</p>
                      <p className="text-sm">{update.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-8">
            <h2 className="text-2xl font-bold">Analytics & Reports</h2>

            {/* Revenue Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <CardDescription>Track your farming revenue over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <FarmerRevenueChart />
              </CardContent>
            </Card>

            {/* Project Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Project Performance</CardTitle>
                <CardDescription>Compare actual vs projected yields</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <FarmerProjectChart />
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Average ROI Delivered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{farmerData.stats.averageROI}%</div>
                  <p className="text-xs text-muted-foreground">Across all completed projects</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Yield Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">96%</div>
                  <p className="text-xs text-muted-foreground">Actual vs projected yield</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Investor Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{farmerData.profile.rating}/5</div>
                  <p className="text-xs text-muted-foreground">Average investor rating</p>
                </CardContent>
              </Card>
            </div>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Export Reports</CardTitle>
                <CardDescription>Download detailed reports for analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Report Type</Label>
                    <Select defaultValue="financial">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="financial">Financial Report</SelectItem>
                        <SelectItem value="project">Project Performance</SelectItem>
                        <SelectItem value="investor">Investor Communication</SelectItem>
                        <SelectItem value="operations">Farm Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Time Period</Label>
                    <Select defaultValue="year">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Last Month</SelectItem>
                        <SelectItem value="quarter">Last Quarter</SelectItem>
                        <SelectItem value="year">Last Year</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-8">
            <h2 className="text-2xl font-bold">Profile Management</h2>

            {/* Farmer Profile */}
            <Card>
              <CardHeader>
                <CardTitle>Farmer Profile</CardTitle>
                <CardDescription>Manage your public farmer profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={farmerData.profile.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {farmerData.profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Change Photo
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="farmer-name">Full Name</Label>
                    <Input id="farmer-name" defaultValue={farmerData.profile.name} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input id="specialization" defaultValue={farmerData.profile.specialization} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue={farmerData.profile.location} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="farm-size">Farm Size (hectares)</Label>
                    <Input id="farm-size" type="number" defaultValue={farmerData.profile.farmSize} className="mt-2" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell investors about your farming experience and approach..."
                    className="mt-2"
                    defaultValue="Experienced organic farmer with 12 years in sustainable agriculture. Specializing in rice cultivation using traditional and modern techniques."
                  />
                </div>

                <div>
                  <Label>Certifications</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {farmerData.profile.certifications.map((cert) => (
                      <Badge key={cert} variant="secondary">
                        {cert}
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Certification
                    </Button>
                  </div>
                </div>

                <Button>Save Profile</Button>
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
                <CardDescription>Manage your farmer verification and credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">Identity Verification</div>
                      <div className="text-sm text-muted-foreground">Government ID verified</div>
                    </div>
                  </div>
                  <Badge variant="default">Verified</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">Land Ownership</div>
                      <div className="text-sm text-muted-foreground">Property documents verified</div>
                    </div>
                  </div>
                  <Badge variant="default">Verified</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">Farming Experience</div>
                      <div className="text-sm text-muted-foreground">12 years experience verified</div>
                    </div>
                  </div>
                  <Badge variant="default">Verified</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <div>
                      <div className="font-medium">Organic Certification</div>
                      <div className="text-sm text-muted-foreground">Pending renewal</div>
                    </div>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="font-medium">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-updates" className="font-medium">
                      Automatic Updates
                    </Label>
                    <p className="text-sm text-muted-foreground">Automatically post weekly progress updates</p>
                  </div>
                  <Switch id="auto-updates" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="public-profile" className="font-medium">
                      Public Profile
                    </Label>
                    <p className="text-sm text-muted-foreground">Make your profile visible to potential investors</p>
                  </div>
                  <Switch id="public-profile" defaultChecked />
                </div>

                <div>
                  <Label>Preferred Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="th">Thai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
