import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter,
  Eye,
  FileText,
  Edit3,
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  Download,
  RotateCw,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { AuditData } from "@/pages/NewAudit";

interface EvidenceReviewStepProps {
  data: AuditData;
  onUpdate: (updates: Partial<AuditData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

interface Evidence {
  id: string;
  category: string;
  subcategory: string;
  finding: string;
  confidence: number;
  documentSource: string;
  annotation: string;
  explanation: string;
  status: 'pending' | 'approved' | 'rejected';
  pageNumber?: number;
  coordinates?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'excel' | 'word';
  pages: number;
  url: string; // Mock URL for display
}

// Mock documents
const mockDocuments: Document[] = [
  {
    id: "doc-1",
    name: "Provider_Credentials.pdf",
    type: "pdf",
    pages: 15,
    url: "/placeholder.svg" // Using placeholder for demo
  },
  {
    id: "doc-2",
    name: "QM_Report_2024.xlsx",
    type: "excel",
    pages: 1,
    url: "/placeholder.svg"
  },
  {
    id: "doc-3",
    name: "HR_Records.pdf",
    type: "pdf",
    pages: 25,
    url: "/placeholder.svg"
  }
];

// Simulated AI findings
const mockEvidenceFindings: Evidence[] = [
  {
    id: "ev-001",
    category: "Credentialing",
    subcategory: "Provider Verification",
    finding: "Medical license verification documentation found",
    confidence: 95,
    documentSource: "Provider_Credentials.pdf",
    annotation: "License verification certificate with expiration date 12/2025",
    explanation: "The document contains proper medical license verification with valid expiration dates and verification stamps from the state medical board.",
    status: 'pending',
    pageNumber: 3,
    coordinates: { x: 150, y: 200, width: 300, height: 150 }
  },
  {
    id: "ev-002",
    category: "Quality Management",
    subcategory: "Performance Metrics",
    finding: "Quality indicators tracking system identified",
    confidence: 88,
    documentSource: "QM_Report_2024.xlsx",
    annotation: "Patient satisfaction scores and clinical outcome metrics",
    explanation: "Comprehensive quality metrics dashboard showing patient satisfaction scores, readmission rates, and clinical outcome indicators meeting NCQA standards.",
    status: 'pending',
    coordinates: { x: 100, y: 150, width: 400, height: 200 }
  },
  {
    id: "ev-003",
    category: "Credentialing",
    subcategory: "Background Checks",
    finding: "Incomplete background verification process",
    confidence: 76,
    documentSource: "HR_Records.pdf",
    annotation: "Missing criminal background check documentation for 3 providers",
    explanation: "Background verification section shows gaps in criminal history checks for recently hired providers, which may not meet NCQA requirements.",
    status: 'pending',
    pageNumber: 15,
    coordinates: { x: 200, y: 300, width: 350, height: 100 }
  }
];

export function EvidenceReviewStep({ data, onUpdate, onNext, onPrevious }: EvidenceReviewStepProps) {
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEvidence, setEditingEvidence] = useState<Evidence | null>(null);

  // Form state for adding/editing evidence
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    finding: "",
    annotation: "",
    explanation: "",
    confidence: 50
  });

  useEffect(() => {
    // Simulate AI processing
    setLoading(true);
    setTimeout(() => {
      setEvidence(mockEvidenceFindings);
      setSelectedDocument(mockDocuments[0]);
      setLoading(false);
    }, 2000);
  }, []);

  const handleStatusChange = (evidenceId: string, newStatus: 'approved' | 'rejected') => {
    setEvidence(prev => 
      prev.map(item => 
        item.id === evidenceId ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleEditEvidence = (evidenceItem: Evidence) => {
    setEditingEvidence(evidenceItem);
    setFormData({
      category: evidenceItem.category,
      subcategory: evidenceItem.subcategory,
      finding: evidenceItem.finding,
      annotation: evidenceItem.annotation,
      explanation: evidenceItem.explanation,
      confidence: evidenceItem.confidence
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEvidence = () => {
    if (editingEvidence) {
      setEvidence(prev => 
        prev.map(item => 
          item.id === editingEvidence.id 
            ? { ...item, ...formData }
            : item
        )
      );
    } else {
      // Adding new evidence
      const newEvidence: Evidence = {
        id: `ev-${Date.now()}`,
        ...formData,
        documentSource: selectedDocument?.name || "",
        status: 'pending',
        pageNumber: currentPage,
        coordinates: { x: 100, y: 100, width: 200, height: 100 }
      };
      setEvidence(prev => [...prev, newEvidence]);
    }
    setIsEditDialogOpen(false);
    setIsAddDialogOpen(false);
    setEditingEvidence(null);
    setFormData({
      category: "",
      subcategory: "",
      finding: "",
      annotation: "",
      explanation: "",
      confidence: 50
    });
  };

  const handleDeleteEvidence = (evidenceId: string) => {
    setEvidence(prev => prev.filter(item => item.id !== evidenceId));
  };

  const getConfidenceBadgeVariant = (confidence: number) => {
    if (confidence >= 90) return "default";
    if (confidence >= 75) return "secondary";
    return "outline";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const currentDocumentEvidence = evidence.filter(
    ev => ev.documentSource === selectedDocument?.name
  );

  const approvedCount = evidence.filter(item => item.status === 'approved').length;
  const rejectedCount = evidence.filter(item => item.status === 'rejected').length;
  const pendingCount = evidence.filter(item => item.status === 'pending').length;
  const canProceed = pendingCount === 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Evidence Review</h2>
        <p className="text-muted-foreground">
          Review documents with AI-identified evidence annotations. Edit, add, or remove evidence before approval.
        </p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <div className="text-center">
                <p className="font-medium">Analyzing Documents with AI</p>
                <p className="text-sm text-muted-foreground">
                  Our AI is reviewing your uploaded documents and identifying evidence...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-foreground">{evidence.length}</div>
                <div className="text-sm text-muted-foreground">Total Evidence</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-success">{approvedCount}</div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-destructive">{rejectedCount}</div>
                <div className="text-sm text-muted-foreground">Rejected</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-warning">{pendingCount}</div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Document Viewer */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">Document Viewer</CardTitle>
                      <CardDescription>
                        {selectedDocument?.name} {selectedDocument?.pages && `(${selectedDocument.pages} pages)`}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(50, zoom - 25))}>
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium min-w-12 text-center">{zoom}%</span>
                      <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(200, zoom + 25))}>
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Document Selection */}
                  <div className="flex items-center gap-4">
                    <Select 
                      value={selectedDocument?.id || ""} 
                      onValueChange={(value) => {
                        const doc = mockDocuments.find(d => d.id === value);
                        setSelectedDocument(doc || null);
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select document" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDocuments.map(doc => (
                          <SelectItem key={doc.id} value={doc.id}>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              {doc.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedDocument && selectedDocument.pages > 1 && (
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">
                          Page {currentPage} of {selectedDocument.pages}
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setCurrentPage(Math.min(selectedDocument.pages, currentPage + 1))}
                          disabled={currentPage === selectedDocument.pages}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Document Display with Annotations */}
                  <div className="relative border border-border rounded-lg overflow-hidden bg-muted/20 min-h-96">
                    {selectedDocument ? (
                      <div className="relative">
                        <img 
                          src={selectedDocument.url} 
                          alt={selectedDocument.name}
                          className="w-full h-auto"
                          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                        />
                        
                        {/* Evidence Annotations */}
                        {currentDocumentEvidence
                          .filter(ev => !ev.pageNumber || ev.pageNumber === currentPage)
                          .map((evidenceItem) => (
                          <div
                            key={evidenceItem.id}
                            className={`absolute border-2 cursor-pointer transition-all ${
                              selectedEvidence?.id === evidenceItem.id 
                                ? 'border-primary bg-primary/20' 
                                : evidenceItem.status === 'approved'
                                ? 'border-success bg-success/10'
                                : evidenceItem.status === 'rejected'
                                ? 'border-destructive bg-destructive/10'
                                : 'border-warning bg-warning/10'
                            }`}
                            style={{
                              left: `${(evidenceItem.coordinates?.x || 0) * (zoom / 100)}px`,
                              top: `${(evidenceItem.coordinates?.y || 0) * (zoom / 100)}px`,
                              width: `${(evidenceItem.coordinates?.width || 0) * (zoom / 100)}px`,
                              height: `${(evidenceItem.coordinates?.height || 0) * (zoom / 100)}px`,
                            }}
                            onClick={() => setSelectedEvidence(evidenceItem)}
                          >
                            <div className="absolute -top-6 left-0 bg-background border border-border rounded px-2 py-1 text-xs font-medium shadow-sm">
                              {evidenceItem.id}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-96 text-muted-foreground">
                        <div className="text-center">
                          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Select a document to view</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Add Evidence Button */}
                  <div className="flex justify-end">
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Evidence
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Add New Evidence</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="category">Category</Label>
                              <Input
                                id="category"
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                placeholder="e.g., Credentialing"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="subcategory">Subcategory</Label>
                              <Input
                                id="subcategory"
                                value={formData.subcategory}
                                onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                                placeholder="e.g., Provider Verification"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="finding">Finding</Label>
                            <Input
                              id="finding"
                              value={formData.finding}
                              onChange={(e) => setFormData({...formData, finding: e.target.value})}
                              placeholder="Brief description of the evidence"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="annotation">Document Reference</Label>
                            <Textarea
                              id="annotation"
                              value={formData.annotation}
                              onChange={(e) => setFormData({...formData, annotation: e.target.value})}
                              placeholder="Specific location and details in the document"
                              rows={3}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="explanation">Explanation</Label>
                            <Textarea
                              id="explanation"
                              value={formData.explanation}
                              onChange={(e) => setFormData({...formData, explanation: e.target.value})}
                              placeholder="Detailed explanation of why this is evidence"
                              rows={3}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confidence">Confidence Level</Label>
                            <Input
                              id="confidence"
                              type="number"
                              min="0"
                              max="100"
                              value={formData.confidence}
                              onChange={(e) => setFormData({...formData, confidence: parseInt(e.target.value)})}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSaveEvidence}>Add Evidence</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Evidence Panel */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Evidence List</CardTitle>
                  <CardDescription>
                    {selectedDocument?.name || "All documents"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentDocumentEvidence.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No evidence found in this document</p>
                    </div>
                  ) : (
                    currentDocumentEvidence.map((evidenceItem) => (
                      <Card 
                        key={evidenceItem.id} 
                        className={`p-4 cursor-pointer transition-all border ${
                          selectedEvidence?.id === evidenceItem.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/30'
                        }`}
                        onClick={() => setSelectedEvidence(evidenceItem)}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <div className="text-sm font-medium line-clamp-2">{evidenceItem.finding}</div>
                              <div className="flex items-center gap-1">
                                <Badge variant="outline" className="text-xs">{evidenceItem.category}</Badge>
                                <Badge variant={getConfidenceBadgeVariant(evidenceItem.confidence)} className="text-xs">
                                  {evidenceItem.confidence}%
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(evidenceItem.status)}
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {evidenceItem.annotation}
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant={evidenceItem.status === 'approved' ? 'default' : 'outline'}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(evidenceItem.id, 'approved');
                              }}
                              className="h-7 px-2 text-xs"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant={evidenceItem.status === 'rejected' ? 'destructive' : 'outline'}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(evidenceItem.id, 'rejected');
                              }}
                              className="h-7 px-2 text-xs"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditEvidence(evidenceItem);
                              }}
                              className="h-7 px-2 text-xs"
                            >
                              <Edit3 className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Evidence</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this evidence? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteEvidence(evidenceItem.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Selected Evidence Details */}
              {selectedEvidence && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Evidence Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Finding</div>
                      <div className="text-sm text-muted-foreground">{selectedEvidence.finding}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Document Reference</div>
                      <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded border-l-2 border-primary/30">
                        {selectedEvidence.annotation}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Explanation</div>
                      <div className="text-sm text-muted-foreground bg-accent/5 p-2 rounded border-l-2 border-accent/30">
                        {selectedEvidence.explanation}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Edit Evidence Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Evidence</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Input
                      id="edit-category"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-subcategory">Subcategory</Label>
                    <Input
                      id="edit-subcategory"
                      value={formData.subcategory}
                      onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-finding">Finding</Label>
                  <Input
                    id="edit-finding"
                    value={formData.finding}
                    onChange={(e) => setFormData({...formData, finding: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-annotation">Document Reference</Label>
                  <Textarea
                    id="edit-annotation"
                    value={formData.annotation}
                    onChange={(e) => setFormData({...formData, annotation: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-explanation">Explanation</Label>
                  <Textarea
                    id="edit-explanation"
                    value={formData.explanation}
                    onChange={(e) => setFormData({...formData, explanation: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-confidence">Confidence Level</Label>
                  <Input
                    id="edit-confidence"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.confidence}
                    onChange={(e) => setFormData({...formData, confidence: parseInt(e.target.value)})}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEvidence}>Save Changes</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!canProceed}
          className={!canProceed ? "opacity-50 cursor-not-allowed" : ""}
        >
          {canProceed ? "Continue to Summary" : `${pendingCount} evidence pending review`}
        </Button>
      </div>
    </div>
  );
}