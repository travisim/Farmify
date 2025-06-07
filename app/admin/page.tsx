"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileText,
  Leaf,
  Search,
  Settings,
  TrendingUp,
  Users,
  Zap,
  BarChart3,
  Calendar,
  MessageSquare,
  Shield,
} from "lucide-react"

// Mock admin data
const adminData = {
  overview: {
    pendingVerifications: 12,
    completedSettlements: 156,
    averageVerificationTime: 18, // hours
    platformRevenue: 45600, // RLUSD
    todayVerifications: 8,
    weeklyVolume: 125000, // RLUSD
    successRate: 98.5, // percentage
    averageProjectROI: 22.3, // percentage
  },
  urgentActions: [
    {
      id: "1",
      type: "high_value",
      title: "High-value settlement pending",
      description: "Organic Rice Farm 2024 - $45,000 RLUSD settlement",
      priority: "urgent",
      daysOverdue: 0,
      amount: 45000,
    },
    {
      id: "2",
      type: "overdue",
      title: "Overdue verification",
      description: "Sweet Corn Project - 72 hours overdue",
      priority: "urgent",
      daysOverdue: 3,
      amount: 12500,
    },
    {
      id: "3",
      type: "dispute",
      title: "Disputed settlement",
      description: "Vegetable Garden Project - Investor dispute",
      priority: "high",
      daysOverdue: 1,
      amount: 8500,
    },
    {
      id: "4",
      type: "system",
      title: "System alert",
      description: "IPFS node connectivity issues detected",
      priority: "medium",
      daysOverdue: 0,
      amount: 0,
    },
  ],
  verificationQueue: [
    {
      id: "v1",
      projectTitle: "Organic Jasmine Rice Farm 2024",
      farmerName: "Somchai Jaidee",
      farmerAddress: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
      submissionDate: "2024-03-20T10:30:00Z",
      reportedRevenue: 58500,
      projectValue: 45000,
      priority: "urgent",
      status: "pending",
      daysWaiting: 2,
      documentType: "sales_invoice",
      investorCount: 127,
    },
    {
      id: "v2",
      projectTitle: "Sweet Corn Commercial Farm",
      farmerName: "Niran Patel",
      farmerAddress: "rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w",
      submissionDate: "2024-03-19T14:15:00Z",
      reportedRevenue: 32400,
      projectValue: 25000,
      priority: "urgent",
      status: "pending",
      daysWaiting: 3,
      documentType: "sales_invoice",
      investorCount: 89,
    },
    {
      id: "v3",
      projectTitle: "Hydroponic Tomato Greenhouse",
      farmerName: "Apinya Chen",
      farmerAddress: "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
      submissionDate: "2024-03-21T09:45:00Z",
      reportedRevenue: 67200,
      projectValue: 50000,
      priority: "standard",
      status: "pending",
      daysWaiting: 1,
      documentType: "sales_invoice",
      investorCount: 156,
    },
    {
      id: "v4",
      projectTitle: "Medicinal Herb Cultivation",
      farmerName: "Kamon Srisuk",
      farmerAddress: "rDNXkQXeegUa3t7X9EU8EqMZbb7Z5fuyHy",
      submissionDate: "2024-03-18T16:20:00Z",
      reportedRevenue: 89500,
      projectValue: 65000,
      priority: "expedited",
      status: "in_review",
      daysWaiting: 4,
      documentType: "sales_invoice",
      investorCount: 203,
    },
    {
      id: "v5",
      projectTitle: "Sustainable Vegetable Garden",
      farmerName: "Pranee Wongsa",
      farmerAddress: "rUFzMaizZdK5XaslG8FqQy2oEiBrhBSUxe",
      submissionDate: "2024-03-22T11:10:00Z",
      reportedRevenue: 23800,
      projectValue: 20000,
      priority: "standard",
      status: "pending",
      daysWaiting: 0,
      documentType: "sales_invoice",
      investorCount: 67,
    },
  ],
  completedSettlements: [
    {
      id: "s1",
      projectTitle: "Organic Rice Farm 2023",
      farmerName: "Somchai Jaidee",
      completionDate: "2024-03-15T14:30:00Z",
      verificationTime: 16, // hours
      reportedRevenue: 42500,
      actualRevenue: 42500,
      accuracy: 100,
      investorCount: 134,
      verifiedBy: "admin_001",
    },
    {
      id: "s2",
      projectTitle: "Corn Harvest 2023",
      farmerName: "Niran Patel",
      completionDate: "2024-03-12T09:15:00Z",
      verificationTime: 24, // hours
      reportedRevenue: 28900,
      actualRevenue: 28900,
      accuracy: 100,
      investorCount: 98,
      verifiedBy: "admin_002",
    },
    {
      id: "s3",
      projectTitle: "Herb Garden Project",
      farmerName: "Apinya Chen",
      completionDate: "2024-03-10T16:45:00Z",
      verificationTime: 12, // hours
      reportedRevenue: 15600,
      actualRevenue: 15600,
      accuracy: 100,
      investorCount: 45,
      verifiedBy: "admin_001",
    },
  ],
  platformMetrics: {
    totalProjects: 342,
    activeProjects: 89,
    totalInvestors: 1247,
    totalVolume: 2450000, // RLUSD
    monthlyGrowth: 15.3, // percentage
    averageProjectSize: 28500, // RLUSD
    successfulProjects: 253,
    disputeRate: 0.8, // percentage
  },
  adminTeam: [
    {
      id: "admin_001",
      name: "Sarah Johnson",
      role: "Senior Verification Specialist",
      verificationsToday: 5,
      averageTime: 14, // hours
      accuracy: 99.2, // percentage
      status: "online",
    },
    {
      id: "admin_002",
      name: "Michael Chen",
      role: "Settlement Analyst",
      verificationsToday: 3,
      averageTime: 18, // hours
      accuracy: 98.8, // percentage
      status: "online",
    },
    {
      id: "admin_003",
      name: "Lisa Rodriguez",
      role: "Compliance Officer",
      verificationsToday: 2,
      averageTime: 22, // hours
      accuracy: 99.5, // percentage
      status: "away",
    },
  ],
}

function PriorityBadge({ priority }: { priority: string }) {
  const variants = {
    urgent: "destructive",
    high: "secondary",
    medium: "outline",
    standard: "default",
    expedited: "default",
  } as const

  const colors = {
    urgent: "bg-red-100 text-red-800 border-red-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    standard: "bg-blue-100 text-blue-800 border-blue-200",
    expedited: "bg-green-100 text-green-800 border-green-200",
  } as const

  return (
    <Badge className={colors[priority as keyof typeof colors] || colors.standard}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    in_review: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  } as const

  return (
    <Badge className={colors[status as keyof typeof colors] || colors.pending}>
      {status.replace("_", " ").charAt(0).toUpperCase() + status.replace("_", " ").slice(1)}
    </Badge>
  )
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [queueFilter, setQueueFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredQueue = adminData.verificationQueue.filter((item) => {
    const matchesFilter = queueFilter === "all" || item.priority === queueFilter
    const matchesSearch =
      searchTerm === "" ||
      item.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.farmerName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
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
                <span className="font-bold text-xl">Agri-Trust Admin</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/projects" className="text-foreground/80 hover:text-foreground">
                Browse Projects
              </Link>
              <Link href="/admin" className="text-foreground font-medium">
                Admin Portal
              </Link>
              <Link href="/reports" className="text-foreground/80 hover:text-foreground">
                Reports
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Audit Logs</DropdownMenuItem>
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
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Settlement verification and platform management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Reports
            </Button>
            <Button>
              <Shield className="w-4 h-4 mr-2" />
              System Status
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="verification">Verification Queue</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{adminData.overview.pendingVerifications}</div>
                  <p className="text-xs text-muted-foreground">Awaiting verification</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Settlements</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{adminData.overview.completedSettlements}</div>
                  <p className="text-xs text-muted-foreground">Total processed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Verification Time</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{adminData.overview.averageVerificationTime}h</div>
                  <p className="text-xs text-muted-foreground">Average processing time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${adminData.overview.platformRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Total fees collected</p>
                </CardContent>
              </Card>
            </div>

            {/* Urgent Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Urgent Actions Required
                </CardTitle>
                <CardDescription>High-priority items requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminData.urgentActions.map((action) => (
                    <div
                      key={action.id}
                      className={`p-4 rounded-lg border ${
                        action.priority === "urgent"
                          ? "bg-red-50 border-red-200"
                          : action.priority === "high"
                            ? "bg-orange-50 border-orange-200"
                            : "bg-yellow-50 border-yellow-200"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{action.title}</h4>
                            <PriorityBadge priority={action.priority} />
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {action.daysOverdue > 0 && (
                              <span className="text-red-600 font-medium">{action.daysOverdue} days overdue</span>
                            )}
                            {action.amount > 0 && <span>Value: ${action.amount.toLocaleString()} RLUSD</span>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                          {action.type !== "system" && (
                            <Button size="sm">
                              <Zap className="w-4 h-4 mr-2" />
                              Take Action
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Performance</CardTitle>
                  <CardDescription>Current day verification metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Verifications Completed</span>
                      <span className="text-2xl font-bold text-green-600">{adminData.overview.todayVerifications}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Weekly Volume</span>
                      <span className="text-lg font-bold">${adminData.overview.weeklyVolume.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Success Rate</span>
                      <span className="text-lg font-bold text-green-600">{adminData.overview.successRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Avg Project ROI</span>
                      <span className="text-lg font-bold text-blue-600">{adminData.overview.averageProjectROI}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Admin Team Status</CardTitle>
                  <CardDescription>Current team performance and availability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {adminData.adminTeam.map((admin) => (
                      <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              admin.status === "online" ? "bg-green-500" : "bg-yellow-500"
                            }`}
                          />
                          <div>
                            <div className="font-medium">{admin.name}</div>
                            <div className="text-xs text-muted-foreground">{admin.role}</div>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-medium">{admin.verificationsToday} today</div>
                          <div className="text-muted-foreground">{admin.averageTime}h avg</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Settlement Activity</CardTitle>
                <CardDescription>Latest completed verifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminData.completedSettlements.slice(0, 5).map((settlement) => (
                    <div key={settlement.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{settlement.projectTitle}</div>
                        <div className="text-sm text-muted-foreground">
                          Farmer: {settlement.farmerName} • {settlement.investorCount} investors
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">
                          ${settlement.actualRevenue.toLocaleString()} RLUSD
                        </div>
                        <div className="text-xs text-muted-foreground">Verified in {settlement.verificationTime}h</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification" className="space-y-8">
            {/* Queue Management */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Verification Queue</h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Queue
                </Button>
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Reminders
                </Button>
              </div>
            </div>

            {/* Filters and Search */}
            <Card>
              <CardHeader>
                <CardTitle>Queue Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="search">Search Projects</Label>
                    <div className="relative mt-2">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="search"
                        placeholder="Search by project name, farmer, or amount..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="priority-filter">Filter by Priority</Label>
                    <Select value={queueFilter} onValueChange={setQueueFilter}>
                      <SelectTrigger className="mt-2 w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="expedited">Expedited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Queue Table */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Verifications ({filteredQueue.length})</CardTitle>
                <CardDescription>Settlements awaiting admin verification</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Farmer</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQueue.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.projectTitle}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.investorCount} investors • ${item.projectValue.toLocaleString()} project value
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.farmerName}</div>
                            <div className="text-xs text-muted-foreground font-mono">
                              {item.farmerAddress.slice(0, 8)}...{item.farmerAddress.slice(-8)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{new Date(item.submissionDate).toLocaleDateString()}</div>
                            <div className="text-xs text-muted-foreground">
                              {item.daysWaiting} day{item.daysWaiting !== 1 ? "s" : ""} ago
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">${item.reportedRevenue.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">RLUSD</div>
                        </TableCell>
                        <TableCell>
                          <PriorityBadge priority={item.priority} />
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={item.status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/admin/verify/${item.id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                Review
                              </Link>
                            </Button>
                            {item.status === "pending" && (
                              <Button size="sm">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Verify
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Batch Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Batch Actions</CardTitle>
                <CardDescription>Perform actions on multiple settlements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Selected
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Reminders
                  </Button>
                  <Button variant="outline">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Escalate Issues
                  </Button>
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-8">
            <h2 className="text-2xl font-bold">Settlement Analytics</h2>

            {/* Performance Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{adminData.platformMetrics.totalProjects}</div>
                  <p className="text-xs text-muted-foreground">
                    {adminData.platformMetrics.activeProjects} currently active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Investors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{adminData.platformMetrics.totalInvestors.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Platform participants</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${(adminData.platformMetrics.totalVolume / 1000000).toFixed(1)}M
                  </div>
                  <p className="text-xs text-muted-foreground">RLUSD processed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">+{adminData.platformMetrics.monthlyGrowth}%</div>
                  <p className="text-xs text-muted-foreground">Platform growth rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Verification Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Performance Metrics</CardTitle>
                <CardDescription>Admin team performance and accuracy statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{adminData.overview.successRate}%</div>
                    <div className="text-sm text-muted-foreground">Settlement Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {adminData.overview.averageVerificationTime}h
                    </div>
                    <div className="text-sm text-muted-foreground">Average Verification Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{adminData.platformMetrics.disputeRate}%</div>
                    <div className="text-sm text-muted-foreground">Dispute Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Health */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Health Indicators</CardTitle>
                <CardDescription>Key performance indicators for platform stability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Settlement Success Rate</span>
                    <div className="flex items-center gap-2">
                      <Progress value={adminData.overview.successRate} className="w-32" />
                      <span className="text-sm font-bold">{adminData.overview.successRate}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Average Project Success</span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={
                          (adminData.platformMetrics.successfulProjects / adminData.platformMetrics.totalProjects) * 100
                        }
                        className="w-32"
                      />
                      <span className="text-sm font-bold">
                        {Math.round(
                          (adminData.platformMetrics.successfulProjects / adminData.platformMetrics.totalProjects) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Platform Uptime</span>
                    <div className="flex items-center gap-2">
                      <Progress value={99.8} className="w-32" />
                      <span className="text-sm font-bold">99.8%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">IPFS Availability</span>
                    <div className="flex items-center gap-2">
                      <Progress value={99.9} className="w-32" />
                      <span className="text-sm font-bold">99.9%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Report Generation */}
            <Card>
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
                <CardDescription>Export detailed analytics and compliance reports</CardDescription>
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
                        <SelectItem value="compliance">Compliance Report</SelectItem>
                        <SelectItem value="performance">Performance Report</SelectItem>
                        <SelectItem value="audit">Audit Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Time Period</Label>
                    <Select defaultValue="month">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Last Week</SelectItem>
                        <SelectItem value="month">Last Month</SelectItem>
                        <SelectItem value="quarter">Last Quarter</SelectItem>
                        <SelectItem value="year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Generate PDF Report
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-8">
            <h2 className="text-2xl font-bold">System Management</h2>

            {/* User Management */}
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage farmer and investor accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Shield className="w-6 h-6 mb-2" />
                    Farmer Verification
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Users className="w-6 h-6 mb-2" />
                    Investor Support
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Settings className="w-6 h-6 mb-2" />
                    Admin Roles
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Platform Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure settlement parameters and platform behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="verification-timeout">Verification Timeout (hours)</Label>
                    <Input id="verification-timeout" type="number" defaultValue="48" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="platform-fee">Platform Commission (%)</Label>
                    <Input id="platform-fee" type="number" defaultValue="2.5" step="0.1" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="min-investment">Minimum Investment (RLUSD)</Label>
                    <Input id="min-investment" type="number" defaultValue="100" className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="max-project-size">Maximum Project Size (RLUSD)</Label>
                    <Input id="max-project-size" type="number" defaultValue="100000" className="mt-2" />
                  </div>
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Monitor platform infrastructure and services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">XRPL Network</div>
                        <div className="text-sm text-muted-foreground">Connected to mainnet</div>
                      </div>
                    </div>
                    <Badge variant="default">Operational</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">IPFS Network</div>
                        <div className="text-sm text-muted-foreground">Document storage active</div>
                      </div>
                    </div>
                    <Badge variant="default">Operational</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">Database Cache</div>
                        <div className="text-sm text-muted-foreground">High memory usage detected</div>
                      </div>
                    </div>
                    <Badge variant="secondary">Warning</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">API Services</div>
                        <div className="text-sm text-muted-foreground">All endpoints responding</div>
                      </div>
                    </div>
                    <Badge variant="default">Operational</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Mode */}
            <Card>
              <CardHeader>
                <CardTitle>Maintenance & Updates</CardTitle>
                <CardDescription>System maintenance and update management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Maintenance Mode</div>
                      <div className="text-sm text-muted-foreground">Enable maintenance mode for system updates</div>
                    </div>
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Backup System</div>
                      <div className="text-sm text-muted-foreground">Last backup: 2 hours ago</div>
                    </div>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Create Backup
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">System Logs</div>
                      <div className="text-sm text-muted-foreground">View and export system logs</div>
                    </div>
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      View Logs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
