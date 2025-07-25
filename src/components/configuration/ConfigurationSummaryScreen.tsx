import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Download, Upload, Copy, Shield } from "lucide-react";
import { AuditStandard, NavigationState } from "@/pages/Configuration";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ConfigurationSummaryScreenProps {
  standard: AuditStandard;
  onNavigate: (state: Partial<NavigationState>) => void;
}

export const ConfigurationSummaryScreen = ({ standard, onNavigate }: ConfigurationSummaryScreenProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  // Mock data for configuration statistics
  const configStats = {
    processAreas: 14,
    incompleteProcessAreas: 0,
    controls: 93,
    missingRules: 12,
    criteria: 284,
    coverage: 96,
    evidenceTypes: 45,
    aiRules: 872
  };

  const validationResults = [
    { type: "success", message: "All process areas have controls" },
    { type: "success", message: "All controls have criteria" },
    { type: "warning", message: "12 criteria missing assessment rules" },
    { type: "success", message: "All evidence types are mapped" },
    { type: "warning", message: "3 orphaned evidence types found" }
  ];

  const treeData = [
    {
      id: "iso27001",
      name: "ISO 27001",
      type: "standard",
      children: [
        {
          id: "a5",
          name: "A.5 Information Security Policies",
          type: "processArea",
          children: [
            {
              id: "a51",
              name: "A.5.1 Management Direction",
              type: "control",
              children: [
                { id: "a511", name: "A.5.1.1 Policy document exists", type: "criteria" },
                { id: "a512", name: "A.5.1.2 Policy is board approved", type: "criteria" }
              ]
            },
            {
              id: "a52",
              name: "A.5.2 Information Security Policies",
              type: "control",
              children: [
                { id: "a521", name: "A.5.2.1 Policies are documented", type: "criteria" }
              ]
            }
          ]
        },
        {
          id: "a6",
          name: "A.6 Organization of Information Security",
          type: "processArea",
          children: []
        }
      ]
    }
  ];

  const renderTreeItem = (item: any, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const indent = level * 20;

    return (
      <div key={item.id}>
        <div 
          className="flex items-center py-1 cursor-pointer hover:bg-muted/50 rounded"
          style={{ paddingLeft: `${indent}px` }}
          onClick={() => hasChildren && toggleItem(item.id)}
        >
          <div className="w-4 h-4 mr-2 flex items-center justify-center">
            {hasChildren ? (
              isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
            ) : (
              <div className="w-2 h-2 bg-muted-foreground rounded-full" />
            )}
          </div>
          <span className="text-sm">{item.name}</span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {item.children.map((child: any) => renderTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Configuration Summary - {standard.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Config
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import Config
              </Button>
              <Button variant="outline" size="sm">
                <Shield className="w-4 h-4 mr-2" />
                Validate
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Clone Standard
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuration Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{configStats.processAreas}</div>
                  <div className="text-sm text-muted-foreground">Process Areas</div>
                  <div className="text-xs text-green-600 mt-1">
                    Incomplete: {configStats.incompleteProcessAreas}
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{configStats.controls}</div>
                  <div className="text-sm text-muted-foreground">Controls</div>
                  <div className="text-xs text-orange-600 mt-1">
                    Missing Rules: {configStats.missingRules}
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{configStats.criteria}</div>
                  <div className="text-sm text-muted-foreground">Criteria</div>
                  <div className="text-xs text-green-600 mt-1">
                    Coverage: {configStats.coverage}%
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{configStats.aiRules}</div>
                  <div className="text-sm text-muted-foreground">AI Rules</div>
                  <div className="text-xs text-blue-600 mt-1">
                    Evidence Types: {configStats.evidenceTypes}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Validation Results */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Validation Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {validationResults.map((result, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  {result.type === "success" ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  )}
                  <span className="text-sm">{result.message}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tree View */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuration Tree View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto border rounded-lg p-4">
                {treeData.map(item => renderTreeItem(item))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};