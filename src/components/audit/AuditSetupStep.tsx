import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditData } from "@/pages/NewAudit";

interface AuditSetupStepProps {
  data: AuditData;
  onUpdate: (updates: Partial<AuditData>) => void;
  onNext: () => void;
}

const frameworks = [
  { id: "ncqa", name: "NCQA (National Committee for Quality Assurance)" },
  { id: "iso9001", name: "ISO 9001:2015" },
  { id: "iso27001", name: "ISO 27001:2022" },
  { id: "sox", name: "SOX (Sarbanes-Oxley)" },
  { id: "hipaa", name: "HIPAA Compliance" },
  { id: "gdpr", name: "GDPR Compliance" },
];

const processAreasByFramework = {
  ncqa: [
    "Credentialing and Recredentialing",
    "Quality Management and Performance Improvement",
    "Utilization Management",
    "Member Rights and Responsibilities",
    "Preventive Health Services",
    "Medical Records Management"
  ],
  iso9001: [
    "Context of the Organization",
    "Leadership",
    "Planning",
    "Support",
    "Operation",
    "Performance Evaluation",
    "Improvement"
  ],
  iso27001: [
    "Information Security Policies",
    "Organization of Information Security",
    "Human Resource Security",
    "Asset Management",
    "Access Control",
    "Cryptography",
    "Physical and Environmental Security"
  ],
  sox: [
    "Financial Reporting Controls",
    "Management Assessment",
    "Independent Auditor Testing",
    "Disclosure Controls and Procedures"
  ],
  hipaa: [
    "Administrative Safeguards",
    "Physical Safeguards",
    "Technical Safeguards",
    "Organizational Requirements"
  ],
  gdpr: [
    "Lawfulness of Processing",
    "Data Subject Rights",
    "Data Protection Impact Assessments",
    "Data Breach Management",
    "Privacy by Design"
  ]
};

export function AuditSetupStep({ data, onUpdate, onNext }: AuditSetupStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!data.name.trim()) {
      newErrors.name = "Audit name is required";
    }
    if (!data.framework) {
      newErrors.framework = "Framework selection is required";
    }
    if (data.processAreas.length === 0) {
      newErrors.processAreas = "At least one process area must be selected";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  const handleProcessAreaChange = (area: string, checked: boolean) => {
    if (checked) {
      onUpdate({ processAreas: [...data.processAreas, area] });
    } else {
      onUpdate({ processAreas: data.processAreas.filter(a => a !== area) });
    }
  };

  const availableProcessAreas = data.framework 
    ? processAreasByFramework[data.framework as keyof typeof processAreasByFramework] || []
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Audit Setup</h2>
        <p className="text-muted-foreground">
          Configure the basic parameters for your audit. Select the appropriate framework and process areas to review.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="audit-name">Audit Name *</Label>
          <Input
            id="audit-name"
            placeholder="Enter a descriptive name for this audit"
            value={data.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="framework">Audit Framework *</Label>
          <Select
            value={data.framework}
            onValueChange={(value) => onUpdate({ framework: value, processAreas: [] })}
          >
            <SelectTrigger className={errors.framework ? "border-destructive" : ""}>
              <SelectValue placeholder="Select an audit framework" />
            </SelectTrigger>
            <SelectContent>
              {frameworks.map((framework) => (
                <SelectItem key={framework.id} value={framework.id}>
                  {framework.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.framework && (
            <p className="text-sm text-destructive">{errors.framework}</p>
          )}
        </div>

        {data.framework && (
          <div className="space-y-4">
            <div>
              <Label>Process Areas *</Label>
              <p className="text-sm text-muted-foreground">
                Select one or more process areas to include in this audit.
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Process Areas</CardTitle>
                <CardDescription>
                  Choose the specific areas you want to audit within the {frameworks.find(f => f.id === data.framework)?.name} framework.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {availableProcessAreas.map((area) => (
                    <div key={area} className="flex items-center space-x-2">
                      <Checkbox
                        id={area}
                        checked={data.processAreas.includes(area)}
                        onCheckedChange={(checked) => 
                          handleProcessAreaChange(area, checked as boolean)
                        }
                      />
                      <Label htmlFor={area} className="text-sm font-normal">
                        {area}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {errors.processAreas && (
              <p className="text-sm text-destructive">{errors.processAreas}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="min-w-24">
          Next Step
        </Button>
      </div>
    </div>
  );
}