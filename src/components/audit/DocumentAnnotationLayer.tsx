import { useState } from "react";

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

interface DocumentAnnotationLayerProps {
  annotations: Annotation[];
  onAddAnnotation: (annotation: Omit<Annotation, 'id'>) => void;
  zoom: number;
  isCreating: boolean;
  annotationData: {
    text: string;
    category: string;
    subcategory: string;
  };
}

export function DocumentAnnotationLayer({ 
  annotations, 
  onAddAnnotation, 
  zoom, 
  isCreating,
  annotationData
}: DocumentAnnotationLayerProps) {
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

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
        text: annotationData.text,
        category: annotationData.category,
        subcategory: annotationData.subcategory
      };
      
      if (annotation.text && annotation.category) {
        onAddAnnotation(annotation);
      }
    }
    
    setDragStart(null);
  };

  return (
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
  );
}