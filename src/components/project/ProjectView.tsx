import { ArrowLeft, Edit, Calendar, Users, FileText, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Project } from "@/pages/ProjectManagement";

interface ProjectViewProps {
  project: Project | null;
  onBack: () => void;
  onEdit: () => void;
}

export function ProjectView({ project, onBack, onEdit }: ProjectViewProps) {
  if (!project) {
    return null;
  }

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDurationInDays = () => {
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProjectProgress = () => {
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const now = new Date();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const totalDuration = end.getTime() - start.getTime();
    const elapsedTime = now.getTime() - start.getTime();
    return Math.round((elapsedTime / totalDuration) * 100);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-2xl">{project.name}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={getStatusBadgeVariant(project.status)}>
                    {project.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Created {formatDate(project.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <Button onClick={onEdit} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Project
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Description */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Description</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </div>

          <Separator />

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Timeline */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-medium">Start Date</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(project.startDate)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">End Date</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(project.endDate)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Duration</div>
                  <div className="text-sm text-muted-foreground">
                    {getDurationInDays()} days
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Timeline Progress</span>
                    <span>{getProjectProgress()}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProjectProgress()}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Last Updated</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(project.updatedAt)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Team ({project.assignedUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project.assignedUsers.map((user, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                        {user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-sm">{user}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Audit Frameworks */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Audit Frameworks</h3>
            <div className="flex gap-2 flex-wrap">
              {project.frameworks.map((framework) => (
                <Badge key={framework} variant="outline" className="px-3 py-1">
                  {framework}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Project Statistics */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Project Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {project.frameworks.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Frameworks
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {project.assignedUsers.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Team Members
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {getDurationInDays()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Days
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {getProjectProgress()}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Timeline Progress
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}