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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Leaf,
  Search,
  Download,
  ExternalLink,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Filter,
  Eye,
} from "lucide-react";

// Mock settlement data
const settlementData = {
  completed: [
    {
      id: "s1",
      projectId: "p1",
      projectTitle: "Organic Jasmine Rice Farm 2024",
      farmerName: "Somchai Jaidee",
      completionDate: "2024-06-15",
      investmentAmount: 500,
      returnAmount: 590,
      roi: 18,
      profit: 90,
      status: "completed",
      verificationDate: "2024-06-18",
      ipfsHash: "QmX7M9CiYXjVkFzxnR3vY2K8pL9mN4oP6qR7sT8uV9wX0yZ",
      txHash: "F45C2B1D8A9E7F3C6D5B4A3C2D1E0F9A8B7C6D5E4F3A2B1C0D9E8F7A6B5C4D3",
    },
    {
      id: "s2",
      projectId: "p2",
      projectTitle: "Hydroponic Tomato Greenhouse",
      farmerName: "Malee Srisuk",
      completionDate: "2024-05-20",
      investmentAmount: 1000,
      returnAmount: 1250,
      roi: 25,
      profit: 250,
      status: "completed",
      verificationDate: "2024-05-22",
      ipfsHash: "QmA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z",
      txHash: "A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0",
    },
    {
      id: "s3",
      projectId: "p3",
      projectTitle: "Medicinal Herb Cultivation Farm",
      farmerName: "Niran Thanakit",
      completionDate: "2024-04-10",
      investmentAmount: 750,
      returnAmount: 1087.5,
      roi: 45,
      profit: 337.5,
      status: "completed",
      verificationDate: "2024-04-12",
      ipfsHash: "QmZ9Y8X7W6V5U4T3S2R1Q0P9O8N7M6L5K4J3H2G1F0E9D8C7B6A5",
      txHash: "Z9Y8X7W6V5U4T3S2R1Q0P9O8N7M6L5K4J3H2G1F0E9D8C7B6A5Z4Y3X2W1",
    },
  ],
  pending: [
    {
      id: "p1",
      projectId: "p4",
      projectTitle: "Sweet Corn Commercial Farm",
      farmerName: "Prasert Kaewmala",
      harvestDate: "2024-07-05",
      investmentAmount: 300,
      expectedReturn: 360,
      expectedRoi: 20,
      expectedProfit: 60,
      status: "verification_pending",
      submissionDate: "2024-07-08",
    },
    {
      id: "p2",
      projectId: "p5",
      projectTitle: "Organic Wheat Production Initiative",
      farmerName: "Wichai Boonmee",
      harvestDate: "2024-07-15",
      investmentAmount: 450,
      expectedReturn: 522,
      expectedRoi: 16,
      expectedProfit: 72,
      status: "harvesting",
      expectedSubmissionDate: "2024-07-20",
    },
  ],
};

function StatusBadge({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Completed
      </Badge>
    );
  } else if (status === "verification_pending") {
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
        <Clock className="w-3 h-3 mr-1" />
        Verification Pending
      </Badge>
    );
  } else if (status === "harvesting") {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
        <Calendar className="w-3 h-3 mr-1" />
        Harvesting
      </Badge>
    );
  }
  return <Badge>{status}</Badge>;
}

export default function InvestorSettlementsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("completed");

  const filteredCompletedSettlements = settlementData.completed.filter(
    (settlement) =>
      settlement.projectTitle
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      settlement.farmerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPendingSettlements = settlementData.pending.filter(
    (settlement) =>
      settlement.projectTitle
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      settlement.farmerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="AgriVest"
        navLinks={[
          { href: "/projects", label: "Browse Projects" },
          { href: "/investor", label: "Investor Dashboard" },
          { href: "/how-it-works", label: "How It Works" },
        ]}
      >
        <Button variant="outline" asChild>
          <Link href="/investor">Back to Dashboard</Link>
        </Button>
      </Header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Settlement Reports</h1>
            <p className="text-muted-foreground">
              Track and verify your investment returns
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by project name or farmer..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="completed">Completed Settlements</TabsTrigger>
            <TabsTrigger value="pending">Pending Settlements</TabsTrigger>
          </TabsList>

          <TabsContent value="completed">
            {filteredCompletedSettlements.length === 0 ? (
              <Card className="text-center p-8">
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No settlements found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm
                        ? "No settlements match your search criteria"
                        : "You don't have any completed settlements yet"}
                    </p>
                    {searchTerm && (
                      <Button
                        variant="outline"
                        onClick={() => setSearchTerm("")}
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredCompletedSettlements.map((settlement) => (
                  <Card key={settlement.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{settlement.projectTitle}</CardTitle>
                          <CardDescription>
                            Farmer: {settlement.farmerName}
                          </CardDescription>
                        </div>
                        <StatusBadge status={settlement.status} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground">
                                Your Investment
                              </div>
                              <div className="text-lg font-bold">
                                ${settlement.investmentAmount} RLUSD
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">
                                Total Return
                              </div>
                              <div className="text-lg font-bold text-green-600">
                                ${settlement.returnAmount} RLUSD
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground">
                                Profit
                              </div>
                              <div className="text-lg font-bold text-green-600">
                                +${settlement.profit} RLUSD
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">
                                ROI
                              </div>
                              <div className="text-lg font-bold text-green-600">
                                +{settlement.roi}%
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground">
                                Completion Date
                              </div>
                              <div className="text-sm">
                                {settlement.completionDate}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">
                                Verification Date
                              </div>
                              <div className="text-sm">
                                {settlement.verificationDate}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-green-800">
                                  Verified Settlement
                                </h4>
                                <p className="text-sm text-green-700">
                                  This settlement has been verified by platform
                                  administrators and the returns have been
                                  distributed to your wallet.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-start"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              View Settlement Report
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-start"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View on XRPL Explorer
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-start"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Document on IPFS
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending">
            {filteredPendingSettlements.length === 0 ? (
              <Card className="text-center p-8">
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12">
                    <Clock className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No pending settlements
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm
                        ? "No pending settlements match your search criteria"
                        : "You don't have any pending settlements at the moment"}
                    </p>
                    {searchTerm && (
                      <Button
                        variant="outline"
                        onClick={() => setSearchTerm("")}
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredPendingSettlements.map((settlement) => (
                  <Card key={settlement.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{settlement.projectTitle}</CardTitle>
                          <CardDescription>
                            Farmer: {settlement.farmerName}
                          </CardDescription>
                        </div>
                        <StatusBadge status={settlement.status} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground">
                                Your Investment
                              </div>
                              <div className="text-lg font-bold">
                                ${settlement.investmentAmount} RLUSD
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">
                                Expected Return
                              </div>
                              <div className="text-lg font-bold text-blue-600">
                                ${settlement.expectedReturn} RLUSD
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground">
                                Expected Profit
                              </div>
                              <div className="text-lg font-bold text-blue-600">
                                +${settlement.expectedProfit} RLUSD
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">
                                Expected ROI
                              </div>
                              <div className="text-lg font-bold text-blue-600">
                                +{settlement.expectedRoi}%
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground">
                                Harvest Date
                              </div>
                              <div className="text-sm">
                                {settlement.harvestDate}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">
                                {settlement.status === "verification_pending"
                                  ? "Submission Date"
                                  : "Expected Submission"}
                              </div>
                              <div className="text-sm">
                                {settlement.submissionDate ||
                                  settlement.expectedSubmissionDate}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          {settlement.status === "verification_pending" ? (
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                  <h4 className="font-medium text-blue-800">
                                    Verification In Progress
                                  </h4>
                                  <p className="text-sm text-blue-700">
                                    The farmer has submitted settlement
                                    documentation which is currently being
                                    verified by platform administrators. You
                                    will be notified when verification is
                                    complete.
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div>
                                  <h4 className="font-medium text-yellow-800">
                                    Awaiting Harvest Completion
                                  </h4>
                                  <p className="text-sm text-yellow-700">
                                    This project is currently in the harvesting
                                    phase. The farmer will submit settlement
                                    documentation after harvest completion.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="flex flex-col gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-start"
                              asChild
                            >
                              <Link href={`/projects/${settlement.projectId}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Project Details
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="justify-start"
                            >
                              <TrendingUp className="w-4 h-4 mr-2" />
                              View Expected Returns
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Settlement History Table */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">Settlement History</h2>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Completion Date</TableHead>
                    <TableHead>Investment</TableHead>
                    <TableHead>Return</TableHead>
                    <TableHead>ROI</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settlementData.completed.map((settlement) => (
                    <TableRow key={settlement.id}>
                      <TableCell>
                        <div className="font-medium">
                          {settlement.projectTitle}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {settlement.farmerName}
                        </div>
                      </TableCell>
                      <TableCell>{settlement.completionDate}</TableCell>
                      <TableCell>${settlement.investmentAmount}</TableCell>
                      <TableCell className="text-green-600">
                        ${settlement.returnAmount}
                      </TableCell>
                      <TableCell className="text-green-600">
                        +{settlement.roi}%
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={settlement.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/investor/settlements/${settlement.id}`}>
                            <Eye className="w-4 h-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {settlementData.pending
                    .filter(
                      (settlement) =>
                        settlement.status === "verification_pending"
                    )
                    .map((settlement) => (
                      <TableRow key={settlement.id}>
                        <TableCell>
                          <div className="font-medium">
                            {settlement.projectTitle}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {settlement.farmerName}
                          </div>
                        </TableCell>
                        <TableCell>{settlement.harvestDate}</TableCell>
                        <TableCell>${settlement.investmentAmount}</TableCell>
                        <TableCell className="text-blue-600">
                          ${settlement.expectedReturn}
                        </TableCell>
                        <TableCell className="text-blue-600">
                          +{settlement.expectedRoi}%
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={settlement.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/projects/${settlement.projectId}`}>
                              <Eye className="w-4 h-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Information Box */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 mb-2">
                About Settlement Verification
              </h4>
              <p className="text-sm text-blue-700">
                All settlements are verified by platform administrators to
                ensure accuracy and transparency. Settlement documentation is
                stored on IPFS and verification records are permanently stored
                on the XRP Ledger, providing an immutable audit trail for all
                transactions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
