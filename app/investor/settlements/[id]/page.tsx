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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Leaf, ArrowLeft, CheckCircle, Shield } from "lucide-react";

// Mock settlement report data
const settlementReport = {
  id: "s1",
  projectId: "p1",
  projectTitle: "Organic Jasmine Rice Farm 2024",
  farmerName: "Somchai Jaidee",
  farmerAddress: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
  completionDate: "2024-06-15",
  verificationDate: "2024-06-18",
  investmentDetails: {
    investmentAmount: 500,
    investmentDate: "2024-01-20",
    investmentPercentage: 2.0, // % of total project
    investmentTxHash:
      "F45C2B1D8A9E7F3C6D5B4A3C2D1E0F9A8B7C6D5E4F3A2B1C0D9E8F7A6B5C4D3",
  },
  projectFinancials: {
    totalRevenue: 58500,
    totalCosts: 45000,
    netProfit: 13500,
    profitMargin: 23.1,
  },
  yourReturns: {
    profitShare: 90, // Your share of the profit
    totalReturn: 590, // Principal + profit
    roi: 18,
    annualizedReturn: 36, // Annualized ROI
    returnTxHash:
      "A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0",
  },
  verificationDetails: {
    verifiedBy: "Platform Admin",
    verificationTxHash:
      "Z9Y8X7W6V5U4T3S2R1Q0P9O8N7M6L5K4J3H2G1F0E9D8C7B6A5Z4Y3X2W1",
    documentHash: "sha256:a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
    ipfsHash: "QmX7M9CiYXjVkFzxnR3vY2K8pL9mN4oP6qR7sT8uV9wX0yZ",
    buyerName: "Thai Agricultural Export Co., Ltd.",
    saleDate: "2024-06-10",
    saleAmount: 58500,
  },
  distributionBreakdown: {
    investors: {
      amount: 5400,
      percentage: 40,
    },
    farmer: {
      amount: 5400,
      percentage: 40,
    },
    platform: {
      amount: 2700,
      percentage: 20,
    },
  },
};

export default function SettlementReportPage({
  params,
}: {
  params: { id: string };
}) {
  const [activeTab, setActiveTab] = useState("overview");

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
          <Link href="/investor/settlements">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settlements
          </Link>
        </Button>
      </Header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/investor/settlements">
                <ArrowLeft className="w-4 h-4 mr-2" />
                All Settlements
              </Link>
            </Button>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Settlement Report</h1>
              <p className="text-muted-foreground">
                {settlementReport.projectTitle}
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completed & Verified
            </Badge>
          </div>
        </div>

        {/* Settlement Report Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="verification">Verification</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Financial Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Summary</CardTitle>
                    <CardDescription>
                      Investment and return details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Your Investment
                          </div>
                          <div className="text-2xl font-bold">
                            $
                            {
                              settlementReport.investmentDetails
                                .investmentAmount
                            }{" "}
                            RLUSD
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Total Return
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            ${settlementReport.yourReturns.totalReturn} RLUSD
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Profit
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            +${settlementReport.yourReturns.profitShare} RLUSD
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            ROI
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            +{settlementReport.yourReturns.roi}%
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h3 className="text-lg font-medium mb-3">
                          Investment Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Investment Date:
                            </span>{" "}
                            {settlementReport.investmentDetails.investmentDate}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Project Share:
                            </span>{" "}
                            {
                              settlementReport.investmentDetails
                                .investmentPercentage
                            }
                            % of total project
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Completion Date:
                            </span>{" "}
                            {settlementReport.completionDate}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Verification Date:
                            </span>{" "}
                            {settlementReport.verificationDate}
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h3 className="text-lg font-medium mb-3">
                          Project Financials
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Total Revenue:</span>
                            <span className="font-medium">
                              $
                              {settlementReport.projectFinancials.totalRevenue.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Costs:</span>
                            <span className="font-medium">
                              $
                              {settlementReport.projectFinancials.totalCosts.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between font-bold border-t pt-2">
                            <span>Net Profit:</span>
                            <span className="text-green-600">
                              $
                              {settlementReport.projectFinancials.netProfit.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Profit Margin:</span>
                            <span className="font-medium">
                              {settlementReport.projectFinancials.profitMargin}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h3 className="text-lg font-medium mb-3">
                          Profit Distribution
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>
                              Investor Share (
                              {
                                settlementReport.distributionBreakdown.investors
                                  .percentage
                              }
                              %):
                            </span>
                            <span className="font-medium">
                              $
                              {settlementReport.distributionBreakdown.investors.amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>
                              Farmer Share (
                              {
                                settlementReport.distributionBreakdown.farmer
                                  .percentage
                              }
                              %):
                            </span>
                            <span className="font-medium">
                              $
                              {settlementReport.distributionBreakdown.farmer.amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>
                              Platform Fee (
                              {
                                settlementReport.distributionBreakdown.platform
                                  .percentage
                              }
                              %):
                            </span>
                            <span className="font-medium">
                              $
                              {settlementReport.distributionBreakdown.platform.amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between font-bold border-t pt-2">
                            <span>Your Profit Share:</span>
                            <span className="text-green-600">
                              ${settlementReport.yourReturns.profitShare}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Analysis</CardTitle>
                    <CardDescription>
                      Investment performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">
                          ROI
                        </div>
                        <div className="text-3xl font-bold text-green-600">
                          +{settlementReport.yourReturns.roi}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Total return on investment
                        </div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">
                          Annualized Return
                        </div>
                        <div className="text-3xl font-bold text-green-600">
                          +{settlementReport.yourReturns.annualizedReturn}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Yearly equivalent
                        </div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">
                          Investment Multiple
                        </div>
                        <div className="text-3xl font-bold text-green-600">
                          {(
                            settlementReport.yourReturns.totalReturn /
                            settlementReport.investmentDetails.investmentAmount
                          ).toFixed(2)}
                          x
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Return / Investment
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="verification" className="space-y-6">
                {/* Verification Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Verification Details
                    </CardTitle>
                    <CardDescription>
                      Settlement verification information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-green-800">
                              Verified by Platform Admin
                            </h4>
                            <p className="text-sm text-green-700">
                              This settlement has been verified by platform
                              administrators on{" "}
                              {settlementReport.verificationDate}. All
                              documentation has been validated and the revenue
                              amount has been confirmed.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h3 className="text-lg font-medium mb-3">
                          Document Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Document Type:
                            </span>{" "}
                            Sales Invoice
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Buyer Name:
                            </span>{" "}
                            {settlementReport.verificationDetails.buyerName}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Sale Date:
                            </span>{" "}
                            {settlementReport.verificationDetails.saleDate}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Sale Amount:
                            </span>{" "}
                            $
                            {settlementReport.verificationDetails.saleAmount.toLocaleString()}{" "}
                            RLUSD
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transactions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction Details</CardTitle>
                    <CardDescription>
                      On-chain transaction records
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <div>
                        <Label className="font-medium">
                          Investment Transaction Hash:
                        </Label>
                        <p className="font-mono text-xs bg-muted p-2 rounded mt-1 break-all">
                          {settlementReport.investmentDetails.investmentTxHash}
                        </p>
                        <Button
                          variant="link"
                          size="sm"
                          asChild
                          className="px-0"
                        >
                          <Link
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View on XRPL Explorer
                          </Link>
                        </Button>
                      </div>
                      <div>
                        <Label className="font-medium">
                          Return Distribution Transaction Hash:
                        </Label>
                        <p className="font-mono text-xs bg-muted p-2 rounded mt-1 break-all">
                          {settlementReport.yourReturns.returnTxHash}
                        </p>
                        <Button
                          variant="link"
                          size="sm"
                          asChild
                          className="px-0"
                        >
                          <Link
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View on XRPL Explorer
                          </Link>
                        </Button>
                      </div>
                      <div>
                        <Label className="font-medium">
                          Verification Transaction Hash:
                        </Label>
                        <p className="font-mono text-xs bg-muted p-2 rounded mt-1 break-all">
                          {
                            settlementReport.verificationDetails
                              .verificationTxHash
                          }
                        </p>
                        <Button
                          variant="link"
                          size="sm"
                          asChild
                          className="px-0"
                        >
                          <Link
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View on XRPL Explorer
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Optional, can be added if there's content for it */}
          {/* <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Snapshot</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Details about the project.</p>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </div>
    </div>
  );
}
