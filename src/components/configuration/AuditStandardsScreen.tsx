import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Upload, Edit, Copy, Trash2 } from "lucide-react";
import { AuditStandard, NavigationState } from "@/pages/Configuration";

interface AuditStandardsScreenProps {
  onNavigate: (state: Partial<NavigationState>) => void;
}

export const AuditStandardsScreen = ({ onNavigate }: AuditStandardsScreenProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const auditStandards: AuditStandard[] = [
    {
      id: "1",
      code: "ISO27001",
      name: "Information Security Management",
      version: "2022",
      industry: "General",
      description: "International standard for information security management systems",
      processAreasCount: 14
    },
    {
      id: "2",
      code: "SOC2",
      name: "SOC 2 Type II",
      version: "2017",
      industry: "Technology",
      description: "Service Organization Control 2 security audit standard",
      processAreasCount: 5
    },
    {
      id: "3",
      code: "NCQA_HEDIS",
      name: "NCQA HEDIS",
      version: "2024",
      industry: "Healthcare",
      description: "Healthcare Effectiveness Data and Information Set",
      processAreasCount: 8
    },
    {
      id: "4",
      code: "HIPAA",
      name: "HIPAA Security Rule",
      version: "2013",
      industry: "Healthcare",
      description: "Health Insurance Portability and Accountability Act",
      processAreasCount: 3
    }
  ];

  const filteredStandards = auditStandards.filter(standard =>
    standard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    standard.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStandardClick = (standard: AuditStandard) => {
    onNavigate({
      screen: 'process-areas',
      selectedStandard: standard
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Audit Standards Management</CardTitle>
            <div className="flex items-center gap-2">
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Standard
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search standards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Standard Code</TableHead>
                <TableHead>Standard Name</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Process Areas</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStandards.map((standard) => (
                <TableRow 
                  key={standard.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleStandardClick(standard)}
                >
                  <TableCell className="font-medium">{standard.code}</TableCell>
                  <TableCell>{standard.name}</TableCell>
                  <TableCell>{standard.version}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{standard.industry}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{standard.processAreasCount}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};