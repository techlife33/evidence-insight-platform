
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus, Save, X, Edit3 } from "lucide-react";

interface Annotation {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  category: string;
  subcategory: string;
}

interface AnnotationToolProps {
  annotations: Annotation[];
  onAddAnnotation: (annotation: Omit<Annotation, 'id'>) => void;
  onUpdateAnnotation: (id: string, annotation: Partial<Annotation>) => void;
  onDeleteAnnotation: (id: string) => void;
  categories: string[];
  subcategories: { [key: string]: string[] };
  zoom: number;
}

export function AnnotationTool({ 
  annotations, 
  onAddAnnotation, 
  onUpdateAnnotation, 
  onDeleteAnnotation,
  categories,
  subcategories,
  zoom 
}: AnnotationToolProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [currentAnnotation, setCurrentAnnotation] = useState({
    text: "",
    category: "",
    subcategory: ""
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCreating) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoom / 100);
    const y = (e.clientY - rect.top) / (zoom / 100);
    
    setDragStart({ x, y });
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCreating || !dragStart) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const endX = (e.clientX - rect.left) / (zoom / 100);
    const endY = (e.clientY - rect.top) / (zoom / 100);
    
    const width = Math.abs(endX - dragStart.x);
    const height = Math.abs(endY - dragStart.y);
    
    if (width > 10 && height > 10) {
      const annotation = {
        x: Math.min(dragStart.x, endX),
        y: Math.min(dragStart.y, endY),
        width,
        height,
        text: currentAnnotation.text,
        category: currentAnnotation.category,
        subcategory: currentAnnotation.subcategory
      };
      
      if (annotation.text && annotation.category) {
        onAddAnnotation(annotation);
        setCurrentAnnotation({ text: "", category: "", subcategory: "" });
        setIsCreating(false);
      }
    }
    
    setDragStart(null);
  };

  const handleSaveEdit = (id: string) => {
    onUpdateAnnotation(id, currentAnnotation);
    setEditingId(null);
    setCurrentAnnotation({ text: "", category: "", subcategory: "" });
  };

  const startEdit = (annotation: Annotation) => {
    setEditingId(annotation.id);
    setCurrentAnnotation({
      text: annotation.text,
      category: annotation.category,
      subcategory: annotation.subcategory
    });
  };

  return (
    <div className="space-y-4">
      {/* Annotation Controls */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Annotation Tool</Label>
            <Button
              size="sm"
              variant={isCreating ? "default" : "outline"}
              onClick={() => setIsCreating(!isCreating)}
            >
              <Plus className="h-4 w-4 mr-1" />
              {isCreating ? "Cancel" : "Add Annotation"}
            </Button>
          </div>

          {(isCreating || editingId) && (
            <div className="space-y-3 border-t pt-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Category</Label>
                  <Select 
                    value={currentAnnotation.category} 
                    onValueChange={(value) => setCurrentAnnotation(prev => ({ ...prev, category: value, subcategory: "" }))}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs">Subcategory</Label>
                  <Select 
                    value={currentAnnotation.subcategory} 
                    onValueChange={(value) => setCurrentAnnotation(prev => ({ ...prev, subcategory: value }))}
                    disabled={!currentAnnotation.category}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentAnnotation.category && subcategories[currentAnnotation.category]?.map(subcategory => (
                        <SelectItem key={subcategory} value={subcategory}>
                          {subcategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Annotation Text</Label>
                <Textarea
                  value={currentAnnotation.text}
                  onChange={(e) => setCurrentAnnotation(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Describe what this annotation references..."
                  rows={2}
                  className="text-sm resize-none"
                />
              </div>

              {isCreating && (
                <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                  Click and drag on the document to create an annotation area
                </div>
              )}

              {editingId && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSaveEdit(editingId)}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Annotations List */}
      {annotations.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <Label className="text-sm font-medium mb-3 block">Page Annotations ({annotations.length})</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {annotations.map((annotation) => (
                <div key={annotation.id} className="border rounded p-2 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-1">
                        <div className="w-3 h-3 bg-primary rounded-sm"></div>
                        <span className="text-xs font-medium">{annotation.category}</span>
                        {annotation.subcategory && (
                          <span className="text-xs text-muted-foreground">• {annotation.subcategory}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {annotation.text}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEdit(annotation)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDeleteAnnotation(annotation.id)}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Annotation Overlay */}
      <div
        className="absolute inset-0 pointer-events-auto"
        style={{ cursor: isCreating ? 'crosshair' : 'default' }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {annotations.map((annotation) => (
          <div
            key={annotation.id}
            className="absolute border-2 border-primary bg-primary/20 rounded-sm group hover:bg-primary/30 transition-colors"
            style={{
              left: `${(annotation.x * zoom) / 100}px`,
              top: `${(annotation.y * zoom) / 100}px`,
              width: `${(annotation.width * zoom) / 100}px`,
              height: `${(annotation.height * zoom) / 100}px`,
            }}
          >
            <div className="absolute -top-6 left-0 bg-primary text-primary-foreground rounded px-1 py-0.5 text-xs font-medium whitespace-nowrap shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
              {annotation.category}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
