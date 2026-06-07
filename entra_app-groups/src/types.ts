// Type definitions for Microsoft Entra ID Resource management

export type RedirectUriType = 'Web' | 'SPA' | 'PublicClient';

export interface RedirectUri {
  type: RedirectUriType;
  uri: string;
}

export interface ClientSecret {
  id: string;
  description: string;
  expiresOn: string;
  valueHint: string;
  createdOn: string;
  isRevealed?: boolean;
  value?: string; // Clear-text value displayed only on creation
}

export interface ApiPermission {
  id: string;
  resourceApp: string; // e.g. "Microsoft Graph" or "SharePoint"
  permission: string; // e.g. "User.Read", "Group.ReadWrite.All"
  type: 'Role' | 'Scope'; // Role = App Permission, Scope = Delegated
  adminConsentRequired: boolean;
  adminConsentGranted: boolean;
}

export interface AppRole {
  id: string;
  displayName: string;
  value: string;
  description: string;
  allowedMemberTypes: ('User' | 'Application')[];
  isEnabled: boolean;
}

export interface AppRegistration {
  id: string;
  displayName: string;
  appId: string;
  objectId: string;
  signInAudience: 'AzureADMyOrg' | 'AzureADMultipleOrgs' | 'AzureADandPersonalMicrosoftAccount';
  redirectUris: RedirectUri[];
  clientSecrets: ClientSecret[];
  apiPermissions: ApiPermission[];
  appRoles: AppRole[];
  createdDateTime: string;
  notes?: string;
  rbacAssignments?: RbacAssignment[];
}

export type RbacScopeType = 'Subscription' | 'ResourceGroup' | 'Resource';

export interface RbacAssignment {
  id: string;
  roleName: string; // e.g., "Owner", "Contributor", "Reader", "User Access Administrator", "Key Vault Secrets Officer", "Storage Blob Data Contributor"
  scopeType: RbacScopeType;
  scopePath: string; // Subscription, RG, or Resource path
}

export type MembershipType = 'assigned' | 'dynamic';

export interface GroupMember {
  id: string;
  displayName: string;
  type: 'User' | 'Group' | 'ServicePrincipal';
  email?: string;
}

export interface GroupOwner {
  id: string;
  displayName: string;
  type: 'User' | 'ServicePrincipal';
  email?: string;
}

export interface SecurityGroup {
  id: string;
  displayName: string;
  description: string;
  groupType: 'Security' | 'Microsoft 365';
  membershipType: MembershipType;
  membershipRule: string | null;
  membershipRuleProcessingState: 'On' | 'Off' | 'Paused';
  mailEnabled: boolean;
  securityEnabled: boolean;
  mailNickname?: string;
  members: GroupMember[];
  owners: GroupOwner[];
  createdDateTime: string;
  rbacAssignments?: RbacAssignment[];
}

export interface LiveConnectionConfig {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  isConnected: boolean;
}

export interface AuditFinding {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'Security' | 'Architecture' | 'Best Practice' | 'Compliance';
  title: string;
  description: string;
  resourceId: string;
  resourceName: string;
  resourceType: 'AppRegistration' | 'SecurityGroup';
  remediation: string;
}
