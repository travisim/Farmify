import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Star,
  Shield,
  Users,
  Clock,
  Target,
  FileText,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Leaf,
} from "lucide-react"

// Mock project data
const projectData = {
  id: "1",
  title: "Organic Jasmine Rice Farm - Season 2024",
  category: "Rice",
  location: "Chiang Mai, Thailand",
  coordinates: "18.5897° N, 98.4276° E",
  farmer: {
    name: "Somchai Jaidee",
    rating: 4.8,
    experience: 12,
    previousProjects: 8,
    successRate: 87.5,
    specialization: "Organic Rice",
    avatar: "/placeholder.svg?height=100&width=100",
    verified: true,
    joinedDate: "2022-03-15",
    description: "Somchai has been growing organic rice for over 12 years and is a certified organic farmer. He leads a small cooperative and is dedicated to sustainable farming practices.",
  },
  financial: {
    investmentGoal: 25000,
    currentFunding: 18500,
    minimumInvestment: 100,
    expectedROI: 18,
    duration: 180,
    daysRemaining: 45,
    investorCount: 185,
  },
  riskAssessment: {
    level: "Medium",
    factors: ["Weather conditions", "Market price fluctuation", "Pest and disease"],
    mitigationStrategies: [
      "Crop insurance coverage",
      "Diversified planting schedule",
      "Organic certification premium",
      "Forward contract agreements",
    ],
  },
  description:
    "Premium organic jasmine rice cultivation in Chiang Mai province using sustainable farming practices. This project focuses on producing high-quality organic jasmine rice for both domestic and export markets, with emphasis on environmental sustainability and fair trade practices.",
  images: [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ],
  certifications: ["Organic", "Fair Trade", "Sustainable Agriculture"],
  timeline: [
    {
      stage: "Land Preparation",
      duration: 14,
      startDate: "2024-01-01",
      endDate: "2024-01-14",
      description: "Soil testing, plowing, leveling, and organic fertilizer application",
      status: "completed",
    },
    {
      stage: "Planting",
      duration: 7,
      startDate: "2024-01-15",
      endDate: "2024-01-21",
      description: "Seed preparation and planting using organic jasmine rice varieties",
      status: "completed",
    },
    {
      stage: "Growing",
      duration: 120,
      startDate: "2024-01-22",
      endDate: "2024-05-21",
      description: "Irrigation, organic fertilization, natural pest control, and crop monitoring",
      status: "in_progress",
    },
    {
      stage: "Harvesting",
      duration: 14,
      startDate: "2024-05-22",
      endDate: "2024-06-05",
      description: "Harvesting and initial processing of rice grains",
      status: "pending",
    },
    {
      stage: "Processing & Sale",
      duration: 25,
      startDate: "2024-06-06",
      endDate: "2024-06-30",
      description: "Milling, packaging, quality certification, and market sales",
      status: "pending",
    },
  ],
  budgetBreakdown: {
    seeds: { amount: 3000, percentage: 12 },
    fertilizer: { amount: 4000, percentage: 16 },
    labor: { amount: 8000, percentage: 32 },
    equipment: { amount: 5000, percentage: 20 },
    irrigation: { amount: 2500, percentage: 10 },
    certification: { amount: 1500, percentage: 6 },
    misc: { amount: 1000, percentage: 4 },
  },
  updates: [
    {
      id: "1",
      date: "2024-02-15",
      title: "Planting Phase Completed Successfully",
      message:
        "All 15 hectares have been planted with premium organic jasmine rice seeds. Germination rate is excellent at 95%. Weather conditions have been favorable.",
      images: ["/placeholder.svg?height=300&width=400"],
      milestone: "Planting",
    },
    {
      id: "2",
      date: "2024-03-01",
      title: "First Month Growth Update",
      message:
        "Rice plants are showing healthy growth. Applied organic fertilizer and implemented natural pest control measures. No major issues detected.",
      images: ["/placeholder.svg?height=300&width=400"],
      milestone: "Growing",
    },
    {
      id: "3",
      date: "2024-03-15",
      title: "Irrigation System Optimization",
      message:
        "Upgraded irrigation system for better water efficiency. This will help maintain optimal moisture levels throughout the growing season.",
      images: ["/placeholder.svg?height=300&width=400"],
      milestone: "Growing",
    },
  ],
  investors: [
    { address: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH", amount: 500, date: "2024-01-20" },
    { address: "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w", amount: 1000, date: "2024-01-22" },
    { address: "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh", amount: 250, date: "2024-01-25" },
  ],
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const fundingPercentage = (projectData.financial.currentFunding / projectData.financial.investmentGoal) * 100

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
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/projects" className="hover:text-foreground">
            Projects
          </Link>
          <span>/</span>
          <span className="text-foreground">{projectData.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {projectData.images.map((image, index) => (
                  <div key={index} className={index === 0 ? "col-span-2 row-span-2" : ""}>
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Project image ${index + 1}`}
                      width={index === 0 ? 600 : 300}
                      height={index === 0 ? 400 : 200}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-sm">
                  {projectData.category}
                </Badge>
                {projectData.certifications.map((cert) => (
                  <Badge key={cert} variant="secondary">
                    {cert}
                  </Badge>
                ))}
                <Badge
                  variant={
                    projectData.riskAssessment.level === "Low"
                      ? "default"
                      : projectData.riskAssessment.level === "Medium"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {projectData.riskAssessment.level} Risk
                </Badge>
              </div>

              <div>
                <h1 className="text-3xl font-bold mb-4">{projectData.title}</h1>
                <div className="flex items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {projectData.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {projectData.financial.daysRemaining} days remaining
                  </div>
                </div>
                <p className="text-lg text-muted-foreground">{projectData.description}</p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-7"> {/* Adjusted grid columns */}
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger> {/* New Timeline Tab */}
                <TabsTrigger value="farmer">Farmer</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="investors">Investors</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Location */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Farm Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <MapPin className="w-12 h-12 mx-auto mb-2" />
                          <p>Interactive Map</p>
                          <p className="text-sm">{projectData.coordinates}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Location:</span> {projectData.location}
                        </div>
                        <div>
                          <span className="font-medium">Coordinates:</span> {projectData.coordinates}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Expected Output */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Expected Output
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-green-600">45</div>
                        <div className="text-sm text-muted-foreground">Tons Expected</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">$1,200</div>
                        <div className="text-sm text-muted-foreground">Price per Ton</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">$54,000</div>
                        <div className="text-sm text-muted-foreground">Total Revenue</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Insurance & FAQ */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Insurance Protection & FAQ
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Insurance Information */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-800 mb-2">Blockchain Insurance Protection</h4>
                            <p className="text-sm text-blue-700">
                              If livestock dies or crops are damaged due to unforeseen events such as floods or
                              droughts, your investment remains protected through insurance coverage. WeGro provides
                              insurance-backed protection based on the project type and associated risks, in partnership
                              with Green Delta Insurance Company. In all cases, WeGro insures the farmer's portion of
                              the investment, helping secure your capital even during unexpected losses.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* FAQ Section */}
                      <div>
                        <h4 className="font-medium mb-4">Frequently Asked Questions</h4>
                        <div className="space-y-4">
                          <div className="border rounded-lg p-4">
                            <h5 className="font-medium mb-2">How does the insurance system work?</h5>
                            <p className="text-sm text-muted-foreground">
                              Our blockchain-based insurance system automatically triggers payouts when predefined
                              conditions are met, such as weather data indicating drought or flood conditions. This
                              ensures quick and transparent claim processing.
                            </p>
                          </div>

                          <div className="border rounded-lg p-4">
                            <h5 className="font-medium mb-2">What percentage of my investment is covered?</h5>
                            <p className="text-sm text-muted-foreground">
                              WeGro insures the farmer's portion of the investment, which typically covers 70-80% of the
                              total project value, providing substantial protection for your capital investment.
                            </p>
                          </div>

                          <div className="border rounded-lg p-4">
                            <h5 className="font-medium mb-2">How quickly are insurance claims processed?</h5>
                            <p className="text-sm text-muted-foreground">
                              Thanks to our blockchain integration and partnership with Green Delta Insurance Company,
                              claims are typically processed within 7-14 days of the triggering event being verified.
                            </p>
                          </div>

                          <div className="border rounded-lg p-4">
                            <h5 className="font-medium mb-2">What events are covered by the insurance?</h5>
                            <p className="text-sm text-muted-foreground">
                              Coverage includes natural disasters (floods, droughts, storms), disease outbreaks in
                              livestock, crop failures due to weather conditions, and other unforeseen events specific
                              to the project type.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* New Timeline Tab Content */}
              <TabsContent value="timeline" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-6 h-6" />
                      Project Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative pl-6">


                      {projectData.timeline.map((item, index) => (
                        <div key={index} className="relative mb-8 last:mb-0">
                          {/* Icon and Vertical Line */}
                          <div className="absolute -left-[0.6rem] top-0 flex flex-col items-center h-full">
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 shrink-0 ${
                                item.status === "completed"
                                  ? "bg-green-500 border-green-500"
                                  : "bg-background border-gray-300 dark:border-gray-700"
                              }`}
                            >
                              {item.status === "completed" ? (
                                <CheckCircle className="w-5 h-5 text-white" />
                              ) : (
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  {index + 1}
                                </span>
                              )}
                            </div>
                            {/* Vertical line, extending from the icon */}
                            {index < projectData.timeline.length - 1 && (
                              <div
                                className={`w-0.5 flex-grow ${
                                  item.status === "completed" ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700"
                                }`}
                              />
                            )}
                          </div>
                          <div className="ml-10 pt-1"> {/* Added pt-1 to align text with icon center better */}
                            <div className="flex items-center mb-1">
                              <h4 className="font-semibold text-lg mr-2">{item.stage}</h4>
                              <Badge
                                variant={item.status === "completed" ? "default" : "outline"}
                                className={`${
                                  item.status === "completed"
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : "bg-gray-100 text-gray-600 border-gray-200"
                                } text-xs`}
                              >
                                {item.status === "completed"
                                  ? "Completed"
                                  : item.status === "in_progress"
                                    ? "In Progress"
                                    : "Pending"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{item.description}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5 mr-1.5" />
                              {/* Displaying only start date as per image */}
                              <span>{new Date(item.startDate).toLocaleDateString()}</span>
                              {/* Original date display: {item.startDate} - {item.endDate} ({item.duration} days) */}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="farmer" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About the Farmer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-6">
                      <Avatar className="w-24 h-24"> {/* Increased avatar size slightly */}
                        <AvatarImage src={projectData.farmer.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {projectData.farmer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <h3 className="text-2xl font-semibold">{projectData.farmer.name}</h3>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="font-semibold">{projectData.farmer.rating}</span>
                          </div>
                          {projectData.farmer.verified && (
                            <Badge variant="default" className="bg-green-100 text-green-700 border-green-200 ml-2">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            <span>{projectData.farmer.experience} years experience</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Target className="w-4 h-4" />
                            <span>{projectData.farmer.previousProjects} projects completed</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          {projectData.farmer.description || "No description available."}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* <Card>
                  <CardHeader>
                    <CardTitle>Previous Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium">Organic Rice Farm 2023</h4>
                        <p className="text-sm text-muted-foreground">Achieved 22% ROI, completed on time</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="default">Completed</Badge>
                          <span className="text-sm text-green-600">+22% ROI</span>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium">Sustainable Rice Cultivation 2022</h4>
                        <p className="text-sm text-muted-foreground">
                          Achieved 19% ROI, organic certification obtained
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="default">Completed</Badge>
                          <span className="text-sm text-green-600">+19% ROI</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card> */}
              </TabsContent>

              <TabsContent value="financials" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Revenue Projections
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Yield Estimate</Label>
                        <p className="text-lg font-medium">2,500 lbs per hectare</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Market Price</Label>
                        <p className="text-lg font-medium">$6.50 per lb (Fair Trade Organic)</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Revenue Projection</Label>
                        <p className="text-lg font-medium text-green-600">$22,500</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Profit Margin</Label>
                        <p className="text-lg font-medium text-green-600">35%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Cost Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Seeds & Materials</span>
                      <span className="font-medium">$2,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Labor</span>
                      <span className="font-medium">$8,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Equipment</span>
                      <span className="font-medium">$3,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Other Costs</span>
                      <span className="font-medium">$2,000</span>
                    </div>
                    <div className="border-t my-3"></div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Costs</span>
                      <span className="font-semibold text-lg">$15,000</span>
                    </div>
                  </CardContent>
                </Card>

          

                {/* <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Risk Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Risk Factors</h4>
                        <ul className="space-y-1">
                          {projectData.riskAssessment.factors.map((factor, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                              <AlertTriangle className="w-3 h-3" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Mitigation Strategies</h4>
                        <ul className="space-y-1">
                          {projectData.riskAssessment.mitigationStrategies.map((strategy, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                              <Shield className="w-3 h-3" />
                              {strategy}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card> */}
              </TabsContent>

              <TabsContent value="updates" className="space-y-6">
                {projectData.updates.map((update) => (
                  <Card key={update.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{update.title}</CardTitle>
                          <div className="text-sm text-muted-foreground">{update.date}</div>
                        </div>
                        <Badge variant="outline">{update.milestone}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{update.message}</p>
                      {update.images && (
                        <div className="grid grid-cols-2 gap-4">
                          {update.images.map((image, index) => (
                            <Image
                              key={index}
                              src={image || "/placeholder.svg"}
                              alt={`Update image ${index + 1}`}
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
              </TabsContent>

              <TabsContent value="investors" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Investment History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {projectData.investors.map((investor, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <div className="font-mono text-sm">
                              {investor.address.slice(0, 8)}...{investor.address.slice(-8)}
                            </div>
                            <div className="text-xs text-muted-foreground">{investor.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${investor.amount} RLUSD</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Project Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Business Plan</div>
                            <div className="text-sm text-muted-foreground">Detailed project business plan</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Land Ownership Certificate</div>
                            <div className="text-sm text-muted-foreground">Verified land ownership documents</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">Organic Certification</div>
                            <div className="text-sm text-muted-foreground">Organic farming certification</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Investment Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Investment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Funding Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Funding Progress</span>
                    <span className="font-medium">
                      ${projectData.financial.currentFunding.toLocaleString()} / $
                      {projectData.financial.investmentGoal.toLocaleString()} RLUSD
                    </span>
                  </div>
                  <Progress value={fundingPercentage} className="h-3 mb-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{Math.round(fundingPercentage)}% funded</span>
                    <span>{projectData.financial.investorCount} investors</span>
                  </div>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-xl font-bold text-green-600">{projectData.financial.expectedROI}%</div>
                    <div className="text-xs text-muted-foreground">Expected ROI</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{projectData.financial.daysRemaining}</div>
                    <div className="text-xs text-muted-foreground">Days Left</div>
                  </div>
                </div>

                {/* Investment Calculator */}
                <div className="space-y-4">
                  <Label htmlFor="investment-amount">Investment Amount (RLUSD)</Label>
                  <Input
                    id="investment-amount"
                    type="number"
                    placeholder={`Min: $${projectData.financial.minimumInvestment}`}
                    min={projectData.financial.minimumInvestment}
                  />

                </div>

              

                {/* Investment Button */}
                <Button className="w-full" size="lg">
                  Invest Now
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  By investing, you agree to our terms and risk disclosure
                </div>
              </CardContent>
            </Card>

            {/* Farmer Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Contact Farmer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={projectData.farmer.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {projectData.farmer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{projectData.farmer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      <Star className="w-3 h-3 inline fill-yellow-400 text-yellow-400 mr-1" />
                      {projectData.farmer.rating} rating
                    </div>
                  </div>
                </div>
                <Textarea placeholder="Ask a question about this project..." />
                <Button className="w-full" variant="outline">
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
