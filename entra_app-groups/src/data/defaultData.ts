import { AppRegistration, SecurityGroup } from '../types';

export const DEFAULT_APP_REGISTRATIONS: AppRegistration[] = [
  {
    id: "app-reg-001",
    displayName: "Enterprise ERP Backend Service",
    appId: "77a1bc82-3bf9-47bb-bcde-3dbf3d24ab5a",
    objectId: "1a8f93cd-928d-4be9-aff2-9831d10fb9d2",
    signInAudience: "AzureADMyOrg",
    redirectUris: [
      { type: "Web", uri: "https://erp-portal.internal.contoso.com/auth/callback" },
      { type: "Web", uri: "https://localhost:5001/signin-oidc" }
    ],
    clientSecrets: [
      {
        id: "sec-001",
        description: "Primary Production Secret",
        expiresOn: "2027-12-31",
        valueHint: "4jK~...",
        createdOn: "2026-01-01"
      },
      {
        id: "sec-002",
        description: "Dev Sandbox Access Key",
        expiresOn: "2026-08-15",
        valueHint: "qR3~...",
        createdOn: "2026-02-15"
      }
    ],
    apiPermissions: [
      {
        id: "perm-001",
        resourceApp: "Microsoft Graph",
        permission: "Directory.ReadWrite.All",
        type: "Role",
        adminConsentRequired: true,
        adminConsentGranted: true
      },
      {
        id: "perm-002",
        resourceApp: "Microsoft Graph",
        permission: "User.Read",
        type: "Scope",
        adminConsentRequired: false,
        adminConsentGranted: true
      },
      {
        id: "perm-003",
        resourceApp: "Microsoft Graph",
        permission: "Group.ReadWrite.All",
        type: "Role",
        adminConsentRequired: true,
        adminConsentGranted: false
      }
    ],
    appRoles: [
      {
        id: "role-001",
        displayName: "ERP.SuperAdmin",
        value: "ERP.SuperAdmin",
        description: "Full read-write administrator access to all administrative modules within the ERP backend suite.",
        allowedMemberTypes: ["User", "Application"],
        isEnabled: true
      },
      {
        id: "role-002",
        displayName: "ERP.ReadOnlyReader",
        value: "ERP.ReadOnlyReader",
        description: "Read-only access to custom tenant ledger reports and customer records.",
        allowedMemberTypes: ["User"],
        isEnabled: true
      }
    ],
    createdDateTime: "2025-10-12T08:31:00Z",
    notes: "Main service principal daemon utilized by Contoso global scheduler system. Must maintain high security compliance.",
    rbacAssignments: [
      {
        id: "rbac-001",
        roleName: "Owner",
        scopeType: "Subscription",
        scopePath: "/subscriptions/fedcba98-7654-3210-fedc-ba9876543210"
      },
      {
        id: "rbac-002",
        roleName: "Key Vault Secrets Officer",
        scopeType: "ResourceGroup",
        scopePath: "/subscriptions/fedcba98-7654-3210-fedc-ba9876543210/resourceGroups/rg-enterprise-prod"
      }
    ]
  },
  {
    id: "app-reg-002",
    displayName: "Customer Loyalty SPA Portal",
    appId: "3df9921c-cb8d-4cc1-9c3f-91cb2410bc93",
    objectId: "fa249a01-443b-4771-93fd-f91bdf1292fa",
    signInAudience: "AzureADMultipleOrgs",
    redirectUris: [
      { type: "SPA", uri: "https://loyalty.contoso.com" },
      { type: "SPA", uri: "https://localhost:3000" }
    ],
    clientSecrets: [], // SPA applications must not hold secrets
    apiPermissions: [
      {
        id: "perm-004",
        resourceApp: "Microsoft Graph",
        permission: "User.Read",
        type: "Scope",
        adminConsentRequired: false,
        adminConsentGranted: true
      },
      {
        id: "perm-005",
        resourceApp: "Microsoft Graph",
        permission: "User.ReadBasic.All",
        type: "Scope",
        adminConsentRequired: false,
        adminConsentGranted: true
      }
    ],
    appRoles: [],
    createdDateTime: "2026-03-04T12:05:00Z",
    notes: "Multi-tenant single page application using MSAL.js for customer loyalty redemption catalogs.",
    rbacAssignments: [
      {
        id: "rbac-003",
        roleName: "Reader",
        scopeType: "ResourceGroup",
        scopePath: "/subscriptions/fedcba98-7654-3210-fedc-ba9876543210/resourceGroups/rg-loyalty-dev"
      }
    ]
  },
  {
    id: "app-reg-003",
    displayName: "Partner Sync CLI Agent",
    appId: "9c12bada-cb24-4f0e-a3bb-a51bda82845c",
    objectId: "5bba982e-9d0d-451e-913a-ffdc1215b22a",
    signInAudience: "AzureADMyOrg",
    redirectUris: [
      { type: "PublicClient", uri: "https://login.microsoftonline.com/common/oauth2/nativeclient" }
    ],
    clientSecrets: [
      {
        id: "sec-003",
        description: "CLI Interactive Key (Deprecated)",
        expiresOn: "2025-05-30",
        valueHint: "z8F~...",
        createdOn: "2024-05-30"
      }
    ],
    apiPermissions: [
      {
        id: "perm-006",
        resourceApp: "Microsoft Graph",
        permission: "Mail.Send",
        type: "Scope",
        adminConsentRequired: true,
        adminConsentGranted: false
      }
    ],
    appRoles: [],
    createdDateTime: "2024-05-30T14:22:00Z",
    notes: "Native terminal application used by external supply-chain partners to publish inventory reports.",
    rbacAssignments: [
      {
        id: "rbac-004",
        roleName: "Storage Blob Data Contributor",
        scopeType: "Resource",
        scopePath: "/subscriptions/fedcba98-7654-3210-fedc-ba9876543210/resourceGroups/rg-shared-logistics/providers/Microsoft.Storage/storageAccounts/saexternalpartners"
      }
    ]
  }
];

export const DEFAULT_SECURITY_GROUPS: SecurityGroup[] = [
  {
    id: "group-001",
    displayName: "All US Corporate Employees",
    description: "Dynamic group aggregating all active standard users based in the United States region.",
    groupType: "Security",
    membershipType: "dynamic",
    membershipRule: "(user.country -eq \"United States\") -and (user.userType -eq \"Member\") -and (user.accountEnabled -eq true)",
    membershipRuleProcessingState: "On",
    mailEnabled: false,
    securityEnabled: true,
    mailNickname: "all_us_staff",
    members: [
      { id: "usr-001", displayName: "Sarah Jenkins", type: "User", email: "sarah.jenkins@contoso.com" },
      { id: "usr-002", displayName: "David Miller", type: "User", email: "david.miller@contoso.com" },
      { id: "usr-003", displayName: "Arun Sharma", type: "User", email: "arun.sharma@contoso.com" }
    ],
    owners: [
      { id: "usr-010", displayName: "Global IT Admin", type: "User", email: "itadmin@contoso.com" }
    ],
    createdDateTime: "2024-01-15T09:00:00Z",
    rbacAssignments: [
      {
        id: "rbac-grp-001",
        roleName: "Reader",
        scopeType: "Subscription",
        scopePath: "/subscriptions/fedcba98-7654-3210-fedc-ba9876543210"
      }
    ]
  },
  {
    id: "group-002",
    displayName: "High-Privilege Security Admins",
    description: "Assigned security group specifying personnel authorized to alter global risk alerts and system governance policies.",
    groupType: "Security",
    membershipType: "assigned",
    membershipRule: null,
    membershipRuleProcessingState: "Off",
    mailEnabled: false,
    securityEnabled: true,
    members: [
      { id: "usr-004", displayName: "Elena Petrova", type: "User", email: "elena.petrova@contoso.com" },
      { id: "app-reg-001", displayName: "Enterprise ERP Backend Service", type: "ServicePrincipal" }
    ],
    owners: [
      { id: "usr-004", displayName: "Elena Petrova", type: "User", email: "elena.petrova@contoso.com" }
    ],
    createdDateTime: "2025-06-12T15:45:00Z",
    rbacAssignments: [
      {
        id: "rbac-grp-002",
        roleName: "Owner",
        scopeType: "Subscription",
        scopePath: "/subscriptions/fedcba98-7654-3210-fedc-ba9876543210"
      },
      {
        id: "rbac-grp-003",
        roleName: "User Access Administrator",
        scopeType: "ResourceGroup",
        scopePath: "/subscriptions/fedcba98-7654-3210-fedc-ba9876543210/resourceGroups/rg-enterprise-prod"
      }
    ]
  },
  {
    id: "group-003",
    displayName: "Retail Sales Department",
    description: "Dynamic distribution security group tracking users assigned strictly to retail branches sales associates.",
    groupType: "Microsoft 365",
    membershipType: "dynamic",
    membershipRule: "(user.department -eq \"Retail\") -and (user.jobTitle -contains \"Associate\")",
    membershipRuleProcessingState: "On",
    mailEnabled: true,
    securityEnabled: true,
    mailNickname: "retail_sales",
    members: [
      { id: "usr-006", displayName: "Marcus Aurelius", type: "User", email: "marcus.a@contoso.com" },
      { id: "usr-007", displayName: "Li Wei", type: "User", email: "li.wei@contoso.com" }
    ],
    owners: [
      { id: "usr-001", displayName: "Sarah Jenkins", type: "User", email: "sarah.jenkins@contoso.com" }
    ],
    createdDateTime: "2025-11-20T11:00:00Z"
  },
  {
    id: "group-004",
    displayName: "Contoso Contractors External",
    description: "Manual assignment group containing guest users, vendors, and contingent workforce staff.",
    groupType: "Security",
    membershipType: "assigned",
    membershipRule: null,
    membershipRuleProcessingState: "Off",
    mailEnabled: false,
    securityEnabled: true,
    members: [
      { id: "usr-050", displayName: "John Doe (Guest)", type: "User", email: "johndoe_gmail.com#EXT#@contoso.onmicrosoft.com" },
      { id: "usr-051", displayName: "Sato Takahashi (Vendor)", type: "User", email: "sato.t_partner.com#EXT#@contoso.onmicrosoft.com" }
    ],
    owners: [
      { id: "usr-002", displayName: "David Miller", type: "User", email: "david.miller@contoso.com" }
    ],
    createdDateTime: "2026-02-01T14:00:00Z"
  }
];

export const DYNAMIC_RULE_OPERATORS = [
  { value: "-eq", label: "Equals ( -eq )", desc: "True if value matches property precisely" },
  { value: "-ne", label: "Not Equals ( -ne )", desc: "True if value does not match" },
  { value: "-contains", label: "Contains ( -contains )", desc: "Used for multi-value collections or string matches" },
  { value: "-notContains", label: "Not Contains ( -notContains )", desc: "Negation of contains" },
  { value: "-startsWith", label: "Starts With ( -startsWith )", desc: "True if string property begins with criteria" },
  { value: "-match", label: "Regex Match ( -match )", desc: "Performs regular expression validation" }
];

export const DYNAMIC_RULE_PROPERTIES = [
  { value: "user.objectId", label: "User Object ID" },
  { value: "user.department", label: "Department" },
  { value: "user.country", label: "Country" },
  { value: "user.jobTitle", label: "Job Title" },
  { value: "user.userType", label: "User Type (Member/Guest)" },
  { value: "user.accountEnabled", label: "Account Enabled (True/False)" },
  { value: "user.companyName", label: "Company Name" },
  { value: "user.city", label: "City" },
  { value: "device.deviceOSVersion", label: "Device OS Version" },
  { value: "device.deviceOwnership", label: "Device Ownership (Corporate/Personal)" },
  { value: "device.isManaged", label: "Device Management Status" }
];

export const MICROSOFT_GRAPH_SCOPES = [
  { scope: "User.Read", desc: "Allows users to sign in and read their profile picture, name, and basic contact info.", adminConsent: false },
  { scope: "User.ReadBasic.All", desc: "Allows reading a basic set of profile properties of other users in the organization.", adminConsent: false },
  { scope: "User.ReadWrite.All", desc: "Allows full profile updates of any directory member.", adminConsent: true },
  { scope: "Directory.Read.All", desc: "Allows full read-only queries of organization registry, applications, and group policies.", adminConsent: true },
  { scope: "Directory.ReadWrite.All", desc: "Full read-write permissions over Directory resources. High sensitivity.", adminConsent: true },
  { scope: "Group.Read.All", desc: "Allows reading groups, membership, dynamic rules.", adminConsent: true },
  { scope: "Group.ReadWrite.All", desc: "Allows creating, reading, updating and deleting groups resources on behalf of the service.", adminConsent: true },
  { scope: "Mail.Send", desc: "Allows application or delegated scopes to send emails as users in the directory.", adminConsent: true },
  { scope: "Mail.Read", desc: "Allows reading organization mailboxes.", adminConsent: true }
];
