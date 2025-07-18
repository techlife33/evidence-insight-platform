
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
  onAnnotationModeChange?: (isCreating: boolean, annotationData: { text: string; category: string; subcategory: string }) => void;
}

export function AnnotationTool({ 
  annotations, 
  onAddAnnotation, 
  onUpdateAnnotation, 
  onDeleteAnnotation,
  categories,
  subcategories,
  zoom,
  onAnnotationModeChange
}: AnnotationToolProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentAnnotation, setCurrentAnnotation] = useState({
    text: "",
    category: "",
    subcategory: ""
  });

  const handleToggleCreateMode = () => {
    const newCreatingState = !isCreating;
    setIsCreating(newCreatingState);
    
    if (onAnnotationModeChange) {
      onAnnotationModeChange(newCreatingState, currentAnnotation);
    }
  };

  const handleAnnotationDataChange = (updates: Partial<typeof currentAnnotation>) => {
    const newAnnotationData = { ...currentAnnotation, ...updates };
    setCurrentAnnotation(newAnnotationData);
    
    if (onAnnotationModeChange && isCreating) {
      onAnnotationModeChange(isCreating, newAnnotationData);
    }
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
              onClick={handleToggleCreateMode}
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
                    onValueChange={(value) => handleAnnotationDataChange({ category: value, subcategory: "" })}
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
                    onValueChange={(value) => handleAnnotationDataChange({ subcategory: value })}
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
                  onChange={(e) => handleAnnotationDataChange({ text: e.target.value })}
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

    </div>
  );
}
