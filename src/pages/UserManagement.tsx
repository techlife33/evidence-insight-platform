import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { UserManagementDashboard } from "@/components/user-management/UserManagementDashboard";
import { SSOConfigurationScreen } from "@/components/user-management/SSOConfigurationScreen";
import { OrganizationSettingsScreen } from "@/components/user-management/OrganizationSettingsScreen";

export type UserManagementScreen = 'dashboard' | 'sso-config' | 'org-settings';

const UserManagement = () => {
  const [currentScreen, setCurrentScreen] = useState<UserManagementScreen>('dashboard');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <UserManagementDashboard onNavigate={setCurrentScreen} />;
      case 'sso-config':
        return <SSOConfigurationScreen onNavigate={setCurrentScreen} />;
      case 'org-settings':
        return <OrganizationSettingsScreen onNavigate={setCurrentScreen} />;
      default:
        return <UserManagementDashboard onNavigate={setCurrentScreen} />;
    }
  };

  const getPageTitle = () => {
    switch (currentScreen) {
      case 'dashboard':
        return 'User Management';
      case 'sso-config':
        return 'SSO Configuration';
      case 'org-settings':
        return 'Organization Settings';
      default:
        return 'User Management';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header title={getPageTitle()} />
      
      <div className="flex-1 p-6">
        {renderScreen()}
      </div>
    </div>
  );
};

export default UserManagement;