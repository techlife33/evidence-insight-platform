import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Users,
  Plus,
  Search,
  Settings,
  RefreshCw,
  Upload,
  MoreHorizontal,
  Shield,
  Mail,
  Building,
  UserCheck,
  Clock,
  AlertCircle
} from "lucide-react";
import { AddUserModal } from "./AddUserModal";
import { UserProfileModal } from "./UserProfileModal";
import { UserManagementScreen } from "../../pages/UserManagement";

// Mock data types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Auditor';
  status: 'Active' | 'Inactive' | 'Pending';
  lastLogin: string;
  createdDate: string;
  department: string;
  authType: 'SSO' | 'Email';
}

export interface Organization {
  id: string;
  name: string;
  authMethod: 'SSO' | 'Email';
  domain: string;
  totalUsers: number;
  activeUsers: number;
  pendingInvitations: number;
  lastSync?: string;
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2024-01-15 09:30',
    createdDate: '2024-01-01',
    department: 'IT',
    authType: 'SSO'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: '2024-01-14 16:45',
    createdDate: '2024-01-02',
    department: 'Finance',
    authType: 'SSO'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@contractor.com',
    role: 'Auditor',
    status: 'Pending',
    lastLogin: 'Never',
    createdDate: '2024-01-15',
    department: 'External',
    authType: 'Email'
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    role: 'Auditor',
    status: 'Inactive',
    lastLogin: '2024-01-10 11:20',
    createdDate: '2023-12-15',
    department: 'Compliance',
    authType: 'SSO'
  }
];

const mockOrganization: Organization = {
  id: '1',
  name: 'Acme Corporation',
  authMethod: 'SSO',
  domain: 'company.com',
  totalUsers: 47,
  activeUsers: 42,
  pendingInvitations: 3,
  lastSync: '2024-01-15 08:00'
};

interface UserManagementDashboardProps {
  onNavigate: (screen: UserManagementScreen) => void;
}

export function UserManagementDashboard({ onNavigate }: UserManagementDashboardProps) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserProfileModal(true);
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage users, roles, and access permissions for your organization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => onNavigate('org-settings')}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate('sso-config')}
          >
            <Shield className="w-4 h-4 mr-2" />
            SSO Config
          </Button>
        </div>
      </div>

      {/* Organization Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organization</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOrganization.name}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={mockOrganization.authMethod === 'SSO' ? 'default' : 'secondary'}>
                {mockOrganization.authMethod}
              </Badge>
              <span className="text-xs text-muted-foreground">{mockOrganization.domain}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOrganization.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              of {mockOrganization.totalUsers} total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invitations</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOrganization.pendingInvitations}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{mockOrganization.lastSync || 'Never'}</div>
            <p className="text-xs text-muted-foreground">
              {mockOrganization.authMethod === 'SSO' ? 'SSO Directory' : 'Manual'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Auditor">Auditor</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {selectedUsers.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Bulk Actions ({selectedUsers.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Activate Users</DropdownMenuItem>
                <DropdownMenuItem>Deactivate Users</DropdownMenuItem>
                <DropdownMenuItem>Change Role</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete Users</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {mockOrganization.authMethod === 'SSO' && (
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync SSO
            </Button>
          )}
          
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          
          <Button onClick={() => setShowAddUserModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Auth Type</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <Badge variant={user.authType === 'SSO' ? 'default' : 'outline'}>
                      {user.authType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.createdDate}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewUser(user)}>
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuItem>Reset Password</DropdownMenuItem>
                        <DropdownMenuItem>
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Delete User
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

      {/* Modals */}
      <AddUserModal
        open={showAddUserModal}
        onOpenChange={setShowAddUserModal}
        authMethod={mockOrganization.authMethod}
      />

      <UserProfileModal
        open={showUserProfileModal}
        onOpenChange={setShowUserProfileModal}
        user={selectedUser}
      />
    </div>
  );
}