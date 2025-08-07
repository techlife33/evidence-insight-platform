import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowLeft, Edit, Copy, Trash2, ChevronRight, Search, MoreHorizontal } from "lucide-react";
import { AuditStandard, ProcessArea, NavigationState } from "@/pages/Configuration";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ProcessAreaScreenProps {
  standard: AuditStandard;
  onNavigate: (state: Partial<NavigationState>) => void;
}

export const ProcessAreaScreen = ({ standard, onNavigate }: ProcessAreaScreenProps) => {
  const [selectedProcessArea, setSelectedProcessArea] = useState<ProcessArea | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProcessArea, setEditingProcessArea] = useState<ProcessArea | null>(null);
  const [copyName, setCopyName] = useState("");
  const [deleteProcessArea, setDeleteProcessArea] = useState<ProcessArea | null>(null);

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

  const filteredProcessAreas = processAreas.filter(area =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (processArea: ProcessArea) => {
    setEditingProcessArea(processArea);
    setIsEditDialogOpen(true);
  };

  const handleCopy = (processArea: ProcessArea) => {
    setEditingProcessArea(processArea);
    setCopyName(`${processArea.name} (Copy)`);
    setIsCopyDialogOpen(true);
  };

  const handleDelete = (processArea: ProcessArea) => {
    setDeleteProcessArea(processArea);
    setIsDeleteDialogOpen(true);
  };

  const resetDialogs = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsCopyDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setEditingProcessArea(null);
    setCopyName("");
    setDeleteProcessArea(null);
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
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Process Area
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search process areas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Process Area Name</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Controls</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProcessAreas.map((processArea) => (
                <TableRow 
                  key={processArea.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleProcessAreaClick(processArea)}
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(processArea);
                        }}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(processArea);
                        }}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(processArea);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Process Area</DialogTitle>
            <DialogDescription>
              Create a new process area for {standard.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Code</label>
                <Input placeholder="e.g., A.11" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input placeholder="e.g., Physical Security" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Describe the process area..." />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Risk Level</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select function" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT Security">IT Security</SelectItem>
                    <SelectItem value="Asset Management">Asset Management</SelectItem>
                    <SelectItem value="Access Management">Access Management</SelectItem>
                    <SelectItem value="Physical Security">Physical Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Testing Frequency</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetDialogs}>Cancel</Button>
            <Button onClick={resetDialogs}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Process Area</DialogTitle>
            <DialogDescription>
              Modify the process area details
            </DialogDescription>
          </DialogHeader>
          {editingProcessArea && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Code</label>
                  <Input value={editingProcessArea.code} readOnly />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input defaultValue={editingProcessArea.name} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea defaultValue={editingProcessArea.description} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Risk Level</label>
                  <Select defaultValue={editingProcessArea.riskLevel}>
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
                  <Select defaultValue={editingProcessArea.businessFunction}>
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
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={resetDialogs}>Cancel</Button>
            <Button onClick={resetDialogs}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Copy Dialog */}
      <Dialog open={isCopyDialogOpen} onOpenChange={setIsCopyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copy Process Area</DialogTitle>
            <DialogDescription>
              Enter a new name for the copied process area
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Name</label>
              <Input 
                value={copyName}
                onChange={(e) => setCopyName(e.target.value)}
                placeholder="Enter new process area name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetDialogs}>Cancel</Button>
            <Button onClick={resetDialogs}>Copy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Process Area</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteProcessArea?.name}"? This action cannot be undone and will also delete all associated controls and criteria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={resetDialogs}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={resetDialogs} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};