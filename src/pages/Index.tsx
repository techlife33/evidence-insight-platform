import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FolderOpen, 
  FileSearch, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  Users,
  Shield
} from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Dashboard"
        subtitle="Welcome to ProAudit - Enterprise Document Auditing Platform"
      />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-sm text-muted-foreground">Active Projects</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">Frameworks</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <FileSearch className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">28</div>
                  <div className="text-sm text-muted-foreground">Total Audits</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">18</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">89%</div>
                  <div className="text-sm text-muted-foreground">Avg Compliance</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Projects Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>
              Overview of ongoing audit projects and their progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Healthcare Compliance Initiative",
                  frameworks: ["HIPAA", "NCQA"],
                  audits: 8,
                  completed: 5,
                  inProgress: 3,
                  assignedUsers: 4,
                  compliance: 92
                },
                {
                  name: "Information Security Assessment",
                  frameworks: ["ISO 27001", "SOC 2"],
                  audits: 12,
                  completed: 7,
                  inProgress: 5,
                  assignedUsers: 6,
                  compliance: 87
                },
                {
                  name: "Financial Services Audit",
                  frameworks: ["PCI DSS", "SOX"],
                  audits: 6,
                  completed: 4,
                  inProgress: 2,
                  assignedUsers: 3,
                  compliance: 94
                }
              ].map((project, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{project.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {project.frameworks.map((framework, idx) => (
                          <Badge key={idx} variant="outline">{framework}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-lg">{project.compliance}%</div>
                      <div className="text-sm text-muted-foreground">Compliance</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FileSearch className="h-4 w-4 text-muted-foreground" />
                      <span>{project.audits} Audits</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>{project.completed} Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span>{project.inProgress} In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{project.assignedUsers} Auditors</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Audit Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Audit Activities</CardTitle>
            <CardDescription>
              Latest audit activities across all projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Provider Credentialing Review",
                  project: "Healthcare Compliance Initiative",
                  framework: "NCQA",
                  status: "Completed",
                  date: "2024-01-15",
                  auditor: "Sarah Johnson",
                  compliance: 96
                },
                {
                  name: "Network Security Assessment",
                  project: "Information Security Assessment", 
                  framework: "ISO 27001",
                  status: "In Progress",
                  date: "2024-01-12",
                  auditor: "Mike Chen",
                  compliance: 78
                },
                {
                  name: "Payment Processing Audit",
                  project: "Financial Services Audit",
                  framework: "PCI DSS",
                  status: "In Progress", 
                  date: "2024-01-10",
                  auditor: "Emma Davis",
                  compliance: 85
                },
                {
                  name: "Data Protection Review",
                  project: "Healthcare Compliance Initiative",
                  framework: "HIPAA",
                  status: "Completed",
                  date: "2024-01-08",
                  auditor: "Alex Rodriguez",
                  compliance: 91
                }
              ].map((audit, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{audit.name}</p>
                      <div className="font-medium">{audit.compliance}%</div>
                    </div>
                    <p className="text-sm text-muted-foreground">{audit.project}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{audit.framework}</Badge>
                      <Badge variant={audit.status === "Completed" ? "default" : "secondary"}>
                        {audit.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">By {audit.auditor}</span>
                      <span className="text-sm text-muted-foreground">• {audit.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
