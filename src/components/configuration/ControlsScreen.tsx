import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, ArrowLeft, Edit, Copy, Trash2, ChevronRight, Search, MoreHorizontal } from "lucide-react";
import { ProcessArea, Control, NavigationState } from "@/pages/Configuration";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ControlsScreenProps {
  processArea: ProcessArea;
  onNavigate: (state: Partial<NavigationState>) => void;
}

export const ControlsScreen = ({ processArea, onNavigate }: ControlsScreenProps) => {
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingControl, setEditingControl] = useState<Control | null>(null);
  const [copyName, setCopyName] = useState("");
  const [deleteControl, setDeleteControl] = useState<Control | null>(null);

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

  const filteredControls = controls.filter(control =>
    control.statement.toLowerCase().includes(searchTerm.toLowerCase()) ||
    control.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (control: Control) => {
    setEditingControl(control);
    setIsEditDialogOpen(true);
  };

  const handleCopy = (control: Control) => {
    setEditingControl(control);
    setCopyName(`${control.statement} (Copy)`);
    setIsCopyDialogOpen(true);
  };

  const handleDelete = (control: Control) => {
    setDeleteControl(control);
    setIsDeleteDialogOpen(true);
  };

  const resetDialogs = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsCopyDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setEditingControl(null);
    setCopyName("");
    setDeleteControl(null);
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
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Control
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search controls..."
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
                <TableHead>Control Statement</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Criteria</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredControls.map((control) => (
                <TableRow 
                  key={control.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleControlClick(control)}
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
                          handleEdit(control);
                        }}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(control);
                        }}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(control);
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Control</DialogTitle>
            <DialogDescription>
              Create a new control for {processArea.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Control Code</label>
              <Input placeholder="e.g., A.5.4" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Control Statement</label>
              <Textarea placeholder="Describe the control requirement..." className="min-h-[100px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Control Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
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
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Control</DialogTitle>
            <DialogDescription>
              Modify the control details
            </DialogDescription>
          </DialogHeader>
          {editingControl && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Control Code</label>
                <Input value={editingControl.code} readOnly />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Control Statement</label>
                <Textarea defaultValue={editingControl.statement} className="min-h-[100px]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Control Type</label>
                  <Select defaultValue={editingControl.type}>
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
                  <Select defaultValue={editingControl.riskRating}>
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
                  <Select defaultValue={editingControl.testingMethod}>
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
            <DialogTitle>Copy Control</DialogTitle>
            <DialogDescription>
              Enter a new statement for the copied control
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Control Statement</label>
              <Textarea 
                value={copyName}
                onChange={(e) => setCopyName(e.target.value)}
                placeholder="Enter new control statement"
                className="min-h-[100px]"
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
            <AlertDialogTitle>Delete Control</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete control "{deleteControl?.code}"? This action cannot be undone and will also delete all associated criteria and rules.
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