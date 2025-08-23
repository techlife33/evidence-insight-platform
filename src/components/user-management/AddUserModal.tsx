import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search, X, UserPlus, Mail } from "lucide-react";

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  authMethod: 'SSO' | 'Email';
}

// Mock SSO directory users
const mockSSOUsers = [
  { id: '1', name: 'Alice Brown', email: 'alice.brown@company.com', department: 'HR' },
  { id: '2', name: 'Bob Wilson', email: 'bob.wilson@company.com', department: 'Finance' },
  { id: '3', name: 'Carol Davis', email: 'carol.davis@company.com', department: 'IT' },
  { id: '4', name: 'David Miller', email: 'david.miller@company.com', department: 'Legal' },
  { id: '5', name: 'Emma Taylor', email: 'emma.taylor@company.com', department: 'Operations' },
];

export function AddUserModal({ open, onOpenChange, authMethod }: AddUserModalProps) {
  const [step, setStep] = useState<'search' | 'form'>('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSSOUser, setSelectedSSOUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    welcomeMessage: ''
  });

  const filteredSSOUsers = mockSSOUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSSOUserSelect = (user: any) => {
    setSelectedSSOUser(user);
    setFormData({
      ...formData,
      name: user.name,
      email: user.email,
      department: user.department
    });
    setStep('form');
  };

  const handleManualEntry = () => {
    setSelectedSSOUser(null);
    setFormData({
      name: '',
      email: '',
      role: '',
      department: '',
      welcomeMessage: ''
    });
    setStep('form');
  };

  const handleSubmit = () => {
    // Handle form submission - integrate with API
    console.log('Adding user:', formData);
    onOpenChange(false);
    // Reset form
    setStep('search');
    setSearchTerm('');
    setSelectedSSOUser(null);
    setFormData({
      name: '',
      email: '',
      role: '',
      department: '',
      welcomeMessage: ''
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep('search');
    setSearchTerm('');
    setSelectedSSOUser(null);
    setFormData({
      name: '',
      email: '',
      role: '',
      department: '',
      welcomeMessage: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            {authMethod === 'SSO' ? 'Add User from SSO Directory' : 'Invite User'}
          </DialogTitle>
          <DialogDescription>
            {authMethod === 'SSO' 
              ? 'Search for users in your SSO directory or add manually'
              : 'Send an email invitation to a new user'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'search' && authMethod === 'SSO' ? (
          <div className="space-y-4">
            {/* SSO Directory Search */}
            <div className="space-y-2">
              <Label htmlFor="sso-search">Search SSO Directory</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="sso-search"
                  placeholder="Search by name, email, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-64 overflow-y-auto space-y-2 border rounded-md p-2">
              {filteredSSOUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 hover:bg-accent rounded-md cursor-pointer"
                  onClick={() => handleSSOUserSelect(user)}
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant="outline">{user.department}</Badge>
                </div>
              ))}
              {searchTerm && filteredSSOUsers.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No users found matching "{searchTerm}"
                </p>
              )}
            </div>

            {/* Manual Entry Option */}
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleManualEntry}
                className="w-full"
              >
                <Mail className="w-4 h-4 mr-2" />
                Add User Manually
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Selected SSO User Display */}
            {selectedSSOUser && (
              <div className="flex items-center justify-between p-3 bg-accent rounded-md">
                <div>
                  <p className="font-medium">Selected: {selectedSSOUser.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedSSOUser.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep('search')}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* User Form */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter full name"
                  disabled={!!selectedSSOUser}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter email address"
                  disabled={!!selectedSSOUser}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({...formData, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Auditor">Auditor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  placeholder="Enter department"
                  disabled={!!selectedSSOUser}
                />
              </div>
            </div>

            {authMethod === 'Email' && (
              <div className="space-y-2">
                <Label htmlFor="welcome-message">Welcome Message (Optional)</Label>
                <Textarea
                  id="welcome-message"
                  value={formData.welcomeMessage}
                  onChange={(e) => setFormData({...formData, welcomeMessage: e.target.value})}
                  placeholder="Add a personal welcome message..."
                  rows={3}
                />
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {step === 'form' && (
            <Button onClick={handleSubmit}>
              {authMethod === 'SSO' ? 'Add User' : 'Send Invitation'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}