import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileSearch, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  Plus,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Dashboard"
        subtitle="Welcome to ProAudit - Enterprise Document Auditing Platform"
      />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <FileSearch className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">Total Audits</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-warning" />
                <div>
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">87%</div>
                  <div className="text-sm text-muted-foreground">Avg Compliance</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Get started with your audit workflows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/new-audit">
                <Button className="w-full h-24 flex flex-col gap-2">
                  <Plus className="h-6 w-6" />
                  <span>Start New Audit</span>
                </Button>
              </Link>
              <Link to="/analytics">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>View Analytics</span>
                </Button>
              </Link>
              <Link to="/configuration">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                  <FileSearch className="h-6 w-6" />
                  <span>Configure Settings</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Audits */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Audits</CardTitle>
            <CardDescription>
              Your latest audit activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "NCQA Health Plan Audit 2024",
                  framework: "NCQA",
                  status: "Completed",
                  date: "2024-01-15",
                  compliance: 92
                },
                {
                  name: "ISO 27001 Security Assessment",
                  framework: "ISO 27001",
                  status: "In Progress",
                  date: "2024-01-10",
                  compliance: 78
                },
                {
                  name: "HIPAA Compliance Review",
                  framework: "HIPAA",
                  status: "In Progress",
                  date: "2024-01-08",
                  compliance: 85
                }
              ].map((audit, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{audit.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{audit.framework}</Badge>
                      <Badge variant={audit.status === "Completed" ? "default" : "secondary"}>
                        {audit.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{audit.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{audit.compliance}%</div>
                    <div className="text-sm text-muted-foreground">Compliance</div>
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
