import { useState } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Shield,
  Clock,
  Mail,
  Phone,
  Building,
  Key,
  Lock,
  LogOut,
  History,
  AlertTriangle
} from "lucide-react";
import { User as UserType } from "./UserManagementDashboard";

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserType | null;
}

// Mock login history data
const mockLoginHistory = [
  { id: '1', timestamp: '2024-01-15 09:30', ip: '192.168.1.100', location: 'New York, US', device: 'Chrome on Windows' },
  { id: '2', timestamp: '2024-01-14 16:45', ip: '192.168.1.100', location: 'New York, US', device: 'Chrome on Windows' },
  { id: '3', timestamp: '2024-01-14 08:15', ip: '10.0.0.50', location: 'New York, US', device: 'Safari on iPhone' },
  { id: '4', timestamp: '2024-01-13 10:20', ip: '192.168.1.100', location: 'New York, US', device: 'Chrome on Windows' },
  { id: '5', timestamp: '2024-01-12 14:30', ip: '203.0.113.45', location: 'Remote', device: 'Firefox on Mac' },
];

export function UserProfileModal({ open, onOpenChange, user }: UserProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    status: 'Active'
  });

  // Initialize form when user changes
  React.useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name,
        email: user.email,
        phone: '+1 (555) 123-4567', // Mock data
        department: user.department,
        role: user.role,
        status: user.status
      });
    }
  }, [user]);

  if (!user) return null;

  const handleSave = () => {
    // Handle save logic - integrate with API
    console.log('Saving user:', editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form to original values
    setEditForm({
      name: user.name,
      email: user.email,
      phone: '+1 (555) 123-4567',
      department: user.department,
      role: user.role,
      status: user.status
    });
    setIsEditing(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'Inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'Pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin':
        return <Badge variant="destructive">Admin</Badge>;
      case 'Manager':
        return <Badge variant="default">Manager</Badge>;
      case 'Auditor':
        return <Badge variant="outline">Auditor</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="" />
              <AvatarFallback>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            View and manage user profile, permissions, and login history
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Permissions
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Login History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  User Information
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      />
                    ) : (
                      <p className="text-sm font-medium">{user.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      />
                    ) : (
                      <p className="text-sm font-medium">{user.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      />
                    ) : (
                      <p className="text-sm font-medium">+1 (555) 123-4567</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    {isEditing ? (
                      <Input
                        id="department"
                        value={editForm.department}
                        onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                      />
                    ) : (
                      <p className="text-sm font-medium">{user.department}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Role</Label>
                    {isEditing ? (
                      <Select
                        value={editForm.role}
                        onValueChange={(value) => setEditForm({...editForm, role: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Auditor">Auditor</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      getRoleBadge(user.role)
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    {isEditing ? (
                      <Select
                        value={editForm.status}
                        onValueChange={(value) => setEditForm({...editForm, status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      getStatusBadge(user.status)
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Auth Type</Label>
                    <Badge variant={user.authType === 'SSO' ? 'default' : 'outline'}>
                      {user.authType}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Created Date</Label>
                    <p className="text-sm">{user.createdDate}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Last Login</Label>
                    <p className="text-sm">{user.lastLogin}</p>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Account Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Reset Password</p>
                      <p className="text-sm text-muted-foreground">Send password reset link to user</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Reset Password
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Lock Account</p>
                      <p className="text-sm text-muted-foreground">Temporarily lock user account</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {user.status === 'Active' ? 'Lock Account' : 'Unlock Account'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Force Logout</p>
                      <p className="text-sm text-muted-foreground">Force logout from all sessions</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Force Logout
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                      <div>
                        <p className="font-medium text-destructive">Delete User</p>
                        <p className="text-sm text-muted-foreground">Permanently delete user account</p>
                      </div>
                    </div>
                    <Button variant="destructive" size="sm">
                      Delete User
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Login History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Device</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockLoginHistory.map((login) => (
                      <TableRow key={login.id}>
                        <TableCell className="font-medium">{login.timestamp}</TableCell>
                        <TableCell>{login.ip}</TableCell>
                        <TableCell>{login.location}</TableCell>
                        <TableCell>{login.device}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}