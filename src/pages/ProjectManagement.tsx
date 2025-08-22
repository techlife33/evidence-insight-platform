import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { ProjectList } from "@/components/project/ProjectList";
import { ProjectForm } from "@/components/project/ProjectForm";
import { ProjectView } from "@/components/project/ProjectView";

export type Project = {
  id: string;
  name: string;
  description: string;
  frameworks: string[];
  startDate: string;
  endDate: string;
  assignedUsers: string[];
  status: "Active" | "Completed" | "On Hold" | "Planning";
  createdAt: string;
  updatedAt: string;
};

export type ViewMode = "list" | "add" | "edit" | "view";

const ProjectManagement = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleBack = () => {
    setViewMode("list");
    setSelectedProject(null);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setViewMode("edit");
  };

  const handleView = (project: Project) => {
    setSelectedProject(project);
    setViewMode("view");
  };

  const handleAdd = () => {
    setSelectedProject(null);
    setViewMode("add");
  };

  const renderContent = () => {
    switch (viewMode) {
      case "add":
        return <ProjectForm mode="add" onBack={handleBack} />;
      case "edit":
        return <ProjectForm mode="edit" project={selectedProject} onBack={handleBack} />;
      case "view":
        return <ProjectView project={selectedProject} onBack={handleBack} onEdit={() => handleEdit(selectedProject!)} />;
      default:
        return (
          <ProjectList 
            onAdd={handleAdd}
            onEdit={handleEdit}
            onView={handleView}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Project Management" 
        subtitle="Create, manage and track audit projects"
      />
      <main className="flex-1 p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default ProjectManagement;