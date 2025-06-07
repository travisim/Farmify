"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  FileText,
  ExternalLink,
  Download,
  Eye,
  AlertTriangle,
  Leaf,
} from "lucide-react"

// Mock verification data
const verificationData = {
  id: "v1",
  projectTitle: "Organic Jasmine Rice Farm 2024",
  farmerName: "Somchai Jaidee",
  farmerAddress: "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
  submissionDate: "2024-03-20T10:30:00Z",
  reportedRevenue: 58500,
  projectValue: 45000,
  investorCount: 127,
  documentType: "sales_invoice",
  documentUrl: "/placeholder.svg?height=800&width=600",
  ipfsHash: "QmX7M9CiYXjVkFzxnR3vY2K8pL9mN4oP6qR7sT8uV9wX0yZ",
  documentHash: "sha256:a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
  extractedData: {
    buyerName: "Thai Agricultural Export Co., Ltd.",
    saleDate: "2024-03-15",
    totalAmount: 58500,
    documentType: "Commercial Invoice",
    currency: "RLUSD",
  },
  projectDetails: {
    originalGoal: 45000,
    totalInvested: 45000,
    expectedYield: 45,
    actualYield: 48,
    plantingDate: "2024-01-15",
    harvestDate: "2024-03-15",
    location: "Chiang Mai, Thailand",
    cropType: "Organic Jasmine Rice",
  },
  profitDistribution: {
    totalRevenue: 58500,
    totalCosts: 45000,
    netProfit: 13500,
    investorShare: 5400, // 40% of profit
    farmerShare: 5400, // 40% of profit
    platformFee: 2700, // 20% of profit
  },
}

export default function VerificationPage({ params }: { params: { id: string } }) {
  const [verificationChecklist, setVerificationChecklist] = useState({
    documentAuthentic: false,
    amountsMatch: false,
    dateValid: false,
    buyerComplete: false,
    qualitySufficient: false,
  })
  const [verificationNotes, setVerificationNotes] = useState("")
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)

  const allChecksComplete = Object.values(verificationChecklist).every(Boolean)
  const amountsMatch = verificationData.reportedRevenue === verificationData.extractedData.totalAmount

  return (
    <div className="min-h-screen bg-background">
      <Header title="Agri-Trust Admin">
        <Button variant="outline" asChild>
          <Link href="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </Header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Queue
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold mb-2">Settlement Verification</h1>
          <p className="text-muted-foreground">Review and verify settlement documentation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Document Viewer */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Submitted Invoice
                </CardTitle>
                <CardDescription>Sales documentation provided by farmer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Document Preview */}
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <div className="aspect-[3/4] bg-white rounded border flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">Invoice Document Preview</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {verificationData.documentType.replace("_", " ").toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Document Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Full View
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      IPFS
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Extracted Data */}
            <Card>
              <CardHeader>
                <CardTitle>Extracted Document Data</CardTitle>
                <CardDescription>Automatically parsed information from the document</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Buyer Name:</span>
                    <span className="text-sm">{verificationData.extractedData.buyerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Sale Date:</span>
                    <span className="text-sm">{verificationData.extractedData.saleDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Document Type:</span>
                    <span className="text-sm">{verificationData.extractedData.documentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Currency:</span>
                    <span className="text-sm">{verificationData.extractedData.currency}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">Extracted Amount:</span>
                    <span className="text-lg font-bold">
                      ${verificationData.extractedData.totalAmount.toLocaleString()} RLUSD
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Document Security */}
            <Card>
              <CardHeader>
                <CardTitle>Document Security</CardTitle>
                <CardDescription>Cryptographic verification and storage details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <Label className="font-medium">IPFS Hash:</Label>
                    <p className="font-mono text-xs bg-muted p-2 rounded mt-1 break-all">{verificationData.ipfsHash}</p>
                  </div>
                  <div>
                    <Label className="font-medium">Document Hash:</Label>
                    <p className="font-mono text-xs bg-muted p-2 rounded mt-1 break-all">
                      {verificationData.documentHash}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">Document integrity verified</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Verification Details */}
          <div className="space-y-6">
            {/* Submission Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Submission Summary</CardTitle>
                <CardDescription>Project and farmer information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-lg">{verificationData.projectTitle}</h4>
                    <p className="text-sm text-muted-foreground">
                      Submitted by {verificationData.farmerName} on{" "}
                      {new Date(verificationData.submissionDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="font-medium">Farmer Address:</Label>
                      <p className="font-mono text-xs mt-1">
                        {verificationData.farmerAddress.slice(0, 12)}...{verificationData.farmerAddress.slice(-12)}
                      </p>
                    </div>
                    <div>
                      <Label className="font-medium">Investor Count:</Label>
                      <p className="mt-1">{verificationData.investorCount} investors</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="font-medium">Project Value:</Label>
                      <p className="mt-1">${verificationData.projectValue.toLocaleString()} RLUSD</p>
                    </div>
                    <div>
                      <Label className="font-medium">Reported Revenue:</Label>
                      <p className="mt-1 font-bold">${verificationData.reportedRevenue.toLocaleString()} RLUSD</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amount Verification */}
            <Card>
              <CardHeader>
                <CardTitle>Amount Verification</CardTitle>
                <CardDescription>Compare reported vs extracted amounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">Farmer Reported:</span>
                    <span className="text-lg font-bold">${verificationData.reportedRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="font-medium">Document Extracted:</span>
                    <span className="text-lg font-bold">
                      ${verificationData.extractedData.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-2 p-3 rounded-lg ${
                      amountsMatch ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                    }`}
                  >
                    {amountsMatch ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-medium">{amountsMatch ? "✅ Amounts Match" : "⚠️ Discrepancy Detected"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>Original project information and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Crop Type:</span>
                    <span>{verificationData.projectDetails.cropType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Location:</span>
                    <span>{verificationData.projectDetails.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Planting Date:</span>
                    <span>{verificationData.projectDetails.plantingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Harvest Date:</span>
                    <span>{verificationData.projectDetails.harvestDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Expected Yield:</span>
                    <span>{verificationData.projectDetails.expectedYield} tons</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Actual Yield:</span>
                    <span className="text-green-600 font-medium">
                      {verificationData.projectDetails.actualYield} tons
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Checklist */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Checklist</CardTitle>
                <CardDescription>Complete all verification requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="document-authentic"
                      checked={verificationChecklist.documentAuthentic}
                      onCheckedChange={(checked) =>
                        setVerificationChecklist((prev) => ({ ...prev, documentAuthentic: !!checked }))
                      }
                    />
                    <Label htmlFor="document-authentic" className="text-sm">
                      Document appears authentic and unaltered
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="amounts-match"
                      checked={verificationChecklist.amountsMatch}
                      onCheckedChange={(checked) =>
                        setVerificationChecklist((prev) => ({ ...prev, amountsMatch: !!checked }))
                      }
                    />
                    <Label htmlFor="amounts-match" className="text-sm">
                      Amounts match reported figures
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="date-valid"
                      checked={verificationChecklist.dateValid}
                      onCheckedChange={(checked) =>
                        setVerificationChecklist((prev) => ({ ...prev, dateValid: !!checked }))
                      }
                    />
                    <Label htmlFor="date-valid" className="text-sm">
                      Date falls within project period
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="buyer-complete"
                      checked={verificationChecklist.buyerComplete}
                      onCheckedChange={(checked) =>
                        setVerificationChecklist((prev) => ({ ...prev, buyerComplete: !!checked }))
                      }
                    />
                    <Label htmlFor="buyer-complete" className="text-sm">
                      Buyer information is complete
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="quality-sufficient"
                      checked={verificationChecklist.qualitySufficient}
                      onCheckedChange={(checked) =>
                        setVerificationChecklist((prev) => ({ ...prev, qualitySufficient: !!checked }))
                      }
                    />
                    <Label htmlFor="quality-sufficient" className="text-sm">
                      Document quality is sufficient
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profit Distribution Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Profit Distribution Preview</CardTitle>
                <CardDescription>Calculated distribution amounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Total Revenue:</span>
                    <span className="font-medium">
                      ${verificationData.profitDistribution.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Costs:</span>
                    <span className="font-medium">
                      ${verificationData.profitDistribution.totalCosts.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t pt-2">
                    <span>Net Profit:</span>
                    <span className="text-green-600">
                      ${verificationData.profitDistribution.netProfit.toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Investor Share (40%):</span>
                      <span className="font-medium">
                        ${verificationData.profitDistribution.investorShare.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Farmer Share (40%):</span>
                      <span className="font-medium">
                        ${verificationData.profitDistribution.farmerShare.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Platform Fee (20%):</span>
                      <span className="font-medium">
                        ${verificationData.profitDistribution.platformFee.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Notes</CardTitle>
                <CardDescription>Add notes about this verification</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add any notes or observations about this settlement verification..."
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <AlertDialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
                <AlertDialogTrigger asChild>
                  <Button className="flex-1" disabled={!allChecksComplete}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve & Notarize
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Approve Settlement</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will approve the settlement, create an immutable record on XRPL, and trigger automatic profit
                      distribution to all investors. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Approve & Execute Settlement</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex-1">
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Submission
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reject Settlement</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reject the settlement submission and notify the farmer. Please ensure you have
                      documented the reasons for rejection in the verification notes.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700">Reject Submission</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Request More Info
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
