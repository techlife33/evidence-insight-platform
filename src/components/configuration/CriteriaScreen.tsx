import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, ArrowLeft, Edit, Copy, Trash2, ChevronRight, Search, MoreHorizontal } from "lucide-react";
import { Control, Criteria, NavigationState, EvidenceRequirement } from "@/pages/Configuration";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface CriteriaScreenProps {
  control: Control;
  onNavigate: (state: Partial<NavigationState>) => void;
}

export const CriteriaScreen = ({ control, onNavigate }: CriteriaScreenProps) => {
  const [selectedCriteria, setSelectedCriteria] = useState<Criteria | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState<Criteria | null>(null);
  const [copyName, setCopyName] = useState("");
  const [deleteCriteria, setDeleteCriteria] = useState<Criteria | null>(null);

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

  const filteredCriteria = criteriaList.filter(criteria =>
    criteria.statement.toLowerCase().includes(searchTerm.toLowerCase()) ||
    criteria.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (criteria: Criteria) => {
    setEditingCriteria(criteria);
    setIsEditDialogOpen(true);
  };

  const handleCopy = (criteria: Criteria) => {
    setEditingCriteria(criteria);
    setCopyName(`${criteria.statement} (Copy)`);
    setIsCopyDialogOpen(true);
  };

  const handleDelete = (criteria: Criteria) => {
    setDeleteCriteria(criteria);
    setIsDeleteDialogOpen(true);
  };

  const resetDialogs = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsCopyDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setEditingCriteria(null);
    setCopyName("");
    setDeleteCriteria(null);
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
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Criteria
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search criteria..."
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
                <TableHead>Criteria Statement</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Rules</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCriteria.map((criteria) => (
                <TableRow 
                  key={criteria.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleCriteriaClick(criteria)}
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
                          handleEdit(criteria);
                        }}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(criteria);
                        }}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(criteria);
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add New Criteria</DialogTitle>
            <DialogDescription>
              Create a new criteria for {control.code}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Criteria Code</label>
              <Input placeholder="e.g., A.5.1.4" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Criteria Statement</label>
              <Textarea placeholder="Describe the criteria..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Pass/Fail Threshold</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select threshold" />
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Materiality Level</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Criteria</DialogTitle>
            <DialogDescription>
              Modify the criteria details
            </DialogDescription>
          </DialogHeader>
          {editingCriteria && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Criteria Code</label>
                <Input value={editingCriteria.code} readOnly />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Criteria Statement</label>
                <Textarea defaultValue={editingCriteria.statement} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pass/Fail Threshold</label>
                  <Select defaultValue={editingCriteria.passFailThreshold}>
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
                  <Select defaultValue={editingCriteria.evaluationMethod}>
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
                  <Select defaultValue={editingCriteria.materialityLevel}>
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
                  {editingCriteria.evidenceRequirements.map((evidence) => (
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
            <DialogTitle>Copy Criteria</DialogTitle>
            <DialogDescription>
              Enter a new statement for the copied criteria
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Criteria Statement</label>
              <Textarea 
                value={copyName}
                onChange={(e) => setCopyName(e.target.value)}
                placeholder="Enter new criteria statement"
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
            <AlertDialogTitle>Delete Criteria</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete criteria "{deleteCriteria?.code}"? This action cannot be undone and will also delete all associated assessment rules.
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