import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowLeft, ChevronRight } from "lucide-react";
import { ProcessArea, Control, NavigationState } from "@/pages/Configuration";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ControlsScreenProps {
  processArea: ProcessArea;
  onNavigate: (state: Partial<NavigationState>) => void;
}

export const ControlsScreen = ({ processArea, onNavigate }: ControlsScreenProps) => {
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);

  // Mock data
  const controls: Control[] = [
    {
      id: "1",
      code: "A.5.1",
      statement: "Management shall provide direction and support for information security in accordance with business requirements and applicable laws and regulations.",
      type: "Preventive",
      riskRating: "High",
      testingMethod: "Document Review",
      criteriaCount: 4,
      processAreaId: processArea.id
    },
    {
      id: "2",
      code: "A.5.2",
      statement: "Information security policies shall be reviewed at planned intervals or if significant changes occur.",
      type: "Preventive",
      riskRating: "Medium",
      testingMethod: "Document Review",
      criteriaCount: 2,
      processAreaId: processArea.id
    },
    {
      id: "3",
      code: "A.5.3",
      statement: "Policies for information security shall be communicated to relevant personnel.",
      type: "Detective",
      riskRating: "Medium",
      testingMethod: "Testing",
      criteriaCount: 3,
      processAreaId: processArea.id
    }
  ];

  const handleControlClick = (control: Control) => {
    onNavigate({
      screen: 'criteria',
      selectedControl: control
    });
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'Preventive': return 'default';
      case 'Detective': return 'secondary';
      case 'Corrective': return 'outline';
      default: return 'outline';
    }
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
                onClick={() => onNavigate({ screen: 'process-areas' })}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Process Areas
              </Button>
              <CardTitle>Controls - {processArea.code} {processArea.name}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                Clone From
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Control
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Control Statement</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Criteria</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {controls.map((control) => (
                <TableRow 
                  key={control.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedControl(control)}
                >
                  <TableCell className="font-medium">{control.code}</TableCell>
                  <TableCell className="max-w-md truncate">{control.statement}</TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(control.type)}>
                      {control.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{control.criteriaCount}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleControlClick(control);
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

      {selectedControl && (
        <Card>
          <CardHeader>
            <CardTitle>Control Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Control Code</label>
              <Input value={selectedControl.code} readOnly />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Control Statement</label>
              <Textarea value={selectedControl.statement} className="min-h-[100px]" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Control Type</label>
                <Select value={selectedControl.type}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Preventive">Preventive</SelectItem>
                    <SelectItem value="Detective">Detective</SelectItem>
                    <SelectItem value="Corrective">Corrective</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Risk Rating</label>
                <Select value={selectedControl.riskRating}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Testing Method</label>
                <Select value={selectedControl.testingMethod}>
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Frequency</label>
                <Select defaultValue="Annual">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
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