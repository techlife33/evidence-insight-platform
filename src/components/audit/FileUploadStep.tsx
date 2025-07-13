import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, File, X, CheckCircle } from "lucide-react";
import { AuditData } from "@/pages/NewAudit";

interface FileUploadStepProps {
  data: AuditData;
  onUpdate: (updates: Partial<AuditData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

interface FileWithMetadata {
  file: File;
  id: string;
  uploadedAt: Date;
}

export function FileUploadStep({ data, onUpdate, onNext, onPrevious }: FileUploadStepProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileWithMetadata[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFiles = (files: File[]) => {
    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newFiles: FileWithMetadata[] = files.map(file => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        uploadedAt: new Date()
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      onUpdate({ files: [...data.files, ...files] });
      setUploading(false);
    }, 1000);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    const remainingFiles = uploadedFiles.filter(f => f.id !== fileId).map(f => f.file);
    onUpdate({ files: remainingFiles });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'PDF Document';
      case 'doc':
      case 'docx': return 'Word Document';
      case 'xls':
      case 'xlsx': return 'Excel Spreadsheet';
      case 'ppt':
      case 'pptx': return 'PowerPoint Presentation';
      case 'txt': return 'Text File';
      default: return 'Document';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Document Upload</h2>
        <p className="text-muted-foreground">
          Upload the documents you want to audit. Supported formats include PDF, Word, Excel, and text files.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Drag and drop files here or click to browse. Multiple files can be uploaded at once.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? "border-primary bg-primary/5" 
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                Drop files here to upload
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse your computer
              </p>
              <input
                type="file"
                multiple
                className="hidden"
                id="file-upload"
                onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="mt-4" asChild>
                  <span>Browse Files</span>
                </Button>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {uploading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm">Uploading files...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files ({uploadedFiles.length})</CardTitle>
            <CardDescription>
              Review your uploaded documents and their metadata.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploadedFiles.map((fileData) => (
              <div key={fileData.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex items-start space-x-3">
                  <File className="h-5 w-5 text-primary mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">{fileData.file.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Badge variant="secondary">{getFileType(fileData.file.name)}</Badge>
                      <span>•</span>
                      <span>{formatFileSize(fileData.file.size)}</span>
                      <span>•</span>
                      <span>Uploaded {fileData.uploadedAt.toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-success">
                      <CheckCircle className="h-4 w-4" />
                      <span>Successfully processed</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(fileData.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Separator />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous Step
        </Button>
        <Button 
          onClick={onNext} 
          disabled={uploadedFiles.length === 0}
          className="min-w-24"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
}