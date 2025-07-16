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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  ArrowLeft,
  ArrowRight,
  Save
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
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
  type: 'pdf' | 'docx';
  pages: number;
  url: string;
}

// Mock documents - now using real file paths
const mockDocuments: Document[] = [
  {
    id: "doc-1",
    name: "Provider_Credentials.pdf",
    type: "pdf",
    pages: 15,
    url: "/documents/Provider_Credentials.pdf"
  },
  {
    id: "doc-2",
    name: "QM_Report_2024.docx",
    type: "docx",
    pages: 1,
    url: "/placeholder.svg" // DOCX preview as image for demo
  },
  {
    id: "doc-3",
    name: "HR_Records.pdf",
    type: "pdf",
    pages: 25,
    url: "/documents/HR_Records.pdf"
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
    annotation: "Page 3, Section 2.1 - License verification certificate with expiration date 12/2025",
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
    documentSource: "QM_Report_2024.docx",
    annotation: "Sheet: Dashboard, Cells A1:F25 - Patient satisfaction scores and clinical outcome metrics",
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
    annotation: "Page 15 - Missing criminal background check documentation for 3 providers",
    explanation: "Background verification section shows gaps in criminal history checks for recently hired providers, which may not meet NCQA requirements.",
    status: 'pending',
    pageNumber: 15,
    coordinates: { x: 200, y: 300, width: 350, height: 100 }
  },
  {
    id: "ev-004",
    category: "Quality Management",
    subcategory: "HEDIS Measures",
    finding: "HEDIS reporting compliance confirmed",
    confidence: 92,
    documentSource: "Provider_Credentials.pdf",
    annotation: "Pages 5-12 - Complete HEDIS measure reporting with audit trails",
    explanation: "All required HEDIS measures are properly documented with data validation processes and audit trails confirming accuracy and completeness.",
    status: 'pending',
    pageNumber: 5,
    coordinates: { x: 180, y: 250, width: 320, height: 120 }
  },
  {
    id: "ev-005",
    category: "Utilization Management",
    subcategory: "Prior Authorization",
    finding: "Prior authorization workflow documented",
    confidence: 85,
    documentSource: "QM_Report_2024.docx",
    annotation: "Section 4.2 - Prior authorization decision timeframes and appeal processes",
    explanation: "Prior authorization processes are well-documented with clear timeframes for decisions and established appeal procedures meeting regulatory requirements.",
    status: 'pending',
    coordinates: { x: 120, y: 180, width: 380, height: 140 }
  }
];

export function EvidenceReviewStep({ data, onUpdate, onNext, onPrevious }: EvidenceReviewStepProps) {
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [filteredEvidence, setFilteredEvidence] = useState<Evidence[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Document viewer state
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [viewerCurrentPage, setViewerCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [editingAnnotation, setEditingAnnotation] = useState<string>("");
  const [isEditingAnnotation, setIsEditingAnnotation] = useState(false);

  useEffect(() => {
    // Simulate AI processing
    setLoading(true);
    setTimeout(() => {
      setEvidence(mockEvidenceFindings);
      setFilteredEvidence(mockEvidenceFindings);
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    let filtered = evidence;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.finding.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredEvidence(filtered);
    setCurrentPage(1);
  }, [evidence, searchTerm, statusFilter, categoryFilter]);

  // Pagination calculations
  const totalItems = filteredEvidence.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEvidence = filteredEvidence.slice(startIndex, endIndex);

  const handleStatusChange = (evidenceId: string, newStatus: 'approved' | 'rejected') => {
    setEvidence(prev => 
      prev.map(item => 
        item.id === evidenceId ? { ...item, status: newStatus } : item
      )
    );
    toast({
      title: "Status Updated",
      description: `Evidence ${newStatus} successfully.`,
    });
  };

  const handleViewEvidence = (evidenceItem: Evidence) => {
    const document = mockDocuments.find(doc => doc.name === evidenceItem.documentSource);
    setSelectedDocument(document || null);
    setSelectedEvidence(evidenceItem);
    setViewerCurrentPage(evidenceItem.pageNumber || 1);
    setEditingAnnotation(evidenceItem.annotation);
    setIsViewerOpen(true);
  };

  const handleSaveAnnotation = () => {
    if (selectedEvidence) {
      setEvidence(prev => 
        prev.map(item => 
          item.id === selectedEvidence.id 
            ? { ...item, annotation: editingAnnotation }
            : item
        )
      );
      setIsEditingAnnotation(false);
      toast({
        title: "Annotation Updated",
        description: "Evidence annotation has been saved successfully.",
      });
    }
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

  const categories = [...new Set(evidence.map(item => item.category))];
  const approvedCount = evidence.filter(item => item.status === 'approved').length;
  const rejectedCount = evidence.filter(item => item.status === 'rejected').length;
  const pendingCount = evidence.filter(item => item.status === 'pending').length;
  const canProceed = pendingCount === 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Evidence Review</h2>
        <p className="text-muted-foreground">
          Review the AI-identified evidence and approve or reject each finding. All evidence must be reviewed before proceeding.
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

          {/* Evidence List */}
          <Card>
            <CardHeader>
              <CardTitle>Evidence Findings</CardTitle>
              <CardDescription>
                Review each piece of evidence identified by our AI analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search evidence..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {paginatedEvidence.map((item) => (
                  <Card key={item.id} className={`border transition-all duration-200 ${
                    item.status === 'approved' ? 'border-success/30 bg-success/5' :
                    item.status === 'rejected' ? 'border-destructive/30 bg-destructive/5' :
                    'border-border hover:border-primary/30'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-4">
                          {/* Header with Finding and Status */}
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <h4 className="font-semibold text-foreground leading-tight">{item.finding}</h4>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{item.category}</Badge>
                                <Badge variant="secondary">{item.subcategory}</Badge>
                                <Badge variant={getConfidenceBadgeVariant(item.confidence)} className="ml-2">
                                  {item.confidence}% confidence
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(item.status)}
                                <span className="text-sm font-medium capitalize">{item.status}</span>
                              </div>
                            </div>
                          </div>

                          {/* Source Information */}
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{item.documentSource}</span>
                            {item.pageNumber && (
                              <Badge variant="outline" className="text-xs">
                                Page {item.pageNumber}
                              </Badge>
                            )}
                          </div>

                          {/* Annotation Section */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium text-foreground">Document Reference</span>
                            </div>
                            <div className="bg-muted/50 rounded-md p-3 border-l-4 border-primary/30">
                              <p className="text-sm text-muted-foreground leading-relaxed">{item.annotation}</p>
                            </div>
                          </div>

                          {/* Explanation Section */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-accent" />
                              <span className="text-sm font-medium text-foreground">AI Analysis</span>
                            </div>
                            <div className="bg-accent/5 rounded-md p-3 border-l-4 border-accent/30">
                              <p className="text-sm text-muted-foreground leading-relaxed">{item.explanation}</p>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewEvidence(item)}
                            className="min-w-24"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Evidence
                          </Button>
                          <Button
                            size="sm"
                            variant={item.status === 'approved' ? 'default' : 'outline'}
                            onClick={() => handleStatusChange(item.id, 'approved')}
                            className="min-w-24"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant={item.status === 'rejected' ? 'destructive' : 'outline'}
                            onClick={() => handleStatusChange(item.id, 'rejected')}
                            className="min-w-24"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredEvidence.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No evidence matches your current filters.
                </div>
              ) : (
                <>
                  {/* Pagination Controls */}
                  <div className="flex items-center justify-between pt-6">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
                    </div>
                    
                    {totalPages > 1 && (
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Document Viewer Dialog */}
          <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
            <DialogContent className="max-w-7xl h-[90vh] p-0">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle>Evidence Viewer - {selectedEvidence?.finding}</DialogTitle>
              </DialogHeader>
              
              <div className="flex h-full p-6 pt-0 gap-6">
                {/* Document Viewer */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium">{selectedDocument?.name}</div>
                      {selectedDocument && selectedDocument.pages > 1 && (
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setViewerCurrentPage(Math.max(1, viewerCurrentPage - 1))}
                            disabled={viewerCurrentPage === 1}
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                          <span className="text-sm">
                            Page {viewerCurrentPage} of {selectedDocument.pages}
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setViewerCurrentPage(Math.min(selectedDocument.pages, viewerCurrentPage + 1))}
                            disabled={viewerCurrentPage === selectedDocument.pages}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
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

                  {/* Document Display */}
                  <div className="flex-1 border border-border rounded-lg overflow-hidden bg-muted/20 relative">
                    {selectedDocument ? (
                      <div className="relative h-full overflow-auto">
                        {selectedDocument.type === 'pdf' ? (
                          <iframe
                            src={selectedDocument.url}
                            className="w-full h-full"
                            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                          />
                        ) : (
                          <img 
                            src="/placeholder.svg" 
                            alt={selectedDocument.name}
                            className="w-full h-auto"
                            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
                          />
                        )}
                        
                        {/* Evidence Annotation Overlay */}
                        {selectedEvidence?.coordinates && (
                          <div
                            className="absolute border-2 border-primary bg-primary/20 cursor-pointer"
                            style={{
                              left: `${(selectedEvidence.coordinates.x || 0) * (zoom / 100)}px`,
                              top: `${(selectedEvidence.coordinates.y || 0) * (zoom / 100)}px`,
                              width: `${(selectedEvidence.coordinates.width || 0) * (zoom / 100)}px`,
                              height: `${(selectedEvidence.coordinates.height || 0) * (zoom / 100)}px`,
                            }}
                          >
                            <div className="absolute -top-6 left-0 bg-primary text-primary-foreground rounded px-2 py-1 text-xs font-medium">
                              Evidence: {selectedEvidence.id}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Document not available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Evidence Details Panel */}
                <div className="w-80 space-y-4">
                  {selectedEvidence && (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Evidence Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Category</Label>
                            <div className="text-sm">{selectedEvidence.category}</div>
                          </div>
                          <div className="space-y-2">
                            <Label>Subcategory</Label>
                            <div className="text-sm">{selectedEvidence.subcategory}</div>
                          </div>
                          <div className="space-y-2">
                            <Label>Finding</Label>
                            <div className="text-sm">{selectedEvidence.finding}</div>
                          </div>
                          <div className="space-y-2">
                            <Label>Confidence</Label>
                            <Badge variant={getConfidenceBadgeVariant(selectedEvidence.confidence)}>
                              {selectedEvidence.confidence}%
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Annotation</CardTitle>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setIsEditingAnnotation(!isEditingAnnotation)}
                            >
                              <Edit3 className="h-4 w-4 mr-1" />
                              {isEditingAnnotation ? "Cancel" : "Edit"}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {isEditingAnnotation ? (
                            <div className="space-y-3">
                              <Textarea
                                value={editingAnnotation}
                                onChange={(e) => setEditingAnnotation(e.target.value)}
                                rows={4}
                                placeholder="Update the annotation..."
                              />
                              <Button size="sm" onClick={handleSaveAnnotation} className="w-full">
                                <Save className="h-4 w-4 mr-1" />
                                Save Annotation
                              </Button>
                            </div>
                          ) : (
                            <div className="text-sm bg-muted/50 p-3 rounded border-l-4 border-primary/30">
                              {selectedEvidence.annotation}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">AI Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm bg-accent/5 p-3 rounded border-l-4 border-accent/30">
                            {selectedEvidence.explanation}
                          </div>
                        </CardContent>
                      </Card>

                      <div className="space-y-2">
                        <Button
                          className="w-full"
                          variant={selectedEvidence.status === 'approved' ? 'default' : 'outline'}
                          onClick={() => {
                            handleStatusChange(selectedEvidence.id, 'approved');
                            setIsViewerOpen(false);
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve Evidence
                        </Button>
                        <Button
                          className="w-full"
                          variant={selectedEvidence.status === 'rejected' ? 'destructive' : 'outline'}
                          onClick={() => {
                            handleStatusChange(selectedEvidence.id, 'rejected');
                            setIsViewerOpen(false);
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject Evidence
                        </Button>
                      </div>
                    </>
                  )}
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