import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Upload, Download, Settings, CheckCircle, AlertTriangle } from "lucide-react";
import { Header } from "@/components/layout/Header";

// Import screen components
import { AuditStandardsScreen } from "@/components/configuration/AuditStandardsScreen";
import { ProcessAreaScreen } from "@/components/configuration/ProcessAreaScreen";
import { ControlsScreen } from "@/components/configuration/ControlsScreen";
import { CriteriaScreen } from "@/components/configuration/CriteriaScreen";
import { AssessmentRulesScreen } from "@/components/configuration/AssessmentRulesScreen";
import { ConfigurationSummaryScreen } from "@/components/configuration/ConfigurationSummaryScreen";

// Types for navigation
export interface NavigationState {
  screen: 'standards' | 'process-areas' | 'controls' | 'criteria' | 'rules' | 'summary';
  selectedStandard?: AuditStandard;
  selectedProcessArea?: ProcessArea;
  selectedControl?: Control;
  selectedCriteria?: Criteria;
}

export interface AuditStandard {
  id: string;
  code: string;
  name: string;
  version: string;
  industry: string;
  description: string;
  processAreasCount: number;
}

export interface ProcessArea {
  id: string;
  code: string;
  name: string;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  businessFunction: string;
  controlsCount: number;
  standardId: string;
}

export interface Control {
  id: string;
  code: string;
  statement: string;
  type: 'Preventive' | 'Detective' | 'Corrective';
  riskRating: 'Low' | 'Medium' | 'High' | 'Critical';
  testingMethod: string;
  criteriaCount: number;
  processAreaId: string;
}

export interface Criteria {
  id: string;
  code: string;
  statement: string;
  passFailThreshold: string;
  evaluationMethod: string;
  materialityLevel: 'Low' | 'Medium' | 'High';
  evidenceRequirements: EvidenceRequirement[];
  assessmentRulesCount: number;
  controlId: string;
}

export interface EvidenceRequirement {
  id: string;
  type: string;
  format: string;
  required: boolean;
  samplingSize?: string;
}

export interface AssessmentRule {
  id: string;
  name: string;
  logicType: 'Pattern' | 'Content' | 'Metadata';
  ruleLogic: string;
  keywords: string[];
  confidenceThreshold: number;
  scoringWeight: number;
  status: 'Active' | 'Inactive';
  criteriaId: string;
}

const Configuration = () => {
  const [navigation, setNavigation] = useState<NavigationState>({
    screen: 'standards'
  });

  const navigateTo = (newState: Partial<NavigationState>) => {
    setNavigation(prev => ({ ...prev, ...newState }));
  };

  const renderBreadcrumb = () => {
    const items = [];
    
    if (navigation.screen !== 'standards') {
      items.push(
        <Button
          key="standards"
          variant="ghost"
          size="sm"
          onClick={() => navigateTo({ screen: 'standards' })}
          className="text-primary hover:text-primary/80"
        >
          Standards
        </Button>
      );
    }

    if (navigation.selectedStandard) {
      items.push(<span key="separator1" className="text-muted-foreground">›</span>);
      items.push(
        <Button
          key="process-areas"
          variant="ghost"
          size="sm"
          onClick={() => navigateTo({ screen: 'process-areas' })}
          className="text-primary hover:text-primary/80"
        >
          {navigation.selectedStandard.name}
        </Button>
      );
    }

    if (navigation.selectedProcessArea) {
      items.push(<span key="separator2" className="text-muted-foreground">›</span>);
      items.push(
        <Button
          key="controls"
          variant="ghost"
          size="sm"
          onClick={() => navigateTo({ screen: 'controls' })}
          className="text-primary hover:text-primary/80"
        >
          {navigation.selectedProcessArea.code}
        </Button>
      );
    }

    if (navigation.selectedControl) {
      items.push(<span key="separator3" className="text-muted-foreground">›</span>);
      items.push(
        <Button
          key="criteria"
          variant="ghost"
          size="sm"
          onClick={() => navigateTo({ screen: 'criteria' })}
          className="text-primary hover:text-primary/80"
        >
          {navigation.selectedControl.code}
        </Button>
      );
    }

    if (navigation.selectedCriteria) {
      items.push(<span key="separator4" className="text-muted-foreground">›</span>);
      items.push(
        <span key="current" className="text-foreground font-medium">
          {navigation.selectedCriteria.code}
        </span>
      );
    }

    return (
      <div className="flex items-center gap-2 text-sm">
        {items}
      </div>
    );
  };

  const renderScreen = () => {
    switch (navigation.screen) {
      case 'standards':
        return <AuditStandardsScreen onNavigate={navigateTo} />;
      case 'process-areas':
        return (
          <ProcessAreaScreen 
            standard={navigation.selectedStandard!}
            onNavigate={navigateTo}
          />
        );
      case 'controls':
        return (
          <ControlsScreen 
            processArea={navigation.selectedProcessArea!}
            onNavigate={navigateTo}
          />
        );
      case 'criteria':
        return (
          <CriteriaScreen 
            control={navigation.selectedControl!}
            onNavigate={navigateTo}
          />
        );
      case 'rules':
        return (
          <AssessmentRulesScreen 
            criteria={navigation.selectedCriteria!}
            onNavigate={navigateTo}
          />
        );
      case 'summary':
        return (
          <ConfigurationSummaryScreen 
            standard={navigation.selectedStandard!}
            onNavigate={navigateTo}
          />
        );
      default:
        return <AuditStandardsScreen onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Configuration Management" />
      
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Configuration Management</h1>
            {renderBreadcrumb()}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            {navigation.selectedStandard && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigateTo({ screen: 'summary' })}
              >
                <Settings className="w-4 h-4 mr-2" />
                Summary
              </Button>
            )}
          </div>
        </div>

        {renderScreen()}
      </div>
    </div>
  );
};

export default Configuration;