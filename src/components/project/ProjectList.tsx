import { useState } from "react";
import { Search, Plus, Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { Project } from "@/pages/ProjectManagement";

interface ProjectListProps {
  onAdd: () => void;
  onEdit: (project: Project) => void;
  onView: (project: Project) => void;
}

// Mock data
const mockProjects: Project[] = [
  {
    id: "1",
    name: "SOC 2 Compliance Review",
    description: "Annual SOC 2 Type II compliance audit for the organization",
    frameworks: ["SOC2"],
    startDate: "2024-01-15",
    endDate: "2024-03-30",
    assignedUsers: ["John Doe", "Jane Smith"],
    status: "Active",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15"
  },
  {
    id: "2", 
    name: "ISO 27001 Certification",
    description: "Initial ISO 27001 certification audit preparation",
    frameworks: ["ISO27001"],
    startDate: "2024-02-01",
    endDate: "2024-05-15",
    assignedUsers: ["Mike Johnson", "Sarah Wilson"],
    status: "Planning",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-25"
  },
  {
    id: "3",
    name: "HIPAA Security Assessment",
    description: "Comprehensive HIPAA security rule compliance assessment",
    frameworks: ["HIPAA"],
    startDate: "2023-10-01",
    endDate: "2023-12-15",
    assignedUsers: ["Alice Brown"],
    status: "Completed",
    createdAt: "2023-09-15",
    updatedAt: "2023-12-15"
  },
  {
    id: "4",
    name: "Multi-Framework Review",
    description: "Combined SOC 2 and ISO 27001 assessment",
    frameworks: ["SOC2", "ISO27001"],
    startDate: "2024-03-01",
    endDate: "2024-07-30",
    assignedUsers: ["John Doe", "Jane Smith", "Mike Johnson"],
    status: "On Hold",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-20"
  }
];

export function ProjectList({ onAdd, onEdit, onView }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.frameworks.some(framework => 
        framework.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleDelete = (project: Project) => {
    setProjects(projects.filter(p => p.id !== project.id));
    setDeleteProject(null);
    toast({
      title: "Project Deleted",
      description: `${project.name} has been deleted successfully.`,
    });
  };

  const getStatusBadgeVariant = (status: Project["status"]) => {
    switch (status) {
      case "Active":
        return "default";
      case "Completed":
        return "secondary";
      case "On Hold":
        return "destructive";
      case "Planning":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Projects</CardTitle>
            <Button onClick={onAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Frameworks</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Assigned Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{project.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {project.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {project.frameworks.map((framework) => (
                        <Badge key={framework} variant="outline">
                          {framework}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(project.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {project.assignedUsers.slice(0, 2).join(", ")}
                      {project.assignedUsers.length > 2 && (
                        <span className="text-muted-foreground">
                          {" "}+{project.assignedUsers.length - 2} more
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(project.status)}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(project)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(project)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setDeleteProject(project)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteProject} onOpenChange={() => setDeleteProject(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteProject?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteProject && handleDelete(deleteProject)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}