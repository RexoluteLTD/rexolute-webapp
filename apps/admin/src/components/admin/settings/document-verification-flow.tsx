

import { useState } from "react"
import { Button } from "@rexolute/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@rexolute/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@rexolute/ui/tabs"
import { ArrowLeft, ArrowRight, Upload, CheckCircle } from "lucide-react"
import { Input } from "@rexolute/ui/input"
import { Label } from "@rexolute/ui/label"

interface VerificationStep {
  id: string
  title: string
  description: string
  fields: {
    id: string
    label: string
    type: string
    placeholder?: string
    options?: { value: string; label: string }[]
  }[]
}

const steps: VerificationStep[] = [
  {
    id: "identity",
    title: "Identity Verification",
    description: "Upload your government-issued ID to verify your identity",
    fields: [
      { id: "fullName", label: "Full Name", type: "text", placeholder: "Enter your full name" },
      { id: "dob", label: "Date of Birth", type: "date" },
      {
        id: "idType",
        label: "ID Type",
        type: "select",
        options: [
          { value: "national", label: "National ID" },
          { value: "passport", label: "Passport" },
          { value: "driverLicense", label: "Driver's License" },
        ],
      },
      { id: "idNumber", label: "ID Number", type: "text", placeholder: "Enter your ID number" },
      { id: "idDocument", label: "Upload ID Document", type: "file" },
    ],
  },
  {
    id: "professional",
    title: "Professional Certification",
    description: "Upload your professional license or certification",
    fields: [
      { id: "licenseNumber", label: "License Number", type: "text", placeholder: "Enter your license number" },
      { id: "issuingAuthority", label: "Issuing Authority", type: "text", placeholder: "Enter the issuing authority" },
      { id: "issueDate", label: "Issue Date", type: "date" },
      { id: "expiryDate", label: "Expiry Date", type: "date" },
      { id: "licenseDocument", label: "Upload License Document", type: "file" },
    ],
  },
  {
    id: "education",
    title: "Educational Credentials",
    description: "Upload your educational certificates and degrees",
    fields: [
      {
        id: "degree",
        label: "Highest Degree",
        type: "select",
        options: [
          { value: "bachelor", label: "Bachelor's Degree" },
          { value: "master", label: "Master's Degree" },
          { value: "doctorate", label: "Doctorate" },
        ],
      },
      { id: "institution", label: "Institution", type: "text", placeholder: "Enter your institution name" },
      { id: "graduationYear", label: "Graduation Year", type: "number", placeholder: "YYYY" },
      { id: "educationDocument", label: "Upload Certificate", type: "file" },
    ],
  },
]

export function DocumentVerificationFlow() {
  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const handleNext = () => {
    setCompletedSteps([...completedSteps, steps[activeStep].id])
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1)
    }
  }

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const isStepCompleted = (stepId: string) => {
    return completedSteps.includes(stepId)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue={steps[activeStep].id} value={steps[activeStep].id}>
        <TabsList className="grid grid-cols-3 mb-8">
          {steps.map((step, index) => (
            <TabsTrigger
              key={step.id}
              value={step.id}
              onClick={() => setActiveStep(index)}
              disabled={!isStepCompleted(step.id) && index > activeStep}
              className="relative"
            >
              <span className="flex items-center gap-2">
                {isStepCompleted(step.id) ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <span className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                )}
                {step.title}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {steps.map((step, index) => (
          <TabsContent key={step.id} value={step.id} className={activeStep === index ? "block" : "hidden"}>
            <Card>
              <CardHeader>
                <CardTitle>{step.title}</CardTitle>
                <p className="text-muted-foreground">{step.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {step.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id}>{field.label}</Label>
                      {field.type === "select" ? (
                        <select
                          id={field.id}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Select {field.label}</option>
                          {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : field.type === "file" ? (
                        <div className="flex items-center justify-center w-full">
                          <label
                            htmlFor={field.id}
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/30"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">PDF, PNG, JPG (MAX. 5MB)</p>
                            </div>
                            <input id={field.id} type="file" className="hidden" />
                          </label>
                        </div>
                      ) : (
                        <Input id={field.id} type={field.type} placeholder={field.placeholder} />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePrevious} disabled={activeStep === 0}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? "Submit" : "Next"}{" "}
                  {activeStep !== steps.length - 1 && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
