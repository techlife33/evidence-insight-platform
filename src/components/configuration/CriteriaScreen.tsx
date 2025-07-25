import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, ArrowLeft, ChevronRight, Sparkles } from "lucide-react";
import { Control, Criteria, NavigationState, EvidenceRequirement } from "@/pages/Configuration";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CriteriaScreenProps {
  control: Control;
  onNavigate: (state: Partial<NavigationState>) => void;
}

export const CriteriaScreen = ({ control, onNavigate }: CriteriaScreenProps) => {
  const [selectedCriteria, setSelectedCriteria] = useState<Criteria | null>(null);

  // Mock data
  const criteriaList: Criteria[] = [
    {
      id: "1",
      code: "A.5.1.1",
      statement: "Policy document exists",
      passFailThreshold: "Policy document present",
      evaluationMethod: "Document Review",
      materialityLevel: "High",
      evidenceRequirements: [
        { id: "1", type: "Policy Document", format: "PDF", required: true },
        { id: "2", type: "Approval Records", format: "PDF", required: true },
        { id: "3", type: "Distribution List", format: "Excel", required: false }
      ],
      assessmentRulesCount: 3,
      controlId: control.id
    },
    {
      id: "2",
      code: "A.5.1.2",
      statement: "Policy is board approved",
      passFailThreshold: "Board approval documented",
      evaluationMethod: "Document Review",
      materialityLevel: "High",
      evidenceRequirements: [
        { id: "4", type: "Board Resolution", format: "PDF", required: true },
        { id: "5", type: "Meeting Minutes", format: "PDF", required: true }
      ],
      assessmentRulesCount: 2,
      controlId: control.id
    },
    {
      id: "3",
      code: "A.5.1.3",
      statement: "Policy communicated to staff",
      passFailThreshold: "Communication evidence exists",
      evaluationMethod: "Testing",
      materialityLevel: "Medium",
      evidenceRequirements: [
        { id: "6", type: "Training Records", format: "Excel", required: true },
        { id: "7", type: "Acknowledgment Forms", format: "PDF", required: true }
      ],
      assessmentRulesCount: 4,
      controlId: control.id
    }
  ];

  const handleCriteriaClick = (criteria: Criteria) => {
    onNavigate({
      screen: 'rules',
      selectedCriteria: criteria
    });
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
                onClick={() => onNavigate({ screen: 'controls' })}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Controls
              </Button>
              <CardTitle>Criteria - {control.code} Management Direction</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Suggest
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Criteria
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Criteria Statement</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Rules</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {criteriaList.map((criteria) => (
                <TableRow 
                  key={criteria.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedCriteria(criteria)}
                >
                  <TableCell className="font-medium">{criteria.code}</TableCell>
                  <TableCell className="max-w-md truncate">{criteria.statement}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{criteria.evaluationMethod}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{criteria.assessmentRulesCount}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCriteriaClick(criteria);
                      }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedCriteria && (
        <Card>
          <CardHeader>
            <CardTitle>Criteria Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Criteria Code</label>
              <Input value={selectedCriteria.code} readOnly />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Criteria Statement</label>
              <Textarea value={selectedCriteria.statement} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Pass/Fail Threshold</label>
                <Select value={selectedCriteria.passFailThreshold}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Policy document present">Policy document present</SelectItem>
                    <SelectItem value="Board approval documented">Board approval documented</SelectItem>
                    <SelectItem value="Evidence exists">Evidence exists</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Evaluation Method</label>
                <Select value={selectedCriteria.evaluationMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Document Review">Document Review</SelectItem>
                    <SelectItem value="Testing">Testing</SelectItem>
                    <SelectItem value="Observation">Observation</SelectItem>
                    <SelectItem value="Inquiry">Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Materiality Level</label>
                <Select value={selectedCriteria.materialityLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sampling Required</label>
                <Select defaultValue="No">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Evidence Requirements</CardTitle>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Evidence Type
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedCriteria.evidenceRequirements.map((evidence) => (
                  <div key={evidence.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Checkbox checked={evidence.required} />
                      <div>
                        <div className="font-medium">{evidence.type}</div>
                        <div className="text-sm text-muted-foreground">
                          Format: {evidence.format} • {evidence.required ? 'Required' : 'Optional'}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};