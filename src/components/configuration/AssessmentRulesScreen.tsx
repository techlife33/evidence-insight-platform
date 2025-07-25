import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowLeft, TestTube } from "lucide-react";
import { Criteria, AssessmentRule, NavigationState } from "@/pages/Configuration";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AssessmentRulesScreenProps {
  criteria: Criteria;
  onNavigate: (state: Partial<NavigationState>) => void;
}

export const AssessmentRulesScreen = ({ criteria, onNavigate }: AssessmentRulesScreenProps) => {
  const [selectedRule, setSelectedRule] = useState<AssessmentRule | null>(null);

  // Mock data
  const assessmentRules: AssessmentRule[] = [
    {
      id: "1",
      name: "Document Exists",
      logicType: "Pattern",
      ruleLogic: `IF document_type IN ['policy', 'procedure']
AND file_name CONTAINS 'security'
AND file_extension IN ['pdf', 'doc', 'docx']
THEN confidence = 1.0
ELSE confidence = 0.0`,
      keywords: ["information security", "policy", "governance"],
      confidenceThreshold: 0.7,
      scoringWeight: 0.4,
      status: "Active",
      criteriaId: criteria.id
    },
    {
      id: "2",
      name: "Policy Keywords",
      logicType: "Content",
      ruleLogic: `IF content CONTAINS ALL ['information security', 'management', 'policy']
THEN confidence = 0.9
ELIF content CONTAINS ANY ['security policy', 'information management']
THEN confidence = 0.6
ELSE confidence = 0.0`,
      keywords: ["information security", "management", "policy"],
      confidenceThreshold: 0.6,
      scoringWeight: 0.3,
      status: "Active",
      criteriaId: criteria.id
    },
    {
      id: "3",
      name: "Document Recency",
      logicType: "Metadata",
      ruleLogic: `IF document_age_days <= 365
THEN confidence = 1.0
ELIF document_age_days <= 730
THEN confidence = 0.8
ELSE confidence = 0.5`,
      keywords: [],
      confidenceThreshold: 0.5,
      scoringWeight: 0.3,
      status: "Active",
      criteriaId: criteria.id
    }
  ];

  const getStatusBadgeVariant = (status: string) => {
    return status === "Active" ? "default" : "secondary";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate({ screen: 'criteria' })}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Criteria
              </Button>
              <CardTitle>Assessment Rules - {criteria.code} {criteria.statement}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <TestTube className="w-4 h-4 mr-2" />
                Test Rule
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Rule
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Logic Type</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessmentRules.map((rule) => (
                <TableRow 
                  key={rule.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedRule(rule)}
                >
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{rule.logicType}</Badge>
                  </TableCell>
                  <TableCell>{rule.scoringWeight}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(rule.status)}>
                      {rule.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedRule && (
        <Card>
          <CardHeader>
            <CardTitle>Rule Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rule Name</label>
              <Input value={selectedRule.name} />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Logic Type</label>
              <Select value={selectedRule.logicType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pattern">Pattern Matching</SelectItem>
                  <SelectItem value="Content">Content Analysis</SelectItem>
                  <SelectItem value="Metadata">Metadata Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Rule Logic</label>
              <Textarea 
                value={selectedRule.ruleLogic}
                className="min-h-[150px] font-mono text-sm"
                placeholder="Enter rule logic..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Keywords/Patterns</label>
              <Input 
                value={selectedRule.keywords.join(", ")}
                placeholder="Enter comma-separated keywords..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Confidence Threshold</label>
                <Input 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="1" 
                  value={selectedRule.confidenceThreshold}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Scoring Weight</label>
                <Input 
                  type="number" 
                  step="0.1" 
                  min="0" 
                  max="1" 
                  value={selectedRule.scoringWeight}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline">Test</Button>
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};