import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Copy, Trash2, Eye } from "lucide-react";
import { AuditStandard, NavigationState } from "@/pages/Configuration";

interface AuditStandardsScreenProps {
  onNavigate: (state: Partial<NavigationState>) => void;
}

export const AuditStandardsScreen = ({ onNavigate }: AuditStandardsScreenProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStandard, setSelectedStandard] = useState<AuditStandard | null>(null);
  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'copy' | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copyName, setCopyName] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    version: "",
    industry: "",
    description: ""
  });

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

  const handleSummaryClick = (standard: AuditStandard, e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate({
      screen: 'summary',
      selectedStandard: standard
    });
  };

  const openDialog = (type: 'add' | 'edit' | 'copy', standard?: AuditStandard) => {
    setDialogType(type);
    setSelectedStandard(standard || null);
    
    if (type === 'edit' && standard) {
      setFormData({
        code: standard.code,
        name: standard.name,
        version: standard.version,
        industry: standard.industry,
        description: standard.description
      });
    } else if (type === 'copy' && standard) {
      setCopyName(`${standard.name} (Copy)`);
    } else {
      setFormData({
        code: "",
        name: "",
        version: "",
        industry: "",
        description: ""
      });
    }
    
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving:', formData);
    setIsDialogOpen(false);
  };

  const handleCopy = () => {
    // Handle copy logic here
    console.log('Copying:', selectedStandard?.name, 'as', copyName);
    setIsDialogOpen(false);
  };

  const renderFormDialog = () => {
    const isEdit = dialogType === 'edit';
    const isAdd = dialogType === 'add';
    
    return (
      <Dialog open={isDialogOpen && (isEdit || isAdd)} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? 'Edit Framework' : 'New Framework'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Framework Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Enter framework code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="Enter version"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Framework Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter framework name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Financial">Financial</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter framework description"
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderCopyDialog = () => (
    <Dialog open={isDialogOpen && dialogType === 'copy'} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Copy Framework</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="copyName">New Framework Name</Label>
            <Input
              id="copyName"
              value={copyName}
              onChange={(e) => setCopyName(e.target.value)}
              placeholder="Enter new framework name"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCopy}>
            Copy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Audit Framework Management</CardTitle>
            <Button onClick={() => openDialog('add')}>
              <Plus className="w-4 h-4 mr-2" />
              New Framework
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search frameworks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Framework Code</TableHead>
                <TableHead>Framework Name</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Process Areas</TableHead>
                <TableHead>Summary</TableHead>
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
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => handleSummaryClick(standard, e)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDialog('edit', standard);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDialog('copy', standard);
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Framework</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{standard.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {renderFormDialog()}
      {renderCopyDialog()}
    </div>
  );
};