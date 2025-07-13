import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileCheck,
  Calendar,
  User,
  Shield
} from "lucide-react";
import { AuditData } from "@/pages/NewAudit";
import { useToast } from "@/hooks/use-toast";

interface AuditSummaryStepProps {
  data: AuditData;
  onUpdate: (updates: Partial<AuditData>) => void;
  onPrevious: () => void;
}

export function AuditSummaryStep({ data, onUpdate, onPrevious }: AuditSummaryStepProps) {
  const [finalComments, setFinalComments] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);
  const { toast } = useToast();

  const totalEvidence = data.evidenceFindings?.length || 0;
  const approvedEvidence = data.approvedEvidence?.length || 0;
  const rejectedEvidence = data.rejectedEvidence?.length || 0;
  
  const compliancePercentage = totalEvidence > 0 ? Math.round((approvedEvidence / totalEvidence) * 100) : 0;
  
  const getRiskLevel = (percentage: number) => {
    if (percentage >= 90) return { level: "Low", color: "text-success", bgColor: "bg-success/10" };
    if (percentage >= 70) return { level: "Medium", color: "text-warning", bgColor: "bg-warning/10" };
    return { level: "High", color: "text-destructive", bgColor: "bg-destructive/10" };
  };

  const risk = getRiskLevel(compliancePercentage);

  const handleCompleteReview = async () => {
    setIsCompleting(true);
    
    // Simulate API call to finalize audit
    setTimeout(() => {
      setIsCompleting(false);
      toast({
        title: "Audit Completed Successfully",
        description: "Your audit has been finalized and is ready for export.",
        variant: "default",
      });
      
      // Here you would typically navigate to a success page or audit list
      console.log("Audit completed:", {
        ...data,
        finalComments,
        compliancePercentage,
        riskLevel: risk.level,
        completedAt: new Date()
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Audit Summary</h2>
        <p className="text-muted-foreground">
          Review the final audit results and complete your assessment. This summary will be included in the final audit report.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <FileCheck className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{compliancePercentage}%</div>
                <div className="text-sm text-muted-foreground">Compliance</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <div className="text-2xl font-bold text-success">{approvedEvidence}</div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-destructive" />
              <div>
                <div className="text-2xl font-bold text-destructive">{rejectedEvidence}</div>
                <div className="text-sm text-muted-foreground">Rejected</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Shield className={`h-5 w-5 ${risk.color}`} />
              <div>
                <div className={`text-2xl font-bold ${risk.color}`}>{risk.level}</div>
                <div className="text-sm text-muted-foreground">Risk Level</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Audit Details</CardTitle>
            <CardDescription>Basic information about this audit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Audit Name:</span>
              <span className="font-medium">{data.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Framework:</span>
              <Badge variant="outline">{data.framework?.toUpperCase()}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Process Areas:</span>
              <span className="font-medium">{data.processAreas.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Documents:</span>
              <span className="font-medium">{data.files.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Evidence Found:</span>
              <span className="font-medium">{totalEvidence}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Audit Date:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Overview</CardTitle>
            <CardDescription>Detailed breakdown of audit findings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Compliance</span>
                <span className="font-medium">{compliancePercentage}%</span>
              </div>
              <Progress value={compliancePercentage} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Approved Evidence:</span>
                <span className="text-success font-medium">{approvedEvidence}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rejected Evidence:</span>
                <span className="text-destructive font-medium">{rejectedEvidence}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Evidence:</span>
                <span className="font-medium">{totalEvidence}</span>
              </div>
            </div>

            <Separator />

            <div className={`p-3 rounded-lg ${risk.bgColor}`}>
              <div className="flex items-center space-x-2">
                <AlertTriangle className={`h-4 w-4 ${risk.color}`} />
                <span className={`font-medium ${risk.color}`}>
                  Risk Assessment: {risk.level}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {risk.level === "Low" && "Your organization demonstrates strong compliance with minimal risk exposure."}
                {risk.level === "Medium" && "Some compliance gaps identified. Consider addressing rejected evidence areas."}
                {risk.level === "High" && "Significant compliance issues found. Immediate action recommended."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Process Areas Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Process Areas Reviewed</CardTitle>
          <CardDescription>Summary of findings across selected process areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.processAreas.map((area, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">{area}</h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={compliancePercentage >= 70 ? "default" : "secondary"}>
                    {compliancePercentage >= 70 ? "Compliant" : "Needs Review"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Final Comments */}
      <Card>
        <CardHeader>
          <CardTitle>Final Comments</CardTitle>
          <CardDescription>
            Add any additional observations or recommendations for this audit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="final-comments">Auditor Comments</Label>
            <Textarea
              id="final-comments"
              placeholder="Enter your final comments and recommendations..."
              value={finalComments}
              onChange={(e) => setFinalComments(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous Step
        </Button>
        <Button 
          onClick={handleCompleteReview}
          disabled={isCompleting}
          className="min-w-32"
        >
          {isCompleting ? "Completing..." : "Complete Review"}
        </Button>
      </div>
    </div>
  );
}