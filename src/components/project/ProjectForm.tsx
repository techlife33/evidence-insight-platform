import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Project } from "@/pages/ProjectManagement";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  frameworks: z.array(z.string()).min(1, "At least one audit framework must be selected"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  assignedUsers: z.array(z.string()).min(1, "At least one user must be assigned"),
  status: z.enum(["Active", "Completed", "On Hold", "Planning"]),
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  mode: "add" | "edit";
  project?: Project | null;
  onBack: () => void;
}

const availableFrameworks = [
  { id: "ISO27001", name: "ISO 27001" },
  { id: "SOC2", name: "SOC 2" },
  { id: "HIPAA", name: "HIPAA" },
  { id: "NCQA_HEDIS", name: "NCQA HEDIS" },
  { id: "PCI_DSS", name: "PCI DSS" },
];

// Simulated large user dataset - in real app, this would come from API
const availableUsers = [
  { id: "1", name: "John Doe", role: "Senior Auditor", department: "Compliance" },
  { id: "2", name: "Jane Smith", role: "Audit Manager", department: "Internal Audit" },
  { id: "3", name: "Mike Johnson", role: "IT Auditor", department: "Technology" },
  { id: "4", name: "Sarah Wilson", role: "Compliance Officer", department: "Compliance" },
  { id: "5", name: "Alice Brown", role: "Risk Analyst", department: "Risk Management" },
  { id: "6", name: "David Chen", role: "Senior Auditor", department: "Financial Audit" },
  { id: "7", name: "Lisa Garcia", role: "IT Specialist", department: "Technology" },
  { id: "8", name: "Robert Kim", role: "Compliance Analyst", department: "Compliance" },
  { id: "9", name: "Emma Thompson", role: "Risk Manager", department: "Risk Management" },
  { id: "10", name: "James Wilson", role: "Audit Director", department: "Internal Audit" },
  { id: "11", name: "Maria Rodriguez", role: "Security Auditor", department: "Cybersecurity" },
  { id: "12", name: "Kevin Liu", role: "Quality Assurance", department: "Operations" },
  { id: "13", name: "Anna Petrov", role: "Financial Analyst", department: "Finance" },
  { id: "14", name: "Tom Bradley", role: "Process Auditor", department: "Operations" },
  { id: "15", name: "Sophie Martin", role: "Regulatory Specialist", department: "Legal" },
];

export function ProjectForm({ mode, project, onBack }: ProjectFormProps) {
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      frameworks: [],
      startDate: new Date(),
      endDate: new Date(),
      assignedUsers: [],
      status: "Planning",
    },
  });

  useEffect(() => {
    if (mode === "edit" && project) {
      form.reset({
        name: project.name,
        description: project.description,
        frameworks: project.frameworks,
        startDate: new Date(project.startDate),
        endDate: new Date(project.endDate),
        assignedUsers: project.assignedUsers,
        status: project.status,
      });
      setSelectedFrameworks(project.frameworks);
      setSelectedUsers(project.assignedUsers);
    }
  }, [mode, project, form]);

  const onSubmit = (data: ProjectFormData) => {
    console.log("Project data:", data);
    
    toast({
      title: mode === "add" ? "Project Created" : "Project Updated",
      description: mode === "add" 
        ? `${data.name} has been created successfully.`
        : `${data.name} has been updated successfully.`,
    });
    
    onBack();
  };

  const handleFrameworkChange = (frameworkId: string, checked: boolean) => {
    const newFrameworks = checked
      ? [...selectedFrameworks, frameworkId]
      : selectedFrameworks.filter(id => id !== frameworkId);
    
    setSelectedFrameworks(newFrameworks);
    form.setValue("frameworks", newFrameworks);
  };

  const handleUserChange = (userName: string, checked: boolean) => {
    const newUsers = checked
      ? [...selectedUsers, userName]
      : selectedUsers.filter(name => name !== userName);
    
    setSelectedUsers(newUsers);
    form.setValue("assignedUsers", newUsers);
  };

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const addUser = (userName: string) => {
    if (!selectedUsers.includes(userName)) {
      const newUsers = [...selectedUsers, userName];
      setSelectedUsers(newUsers);
      form.setValue("assignedUsers", newUsers);
    }
    setUserSearchQuery("");
    setIsUserDropdownOpen(false);
  };

  const removeFramework = (frameworkId: string) => {
    handleFrameworkChange(frameworkId, false);
  };

  const removeUser = (userName: string) => {
    handleUserChange(userName, false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>
              {mode === "add" ? "Create New Project" : "Edit Project"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter project name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Planning">Planning</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="On Hold">On Hold</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter project description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="frameworks"
                render={() => (
                  <FormItem>
                    <FormLabel>Audit Frameworks</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {availableFrameworks.map((framework) => (
                        <FormItem
                          key={framework.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={selectedFrameworks.includes(framework.id)}
                              onCheckedChange={(checked) =>
                                handleFrameworkChange(framework.id, checked as boolean)
                              }
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                              {framework.name}
                            </FormLabel>
                          </div>
                        </FormItem>
                      ))}
                    </div>
                    {selectedFrameworks.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedFrameworks.map((frameworkId) => {
                          const framework = availableFrameworks.find(f => f.id === frameworkId);
                          return (
                            <Badge key={frameworkId} variant="secondary" className="gap-1">
                              {framework?.name}
                              <button
                                type="button"
                                onClick={() => removeFramework(frameworkId)}
                                className="ml-1 hover:bg-secondary-foreground/20 rounded-sm"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedUsers"
                render={() => (
                  <FormItem>
                    <FormLabel>Assigned Users</FormLabel>
                    
                    {/* Search and Add Users */}
                    <div className="space-y-3">
                      <div className="relative">
                        <Input
                          placeholder="Search users by name, role, or department..."
                          value={userSearchQuery}
                          onChange={(e) => {
                            setUserSearchQuery(e.target.value);
                            setIsUserDropdownOpen(e.target.value.length > 0);
                          }}
                          onFocus={() => setIsUserDropdownOpen(userSearchQuery.length > 0)}
                          className="w-full"
                        />
                        
                        {/* Dropdown with filtered users */}
                        {isUserDropdownOpen && filteredUsers.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {filteredUsers.slice(0, 10).map((user) => (
                              <button
                                key={user.id}
                                type="button"
                                onClick={() => addUser(user.name)}
                                disabled={selectedUsers.includes(user.name)}
                                className="w-full px-3 py-2 text-left hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed border-b last:border-b-0"
                              >
                                <div className="font-medium text-sm">{user.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {user.role} • {user.department}
                                </div>
                              </button>
                            ))}
                            {filteredUsers.length > 10 && (
                              <div className="px-3 py-2 text-xs text-muted-foreground border-t">
                                Showing first 10 results. Keep typing to narrow down.
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Click outside to close */}
                        {isUserDropdownOpen && (
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setIsUserDropdownOpen(false)}
                          />
                        )}
                      </div>

                      {/* Selected Users */}
                      {selectedUsers.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Selected Users ({selectedUsers.length})</div>
                          <div className="flex flex-wrap gap-2">
                            {selectedUsers.map((userName) => {
                              const user = availableUsers.find(u => u.name === userName);
                              return (
                                <Badge key={userName} variant="secondary" className="gap-1 py-1">
                                  <div className="flex flex-col items-start">
                                    <span className="text-xs font-medium">{userName}</span>
                                    {user && (
                                      <span className="text-xs text-muted-foreground">{user.role}</span>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeUser(userName)}
                                    className="ml-1 hover:bg-secondary-foreground/20 rounded-sm"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onBack}>
                  Cancel
                </Button>
                <Button type="submit">
                  {mode === "add" ? "Create Project" : "Update Project"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}