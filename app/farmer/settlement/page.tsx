"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
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
import { ArrowLeft, Upload, FileText, DollarSign, CheckCircle, AlertTriangle, Leaf, Info, Calendar } from "lucide-react"

// Mock project data for settlement
const projectData = {
  id: "1",
  title: "Organic Jasmine Rice Farm - Season 2024",
  category: "Rice",
  location: "Chiang Mai, Thailand",
  farmer: "Somchai Jaidee",
  investmentGoal: 25000,
  currentFunding: 25000,
  expectedROI: 18,
  duration: 180,
  harvestDate: "2024-06-05",
  expectedRevenue: 58500,
  investorCount: 127,
  status: "harvesting",
}

export default function SettlementSubmissionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [reportedRevenue, setReportedRevenue] = useState("")
  const [notes, setNotes] = useState("")
  const [certify, setCertify] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = () => {
    // Here you would handle the actual submission
    console.log("Submitting settlement with revenue:", reportedRevenue)
    console.log("File:", selectedFile)
    console.log("Notes:", notes)
    // Close dialog and show success message
    setShowConfirmDialog(false)
    // In a real app, you would redirect to a success page or show a success message
  }

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowConfirmDialog(true)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepOneValid =
    selectedFile && reportedRevenue && !isNaN(Number(reportedRevenue)) && Number(reportedRevenue) > 0
  const isStepTwoValid = certify

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Agri-Trust"
        navLinks={[
          { href: "/projects", label: "Browse Projects" },
          { href: "/farmer", label: "Farmer Dashboard" },
          { href: "/how-it-works", label: "How It Works" },
        ]}
      >
        <Button variant="outline" asChild>
          <Link href="/farmer">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </Header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Submit Revenue Proof</h1>
          <p className="text-muted-foreground">
            Upload official sales documentation for transparent profit distribution
          </p>
        </div>

        {/* Project Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
            <CardDescription>Details about the project requiring settlement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{projectData.title}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline">{projectData.category}</Badge>
                  <Badge variant="secondary">Harvesting Complete</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Harvest Date: {projectData.harvestDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-muted-foreground" />
                    <span>
                      Settlement Deadline: 30 days after harvest (
                      {new Date(
                        new Date(projectData.harvestDate).getTime() + 30 * 24 * 60 * 60 * 1000,
                      ).toLocaleDateString()}
                      )
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Project Value:</span>
                  <span className="font-bold">${projectData.investmentGoal.toLocaleString()} RLUSD</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Expected Revenue:</span>
                  <span className="font-bold">${projectData.expectedRevenue.toLocaleString()} RLUSD</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Investor Count:</span>
                  <span className="font-bold">{projectData.investorCount} investors</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Expected ROI:</span>
                  <span className="font-bold text-green-600">{projectData.expectedROI}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settlement Submission Form */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Settlement Submission</CardTitle>
                <CardDescription>Upload your sales invoice and report final revenue</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Step {currentStep} of 2</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Document Upload */}
                <div>
                  <Label className="text-base font-medium">Upload Official Sales Invoice</Label>
                  <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                    <div className="text-center">
                      {selectedFile ? (
                        <div className="space-y-2">
                          <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <Button variant="outline" size="sm" onClick={() => setSelectedFile(null)} className="mt-2">
                            Change File
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <Label htmlFor="invoice" className="cursor-pointer">
                            <span className="font-medium">Upload Sales Invoice</span>
                            <span className="text-muted-foreground block text-sm">
                              Drag and drop or click to upload (.pdf, .jpg, .png)
                            </span>
                          </Label>
                          <Input
                            id="invoice"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 mb-1">
                      <Info className="w-4 h-4" />
                      <span className="font-medium">Requirements:</span>
                    </div>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Must show buyer information</li>
                      <li>Must display total sale amount</li>
                      <li>Must be dated within project period</li>
                      <li>Must be officially issued document</li>
                    </ul>
                  </div>
                </div>

                {/* Revenue Input */}
                <div>
                  <Label htmlFor="revenue" className="text-base font-medium">
                    Enter Final Sale Amount (RLUSD equivalent)
                  </Label>
                  <div className="relative mt-2">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="revenue"
                      type="number"
                      placeholder="0.00"
                      className="pl-10"
                      value={reportedRevenue}
                      onChange={(e) => setReportedRevenue(e.target.value)}
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Amount will be cross-checked against the uploaded invoice
                  </p>
                </div>

                {/* Additional Notes */}
                <div>
                  <Label htmlFor="notes" className="text-base font-medium">
                    Additional Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any relevant information about the sale..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Review Information */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Review Your Submission</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                      <FileText className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-medium">Uploaded Document</div>
                        <div className="text-sm text-muted-foreground">{selectedFile?.name}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                      <DollarSign className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-medium">Reported Revenue</div>
                        <div className="text-xl font-bold">${Number(reportedRevenue).toLocaleString()} RLUSD</div>
                      </div>
                    </div>
                    {notes && (
                      <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                        <Info className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-1" />
                        <div>
                          <div className="font-medium">Additional Notes</div>
                          <div className="text-sm text-muted-foreground">{notes}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Profit Distribution Preview */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Estimated Profit Distribution</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Total Revenue:</span>
                      <span className="font-medium">${Number(reportedRevenue).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Costs:</span>
                      <span className="font-medium">${projectData.investmentGoal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-t pt-2">
                      <span>Net Profit:</span>
                      <span className="text-green-600">
                        ${(Number(reportedRevenue) - projectData.investmentGoal).toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Investor Share (40%):</span>
                        <span className="font-medium">
                          ${((Number(reportedRevenue) - projectData.investmentGoal) * 0.4).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Farmer Share (40%):</span>
                        <span className="font-medium">
                          ${((Number(reportedRevenue) - projectData.investmentGoal) * 0.4).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Platform Fee (20%):</span>
                        <span className="font-medium">
                          ${((Number(reportedRevenue) - projectData.investmentGoal) * 0.2).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certification */}
                <div className="flex items-start space-x-2 pt-4 border-t">
                  <Checkbox id="certify" checked={certify} onCheckedChange={(checked) => setCertify(!!checked)} />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="certify"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I certify that this is the true and complete sales invoice for this project
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      By checking this box, you confirm that the information provided is accurate and complete. False
                      information may result in penalties and account suspension.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div></div>
              )}

              {currentStep < 2 ? (
                <Button onClick={nextStep} disabled={!isStepOneValid}>
                  Review Submission
                </Button>
              ) : (
                <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                  <AlertDialogTrigger asChild>
                    <Button disabled={!isStepTwoValid}>Submit for Verification</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Settlement Submission</AlertDialogTitle>
                      <AlertDialogDescription>
                        You are about to submit a settlement report with a revenue of $
                        {Number(reportedRevenue).toLocaleString()} RLUSD. This information will be verified by platform
                        administrators and used to calculate profit distribution to all investors.
                        <br />
                        <br />
                        <span className="font-medium">This action cannot be undone.</span>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSubmit}>Submit Settlement</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Information Box */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Settlement Process Information</h4>
              <p className="text-sm text-blue-700">
                After submission, your settlement will be reviewed by platform administrators within 48 hours. Once
                verified, profit will be automatically distributed to all investors according to their investment
                proportions. You will receive your share directly to your connected wallet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
