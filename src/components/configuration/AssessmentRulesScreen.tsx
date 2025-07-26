import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Copy, Trash2 } from "lucide-react";
import { Criteria, AssessmentRule, NavigationState } from "@/pages/Configuration";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AssessmentRulesScreenProps {
  criteria: Criteria;
  onNavigate: (state: Partial<NavigationState>) => void;
}

export const AssessmentRulesScreen = ({ criteria, onNavigate }: AssessmentRulesScreenProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRule, setSelectedRule] = useState<AssessmentRule | null>(null);
  const [dialogType, setDialogType] = useState<'add' | 'edit' | 'copy' | 'details' | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copyName, setCopyName] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    logicType: "Pattern" as AssessmentRule['logicType'],
    ruleLogic: "",
    keywords: [] as string[],
    confidenceThreshold: 0.7,
    scoringWeight: 0.5,
    status: "Active" as AssessmentRule['status']
  });

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

  const filteredRules = assessmentRules.filter(rule =>
    rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.logicType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRuleClick = (rule: AssessmentRule) => {
    setSelectedRule(rule);
    setDialogType('details');
    setIsDialogOpen(true);
  };

  const openDialog = (type: 'add' | 'edit' | 'copy', rule?: AssessmentRule) => {
    setDialogType(type);
    setSelectedRule(rule || null);
    
    if (type === 'edit' && rule) {
      setFormData({
        name: rule.name,
        logicType: rule.logicType,
        ruleLogic: rule.ruleLogic,
        keywords: [...rule.keywords],
        confidenceThreshold: rule.confidenceThreshold,
        scoringWeight: rule.scoringWeight,
        status: rule.status
      });
    } else if (type === 'copy' && rule) {
      setCopyName(`${rule.name} (Copy)`);
    } else {
      setFormData({
        name: "",
        logicType: "Pattern",
        ruleLogic: "",
        keywords: [],
        confidenceThreshold: 0.7,
        scoringWeight: 0.5,
        status: "Active"
      });
    }
    
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    console.log('Saving:', formData);
    setIsDialogOpen(false);
  };

  const handleCopy = () => {
    console.log('Copying:', selectedRule?.name, 'as', copyName);
    setIsDialogOpen(false);
  };

  const getStatusBadgeVariant = (status: string) => {
    return status === "Active" ? "default" : "secondary";
  };

  const renderFormDialog = () => {
    const isEdit = dialogType === 'edit';
    const isAdd = dialogType === 'add';
    
    return (
      <Dialog open={isDialogOpen && (isEdit || isAdd)} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? 'Edit Assessment Rule' : 'New Assessment Rule'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Rule Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter rule name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logicType">Logic Type</Label>
                <Select value={formData.logicType} onValueChange={(value: AssessmentRule['logicType']) => setFormData({ ...formData, logicType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select logic type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pattern">Pattern Matching</SelectItem>
                    <SelectItem value="Content">Content Analysis</SelectItem>
                    <SelectItem value="Metadata">Metadata Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ruleLogic">Rule Logic</Label>
              <Textarea
                id="ruleLogic"
                value={formData.ruleLogic}
                onChange={(e) => setFormData({ ...formData, ruleLogic: e.target.value })}
                placeholder="Enter rule logic"
                rows={6}
                className="font-mono text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords/Patterns</Label>
              <Input
                id="keywords"
                value={formData.keywords.join(", ")}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value.split(", ").filter(k => k.trim()) })}
                placeholder="Enter comma-separated keywords"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="confidenceThreshold">Confidence Threshold</Label>
                <Input
                  id="confidenceThreshold"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={formData.confidenceThreshold}
                  onChange={(e) => setFormData({ ...formData, confidenceThreshold: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scoringWeight">Scoring Weight</Label>
                <Input
                  id="scoringWeight"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={formData.scoringWeight}
                  onChange={(e) => setFormData({ ...formData, scoringWeight: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: AssessmentRule['status']) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
          <DialogTitle>Copy Assessment Rule</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="copyName">New Rule Name</Label>
            <Input
              id="copyName"
              value={copyName}
              onChange={(e) => setCopyName(e.target.value)}
              placeholder="Enter new rule name"
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

  const renderDetailsDialog = () => (
    <Dialog open={isDialogOpen && dialogType === 'details'} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rule Details - {selectedRule?.name}</DialogTitle>
        </DialogHeader>
        {selectedRule && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rule Name</Label>
                <div className="p-2 bg-muted rounded">{selectedRule.name}</div>
              </div>
              <div className="space-y-2">
                <Label>Logic Type</Label>
                <div className="p-2 bg-muted rounded">
                  <Badge variant="secondary">{selectedRule.logicType}</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Rule Logic</Label>
              <div className="p-3 bg-muted rounded font-mono text-sm whitespace-pre-wrap">
                {selectedRule.ruleLogic}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Keywords/Patterns</Label>
              <div className="p-2 bg-muted rounded">
                {selectedRule.keywords.length > 0 ? selectedRule.keywords.join(", ") : "None"}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Confidence Threshold</Label>
                <div className="p-2 bg-muted rounded">{selectedRule.confidenceThreshold}</div>
              </div>
              <div className="space-y-2">
                <Label>Scoring Weight</Label>
                <div className="p-2 bg-muted rounded">{selectedRule.scoringWeight}</div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="p-2 bg-muted rounded">
                  <Badge variant={getStatusBadgeVariant(selectedRule.status)}>
                    {selectedRule.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Close
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
            <CardTitle>Assessment Rules - {criteria.code} {criteria.statement}</CardTitle>
            <Button onClick={() => openDialog('add')}>
              <Plus className="w-4 h-4 mr-2" />
              New Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search rules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Logic Type</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRules.map((rule) => (
                <TableRow 
                  key={rule.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRuleClick(rule)}
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDialog('edit', rule);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDialog('copy', rule);
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
                            <AlertDialogTitle>Delete Assessment Rule</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{rule.name}"? This action cannot be undone.
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
      {renderDetailsDialog()}
    </div>
  );
};