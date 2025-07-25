import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowLeft, Edit, ChevronRight } from "lucide-react";
import { AuditStandard, ProcessArea, NavigationState } from "@/pages/Configuration";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProcessAreaScreenProps {
  standard: AuditStandard;
  onNavigate: (state: Partial<NavigationState>) => void;
}

export const ProcessAreaScreen = ({ standard, onNavigate }: ProcessAreaScreenProps) => {
  const [selectedProcessArea, setSelectedProcessArea] = useState<ProcessArea | null>(null);

  // Mock data
  const processAreas: ProcessArea[] = [
    {
      id: "1",
      code: "A.5",
      name: "Information Security Policies",
      description: "Management direction for information security",
      riskLevel: "High",
      businessFunction: "IT Security",
      controlsCount: 3,
      standardId: standard.id
    },
    {
      id: "2",
      code: "A.6",
      name: "Organization of Information Security",
      description: "Internal organization of information security",
      riskLevel: "Medium",
      businessFunction: "IT Security",
      controlsCount: 7,
      standardId: standard.id
    },
    {
      id: "3",
      code: "A.8",
      name: "Asset Management",
      description: "Identify and protect organizational assets",
      riskLevel: "High",
      businessFunction: "Asset Management",
      controlsCount: 10,
      standardId: standard.id
    },
    {
      id: "4",
      code: "A.9",
      name: "Access Control",
      description: "Manage access to information and systems",
      riskLevel: "Critical",
      businessFunction: "Access Management",
      controlsCount: 14,
      standardId: standard.id
    }
  ];

  const handleProcessAreaClick = (processArea: ProcessArea) => {
    onNavigate({
      screen: 'controls',
      selectedProcessArea: processArea
    });
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Critical': return 'destructive';
      case 'High': return 'default';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
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
                onClick={() => onNavigate({ screen: 'standards' })}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Standards
              </Button>
              <CardTitle>Process Areas - {standard.name}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                Bulk Edit
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Process Area
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Process Area Name</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Controls</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processAreas.map((processArea) => (
                <TableRow 
                  key={processArea.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedProcessArea(processArea)}
                >
                  <TableCell className="font-medium">{processArea.code}</TableCell>
                  <TableCell>{processArea.name}</TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadgeVariant(processArea.riskLevel)}>
                      {processArea.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{processArea.controlsCount}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProcessAreaClick(processArea);
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

      {selectedProcessArea && (
        <Card>
          <CardHeader>
            <CardTitle>Process Area Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Code</label>
                <Input value={selectedProcessArea.code} readOnly />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input value={selectedProcessArea.name} />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={selectedProcessArea.description} />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Risk Level</label>
                <Select value={selectedProcessArea.riskLevel}>
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Business Function</label>
                <Select value={selectedProcessArea.businessFunction}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT Security">IT Security</SelectItem>
                    <SelectItem value="Asset Management">Asset Management</SelectItem>
                    <SelectItem value="Access Management">Access Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Testing Frequency</label>
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