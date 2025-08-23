import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Shield,
  Upload,
  TestTube,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download
} from "lucide-react";
import { UserManagementScreen } from "../../pages/UserManagement";

interface SSOConfigurationScreenProps {
  onNavigate: (screen: UserManagementScreen) => void;
}

// Mock data
const mockRoleMappings = [
  { id: '1', ssoGroup: 'IT-Admins', platformRole: 'Admin', userCount: 3 },
  { id: '2', ssoGroup: 'Finance-Managers', platformRole: 'Manager', userCount: 8 },
  { id: '3', ssoGroup: 'Audit-Team', platformRole: 'Auditor', userCount: 15 },
  { id: '4', ssoGroup: 'Compliance-Team', platformRole: 'Auditor', userCount: 12 }
];

export function SSOConfigurationScreen({ onNavigate }: SSOConfigurationScreenProps) {
  const [ssoProvider, setSSOProvider] = useState('saml');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('connected');
  const [roleMappings, setRoleMappings] = useState(mockRoleMappings);
  const [defaultRole, setDefaultRole] = useState('Auditor');

  const [ssoConfig, setSSOConfig] = useState({
    entityId: 'proaudit.company.com',
    ssoUrl: 'https://identity.company.com/auth/saml/sso',
    sloUrl: 'https://identity.company.com/auth/saml/slo',
    x509Certificate: '',
    nameIdFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
    attributeMappings: {
      email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
      firstName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
      lastName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
      groups: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/groups'
    }
  });

  const handleTestConnection = () => {
    setConnectionStatus('testing');
    // Simulate API call
    setTimeout(() => {
      setConnectionStatus('connected');
    }, 2000);
  };

  const handleAddRoleMapping = () => {
    const newMapping = {
      id: Date.now().toString(),
      ssoGroup: '',
      platformRole: 'Auditor',
      userCount: 0
    };
    setRoleMappings([...roleMappings, newMapping]);
  };

  const handleDeleteRoleMapping = (id: string) => {
    setRoleMappings(roleMappings.filter(mapping => mapping.id !== id));
  };

  const getConnectionStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge>;
      case 'disconnected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Disconnected</Badge>;
      case 'testing':
        return <Badge variant="outline"><TestTube className="w-3 h-3 mr-1" />Testing...</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
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
          <h1 className="text-3xl font-bold">SSO Configuration</h1>
          <p className="text-muted-foreground">
            Configure Single Sign-On integration with your identity provider
          </p>
        </div>
      </div>

      {/* Connection Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Connection Status
            </div>
            {getConnectionStatusBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Identity Provider</p>
              <p className="text-sm text-muted-foreground">
                {ssoProvider === 'saml' ? 'SAML 2.0' : 'OpenID Connect'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={connectionStatus === 'testing'}
              >
                <TestTube className="w-4 h-4 mr-2" />
                Test Connection
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Metadata
              </Button>
            </div>
          </div>
          {connectionStatus === 'connected' && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                ✓ SSO connection is active and working properly. Last sync: 2024-01-15 08:00
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="connection" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connection">Connection Setup</TabsTrigger>
          <TabsTrigger value="mappings">Role Mappings</TabsTrigger>
        </TabsList>

        <TabsContent value="connection" className="space-y-6">
          {/* Provider Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Identity Provider Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="saml"
                    name="provider"
                    value="saml"
                    checked={ssoProvider === 'saml'}
                    onChange={(e) => setSSOProvider(e.target.value)}
                  />
                  <Label htmlFor="saml">SAML 2.0</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="oidc"
                    name="provider"
                    value="oidc"
                    checked={ssoProvider === 'oidc'}
                    onChange={(e) => setSSOProvider(e.target.value)}
                  />
                  <Label htmlFor="oidc">OpenID Connect</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {ssoProvider === 'saml' ? (
            <Card>
              <CardHeader>
                <CardTitle>SAML Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entity-id">Entity ID</Label>
                    <Input
                      id="entity-id"
                      value={ssoConfig.entityId}
                      onChange={(e) => setSSOConfig({...ssoConfig, entityId: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name-id-format">Name ID Format</Label>
                    <Select
                      value={ssoConfig.nameIdFormat}
                      onValueChange={(value) => setSSOConfig({...ssoConfig, nameIdFormat: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">Email Address</SelectItem>
                        <SelectItem value="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent">Persistent</SelectItem>
                        <SelectItem value="urn:oasis:names:tc:SAML:2.0:nameid-format:transient">Transient</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sso-url">SSO URL</Label>
                  <Input
                    id="sso-url"
                    value={ssoConfig.ssoUrl}
                    onChange={(e) => setSSOConfig({...ssoConfig, ssoUrl: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slo-url">SLO URL (Optional)</Label>
                  <Input
                    id="slo-url"
                    value={ssoConfig.sloUrl}
                    onChange={(e) => setSSOConfig({...ssoConfig, sloUrl: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificate">X.509 Certificate</Label>
                  <div className="flex gap-2">
                    <Textarea
                      id="certificate"
                      placeholder="Paste your X.509 certificate here..."
                      value={ssoConfig.x509Certificate}
                      onChange={(e) => setSSOConfig({...ssoConfig, x509Certificate: e.target.value})}
                      rows={6}
                      className="font-mono text-xs"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Attribute Mappings</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-attr">Email Attribute</Label>
                      <Input
                        id="email-attr"
                        value={ssoConfig.attributeMappings.email}
                        onChange={(e) => setSSOConfig({
                          ...ssoConfig,
                          attributeMappings: {...ssoConfig.attributeMappings, email: e.target.value}
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="groups-attr">Groups Attribute</Label>
                      <Input
                        id="groups-attr"
                        value={ssoConfig.attributeMappings.groups}
                        onChange={(e) => setSSOConfig({
                          ...ssoConfig,
                          attributeMappings: {...ssoConfig.attributeMappings, groups: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>OpenID Connect Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-id">Client ID</Label>
                    <Input id="client-id" placeholder="Your OIDC Client ID" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-secret">Client Secret</Label>
                    <Input id="client-secret" type="password" placeholder="Your OIDC Client Secret" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discovery-url">Discovery URL</Label>
                  <Input id="discovery-url" placeholder="https://your-provider.com/.well-known/openid_configuration" />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Configuration</Button>
          </div>
        </TabsContent>

        <TabsContent value="mappings" className="space-y-6">
          {/* Default Role */}
          <Card>
            <CardHeader>
              <CardTitle>Default Role Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Label htmlFor="default-role">Default Role for New Users</Label>
                <Select value={defaultRole} onValueChange={setDefaultRole}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Auditor">Auditor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Users without specific group mappings will be assigned this role
              </p>
            </CardContent>
          </Card>

          {/* Role Mappings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>SSO Group to Role Mappings</CardTitle>
              <Button onClick={handleAddRoleMapping}>
                <Plus className="w-4 h-4 mr-2" />
                Add Mapping
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SSO Group</TableHead>
                    <TableHead>Platform Role</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead className="w-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roleMappings.map((mapping) => (
                    <TableRow key={mapping.id}>
                      <TableCell>
                        <Input
                          value={mapping.ssoGroup}
                          onChange={(e) => {
                            const updated = roleMappings.map(m =>
                              m.id === mapping.id ? {...m, ssoGroup: e.target.value} : m
                            );
                            setRoleMappings(updated);
                          }}
                          placeholder="Enter SSO group name"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={mapping.platformRole}
                          onValueChange={(value) => {
                            const updated = roleMappings.map(m =>
                              m.id === mapping.id ? {...m, platformRole: value} : m
                            );
                            setRoleMappings(updated);
                          }}
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
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{mapping.userCount} users</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRoleMapping(mapping.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save Mappings</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}