import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building,
  Shield,
  Clock,
  Trash2,
  Save,
  AlertTriangle
} from "lucide-react";
import { UserManagementScreen } from "../../pages/UserManagement";

interface OrganizationSettingsScreenProps {
  onNavigate: (screen: UserManagementScreen) => void;
}

export function OrganizationSettingsScreen({ onNavigate }: OrganizationSettingsScreenProps) {
  const [authSettings, setAuthSettings] = useState({
    authMethod: 'SSO',
    requireMFA: true,
    passwordMinLength: 12,
    passwordRequireSpecialChars: true,
    passwordRequireNumbers: true,
    passwordRequireUppercase: true,
    passwordExpiry: 90,
    sessionTimeout: 480, // in minutes
    maxFailedAttempts: 5,
    lockoutDuration: 30 // in minutes
  });

  const [userManagementSettings, setUserManagementSettings] = useState({
    autoSyncEnabled: true,
    syncFrequency: 'daily',
    autoDeactivateInactive: true,
    inactivityThreshold: 90, // days
    autoCleanupEnabled: false,
    cleanupThreshold: 365 // days
  });

  const [organizationInfo, setOrganizationInfo] = useState({
    name: 'Acme Corporation',
    domain: 'company.com',
    adminEmail: 'admin@company.com',
    timezone: 'America/New_York',
    industry: 'Financial Services'
  });

  const handleSaveSettings = () => {
    // Handle save logic - integrate with API
    console.log('Saving organization settings:', {
      authSettings,
      userManagementSettings,
      organizationInfo
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to User Management
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Organization Settings</h1>
          <p className="text-muted-foreground">
            Configure authentication policies and user management settings
          </p>
        </div>
      </div>

      <Tabs defaultValue="authentication" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="authentication" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Authentication
          </TabsTrigger>
          <TabsTrigger value="user-management" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="organization" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Organization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="authentication" className="space-y-6">
          {/* Authentication Method */}
          <Card>
            <CardHeader>
              <CardTitle>Authentication Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Method</p>
                  <p className="text-sm text-muted-foreground">
                    How users authenticate to the platform
                  </p>
                </div>
                <Badge variant={authSettings.authMethod === 'SSO' ? 'default' : 'secondary'}>
                  {authSettings.authMethod}
                </Badge>
              </div>
              
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="auth-sso"
                    name="authMethod"
                    value="SSO"
                    checked={authSettings.authMethod === 'SSO'}
                    onChange={(e) => setAuthSettings({...authSettings, authMethod: e.target.value})}
                  />
                  <Label htmlFor="auth-sso">Single Sign-On (SSO)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="auth-email"
                    name="authMethod"
                    value="Email"
                    checked={authSettings.authMethod === 'Email'}
                    onChange={(e) => setAuthSettings({...authSettings, authMethod: e.target.value})}
                  />
                  <Label htmlFor="auth-email">Email-based</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Policy */}
          {authSettings.authMethod === 'Email' && (
            <Card>
              <CardHeader>
                <CardTitle>Password Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Minimum Password Length: {authSettings.passwordMinLength} characters</Label>
                  <Slider
                    value={[authSettings.passwordMinLength]}
                    onValueChange={(value) => setAuthSettings({...authSettings, passwordMinLength: value[0]})}
                    max={20}
                    min={8}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="require-special-chars">Require Special Characters</Label>
                    <Switch
                      id="require-special-chars"
                      checked={authSettings.passwordRequireSpecialChars}
                      onCheckedChange={(checked) => setAuthSettings({...authSettings, passwordRequireSpecialChars: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="require-numbers">Require Numbers</Label>
                    <Switch
                      id="require-numbers"
                      checked={authSettings.passwordRequireNumbers}
                      onCheckedChange={(checked) => setAuthSettings({...authSettings, passwordRequireNumbers: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="require-uppercase">Require Uppercase</Label>
                    <Switch
                      id="require-uppercase"
                      checked={authSettings.passwordRequireUppercase}
                      onCheckedChange={(checked) => setAuthSettings({...authSettings, passwordRequireUppercase: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Password Expiry: {authSettings.passwordExpiry} days</Label>
                  <Slider
                    value={[authSettings.passwordExpiry]}
                    onValueChange={(value) => setAuthSettings({...authSettings, passwordExpiry: value[0]})}
                    max={365}
                    min={30}
                    step={30}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="require-mfa">Require Multi-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Force all users to enable MFA</p>
                </div>
                <Switch
                  id="require-mfa"
                  checked={authSettings.requireMFA}
                  onCheckedChange={(checked) => setAuthSettings({...authSettings, requireMFA: checked})}
                />
              </div>

              <div className="space-y-2">
                <Label>Session Timeout: {Math.floor(authSettings.sessionTimeout / 60)} hours {authSettings.sessionTimeout % 60} minutes</Label>
                <Slider
                  value={[authSettings.sessionTimeout]}
                  onValueChange={(value) => setAuthSettings({...authSettings, sessionTimeout: value[0]})}
                  max={1440} // 24 hours
                  min={60}   // 1 hour
                  step={30}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Failed Login Attempts</Label>
                  <Select
                    value={authSettings.maxFailedAttempts.toString()}
                    onValueChange={(value) => setAuthSettings({...authSettings, maxFailedAttempts: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                      <SelectItem value="10">10 attempts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Account Lockout Duration</Label>
                  <Select
                    value={authSettings.lockoutDuration.toString()}
                    onValueChange={(value) => setAuthSettings({...authSettings, lockoutDuration: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-management" className="space-y-6">
          {/* Auto Sync Settings */}
          {authSettings.authMethod === 'SSO' && (
            <Card>
              <CardHeader>
                <CardTitle>SSO Directory Sync</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-sync">Enable Automatic Sync</Label>
                    <p className="text-sm text-muted-foreground">Automatically sync users from SSO directory</p>
                  </div>
                  <Switch
                    id="auto-sync"
                    checked={userManagementSettings.autoSyncEnabled}
                    onCheckedChange={(checked) => setUserManagementSettings({...userManagementSettings, autoSyncEnabled: checked})}
                  />
                </div>

                {userManagementSettings.autoSyncEnabled && (
                  <div className="space-y-2">
                    <Label>Sync Frequency</Label>
                    <Select
                      value={userManagementSettings.syncFrequency}
                      onValueChange={(value) => setUserManagementSettings({...userManagementSettings, syncFrequency: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Every Hour</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* User Lifecycle Management */}
          <Card>
            <CardHeader>
              <CardTitle>User Lifecycle Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-deactivate">Auto-deactivate Inactive Users</Label>
                  <p className="text-sm text-muted-foreground">Automatically deactivate users who haven't logged in</p>
                </div>
                <Switch
                  id="auto-deactivate"
                  checked={userManagementSettings.autoDeactivateInactive}
                  onCheckedChange={(checked) => setUserManagementSettings({...userManagementSettings, autoDeactivateInactive: checked})}
                />
              </div>

              {userManagementSettings.autoDeactivateInactive && (
                <div className="space-y-2">
                  <Label>Inactivity Threshold: {userManagementSettings.inactivityThreshold} days</Label>
                  <Slider
                    value={[userManagementSettings.inactivityThreshold]}
                    onValueChange={(value) => setUserManagementSettings({...userManagementSettings, inactivityThreshold: value[0]})}
                    max={365}
                    min={30}
                    step={30}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-cleanup">Auto-cleanup Deleted Users</Label>
                  <p className="text-sm text-muted-foreground">Permanently delete user data after specified period</p>
                </div>
                <Switch
                  id="auto-cleanup"
                  checked={userManagementSettings.autoCleanupEnabled}
                  onCheckedChange={(checked) => setUserManagementSettings({...userManagementSettings, autoCleanupEnabled: checked})}
                />
              </div>

              {userManagementSettings.autoCleanupEnabled && (
                <div className="space-y-2">
                  <Label>Cleanup Threshold: {userManagementSettings.cleanupThreshold} days</Label>
                  <Slider
                    value={[userManagementSettings.cleanupThreshold]}
                    onValueChange={(value) => setUserManagementSettings({...userManagementSettings, cleanupThreshold: value[0]})}
                    max={730} // 2 years
                    min={90}  // 3 months
                    step={30}
                    className="w-full"
                  />
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <p className="text-sm text-yellow-800">
                        Warning: This will permanently delete user data and cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="space-y-6">
          {/* Organization Information */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    value={organizationInfo.name}
                    onChange={(e) => setOrganizationInfo({...organizationInfo, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-domain">Domain</Label>
                  <Input
                    id="org-domain"
                    value={organizationInfo.domain}
                    onChange={(e) => setOrganizationInfo({...organizationInfo, domain: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={organizationInfo.adminEmail}
                    onChange={(e) => setOrganizationInfo({...organizationInfo, adminEmail: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={organizationInfo.industry}
                    onValueChange={(value) => setOrganizationInfo({...organizationInfo, industry: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Financial Services">Financial Services</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={organizationInfo.timezone}
                  onValueChange={(value) => setOrganizationInfo({...organizationInfo, timezone: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (UTC-5)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (UTC-6)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (UTC-7)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (UTC-8)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-destructive" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <h4 className="font-medium text-destructive">Danger Zone</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    These actions cannot be undone. Please proceed with caution.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="destructive" size="sm">
                      Export All Data
                    </Button>
                    <Button variant="outline" size="sm">
                      Delete Organization
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel Changes</Button>
        <Button onClick={handleSaveSettings}>
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}