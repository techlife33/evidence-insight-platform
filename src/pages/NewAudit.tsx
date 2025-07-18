import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { ProgressTracker } from "@/components/ui/progress-tracker";
import { Card } from "@/components/ui/card";
import { AuditSetupStep } from "@/components/audit/AuditSetupStep";
import { FileUploadStep } from "@/components/audit/FileUploadStep";
import { EvidenceReviewStep } from "@/components/audit/EvidenceReviewStep";
import { AuditSummaryStep } from "@/components/audit/AuditSummaryStep";

const auditSteps = [
  {
    id: 1,
    title: "Setup",
    description: "Configure audit parameters"
  },
  {
    id: 2,
    title: "Documents",
    description: "Upload files for review"
  },
  {
    id: 3,
    title: "Evidence Review",
    description: "Review AI findings"
  },
  {
    id: 4,
    title: "Summary",
    description: "Complete audit report"
  }
];

export interface AuditData {
  name: string;
  framework: string;
  processAreas: string[];
  files: File[];
  evidenceFindings?: any[];
  approvedEvidence?: any[];
  rejectedEvidence?: any[];
}

const NewAudit = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [auditData, setAuditData] = useState<AuditData>({
    name: "",
    framework: "",
    processAreas: [],
    files: [],
  });

  const handleNext = () => {
    if (currentStep < auditSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateAuditData = (updates: Partial<AuditData>) => {
    setAuditData(prev => ({ ...prev, ...updates }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AuditSetupStep
            data={auditData}
            onUpdate={updateAuditData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <FileUploadStep
            data={auditData}
            onUpdate={updateAuditData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <EvidenceReviewStep
            data={auditData}
            onUpdate={updateAuditData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <AuditSummaryStep
            data={auditData}
            onUpdate={updateAuditData}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="New Audit"
        subtitle="Create and configure a new document audit"
      />
      
      <div className="flex-1 p-6 space-y-6">
        <div className="max-w-7xl mx-auto w-full">
          <ProgressTracker
            steps={auditSteps}
            currentStep={currentStep}
            className="mb-8"
          />
          
          <Card className="p-8 w-full">
            {renderCurrentStep()}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewAudit;