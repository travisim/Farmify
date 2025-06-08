import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Users,
  Target,
  Award,
  MapPin,
  DollarSign,
  Leaf,
  Wheat,
  Sprout,
} from "lucide-react";
import Header from "@/components/header";

// Mock data for featured projects
const featuredProjects = [
  {
    id: "1",
    title: "Organic Jasmine Rice Farm - Season 2024",
    category: "Rice",
    location: "Chiang Mai, Thailand",
    farmer: "Somchai Jaidee",
    farmerRating: 4.8,
    investmentGoal: 25000,
    currentFunding: 18500,
    minimumInvestment: 100,
    expectedROI: 18,
    duration: 180,
    daysRemaining: 45,
    riskLevel: "Medium",
    image: "/placeholder.svg?height=200&width=300",
    certifications: ["Organic", "Fair Trade"],
    description:
      "Premium organic jasmine rice cultivation with sustainable farming practices",
  },
  {
    id: "2",
    title: "Hydroponic Tomato Greenhouse",
    category: "Vegetables",
    location: "Nonthaburi, Thailand",
    farmer: "Malee Srisuk",
    farmerRating: 4.9,
    investmentGoal: 45000,
    currentFunding: 32000,
    minimumInvestment: 200,
    expectedROI: 25,
    duration: 365,
    daysRemaining: 120,
    riskLevel: "Low",
    image: "/placeholder.svg?height=200&width=300",
    certifications: ["GAP", "Hydroponic"],
    description:
      "Year-round hydroponic tomato production using advanced greenhouse technology",
  },
  {
    id: "3",
    title: "Medicinal Herb Cultivation Farm",
    category: "Herbs",
    location: "Chiang Rai, Thailand",
    farmer: "Niran Thanakit",
    farmerRating: 4.7,
    investmentGoal: 28000,
    currentFunding: 15000,
    minimumInvestment: 150,
    expectedROI: 45,
    duration: 200,
    daysRemaining: 80,
    riskLevel: "High",
    image: "/placeholder.svg?height=200&width=300",
    certifications: ["Organic", "Medicinal Grade"],
    description:
      "High-value medicinal herbs for pharmaceutical and wellness markets",
  },
  {
    id: "4",
    title: "Sweet Corn Commercial Farm",
    category: "Corn",
    location: "Lopburi, Thailand",
    farmer: "Prasert Kaewmala",
    farmerRating: 4.6,
    investmentGoal: 30000,
    currentFunding: 22000,
    minimumInvestment: 100,
    expectedROI: 20,
    duration: 120,
    daysRemaining: 30,
    riskLevel: "Medium",
    image: "/placeholder.svg?height=200&width=300",
    certifications: ["GMP", "Global GAP"],
    description:
      "Large-scale sweet corn production using modern farming techniques",
  },
  {
    id: "5",
    title: "Organic Wheat Production Initiative",
    category: "Wheat",
    location: "Saraburi, Thailand",
    farmer: "Wichai Boonmee",
    farmerRating: 4.5,
    investmentGoal: 35000,
    currentFunding: 8000,
    minimumInvestment: 120,
    expectedROI: 16,
    duration: 150,
    daysRemaining: 90,
    riskLevel: "Medium",
    image: "/placeholder.svg?height=200&width=300",
    certifications: ["Organic", "Sustainable"],
    description:
      "Sustainable wheat farming with organic practices and modern storage",
  },
  {
    id: "6",
    title: "Premium Coffee Bean Plantation",
    category: "Specialty Crops",
    location: "Doi Chang, Thailand",
    farmer: "Anan Hillside",
    farmerRating: 4.9,
    investmentGoal: 50000,
    currentFunding: 35000,
    minimumInvestment: 250,
    expectedROI: 30,
    duration: 300,
    daysRemaining: 60,
    riskLevel: "Medium",
    image: "/placeholder.svg?height=200&width=300",
    certifications: ["Organic", "Single Origin"],
    description:
      "High-altitude premium coffee beans with direct trade partnerships",
  },
];

// Mock platform statistics
const platformStats = {
  totalInvestments: 2500000,
  activeProjects: 156,
  successfulHarvests: 89,
  averageROI: 22.5,
  totalInvestors: 1250,
  totalFarmers: 340,
};

// Recent activity mock data
const recentActivity = [
  {
    type: "investment",
    message: "New investment of $500 RLUSD in Organic Rice Farm",
    timestamp: "2 minutes ago",
    icon: DollarSign,
  },
  {
    type: "harvest",
    message: "Tomato Greenhouse Project completed harvest - 95% yield achieved",
    timestamp: "1 hour ago",
    icon: Award,
  },
  {
    type: "new_project",
    message: "New herb cultivation project launched in Chiang Mai",
    timestamp: "3 hours ago",
    icon: Sprout,
  },
  {
    type: "return_distribution",
    message: "Returns distributed to investors - Corn Farm Project",
    timestamp: "5 hours ago",
    icon: TrendingUp,
  },
];

function ProjectCard({ project }: { project: (typeof featuredProjects)[0] }) {
  const fundingPercentage =
    (project.currentFunding / project.investmentGoal) * 100;
  const investorCount = Math.floor(
    project.currentFunding / project.minimumInvestment
  );

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

        {/* Investment Amount Overlay */}
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

        {/* Categories and Certifications */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="secondary"
            className="bg-gray-100 text-gray-700 text-xs"
          >
            {project.category}
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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header
        title="AgriVest"
        navLinks={[
          { href: "/projects", label: "Browse Projects" },
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

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Invest in Agricultural
            <span className="text-green-600 block">Innovation</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Fund farming projects directly on XRPL with RLUSD for stable,
            transparent investments. Support sustainable agriculture while
            earning competitive returns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/projects">Browse Projects</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/create-project">Start Farming</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                ${(platformStats.totalInvestments / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-muted-foreground">
                Total Investments
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {platformStats.activeProjects}
              </div>
              <div className="text-sm text-muted-foreground">
                Active Projects
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {platformStats.successfulHarvests}
              </div>
              <div className="text-sm text-muted-foreground">
                Successful Harvests
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {platformStats.averageROI}%
              </div>
              <div className="text-sm text-muted-foreground">Average ROI</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {platformStats.totalInvestors.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Investors
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">
                {platformStats.totalFarmers}
              </div>
              <div className="text-sm text-muted-foreground">Total Farmers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover high-potential agricultural projects from verified
              farmers across Thailand
            </p>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="grid w-full grid-cols-6 max-w-2xl mx-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="grains">Grains</TabsTrigger>
              <TabsTrigger value="vegetables">Vegetables</TabsTrigger>
              <TabsTrigger value="herbs">Herbs</TabsTrigger>
              <TabsTrigger value="specialty">Specialty</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="grains" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProjects
                  .filter((p) => ["Rice", "Wheat", "Corn"].includes(p.category))
                  .map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="vegetables" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProjects
                  .filter((p) => p.category === "Vegetables")
                  .map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="herbs" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProjects
                  .filter((p) => p.category === "Herbs")
                  .map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="specialty" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProjects
                  .filter((p) => p.category === "Specialty Crops")
                  .map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="trending" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProjects.slice(0, 3).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/projects">View All Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent, and secure agricultural investment on the XRP
              Ledger
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Connect Wallet</h3>
              <p className="text-sm text-muted-foreground">
                Connect your XRPL wallet to get started
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Browse Projects</h3>
              <p className="text-sm text-muted-foreground">
                Explore verified farming projects
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Invest RLUSD</h3>
              <p className="text-sm text-muted-foreground">
                Invest with stable RLUSD currency
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wheat className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your investments transparently
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold mb-2">Receive Returns</h3>
              <p className="text-sm text-muted-foreground">
                Get returns in RLUSD after harvest
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Recent Activity</h2>
            <p className="text-muted-foreground">
              Live updates from the AgriVest platform
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Platform Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <activity.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Agricultural Investment Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of investors supporting sustainable agriculture while
            earning competitive returns
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/projects">Start Investing</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-green-600"
              asChild
            >
              <Link href="/create-project">Become a Farmer</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-6 w-6 text-green-600" />
                <span className="font-bold text-lg">AgriVest</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting investors with sustainable agricultural projects on
                the XRP Ledger
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/projects" className="hover:text-foreground">
                    Browse Projects
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-foreground">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/fees" className="hover:text-foreground">
                    Fees
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-foreground">
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-foreground">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-foreground">
                    Community
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/terms" className="hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/risk" className="hover:text-foreground">
                    Risk Disclosure
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; 2024 AgriVest. All rights reserved. Built on XRP Ledger.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
