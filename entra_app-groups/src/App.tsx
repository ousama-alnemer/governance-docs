/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Navigation, { TabType } from './components/Navigation';
import AppRegistrations from './components/AppRegistrations';
import SecurityGroups from './components/SecurityGroups';
import PermissionsExplorer from './components/PermissionsExplorer';
import ExpiryTracker from './components/ExpiryTracker';
import AuditAdvisor from './components/AuditAdvisor';
import LiveIntegration from './components/LiveIntegration';
import AzureASWADeploy from './components/AzureASWADeploy';
import { AppRegistration, SecurityGroup, AuditFinding, LiveConnectionConfig } from './types';
import { DEFAULT_APP_REGISTRATIONS, DEFAULT_SECURITY_GROUPS } from './data/defaultData';
import { ShieldAlert, Terminal, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('apps');
  const [apps, setApps] = useState<AppRegistration[]>(DEFAULT_APP_REGISTRATIONS);
  const [groups, setGroups] = useState<SecurityGroup[]>(DEFAULT_SECURITY_GROUPS);
  const [findings, setFindings] = useState<AuditFinding[]>([]);
  const [connection, setConnection] = useState<LiveConnectionConfig>({
    tenantId: '',
    clientId: '',
    clientSecret: '',
    isConnected: false
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased selection:bg-blue-600/30 selection:text-white">
      {/* Platform Header Navigation */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        auditCount={findings.length}
      />

      {/* Main Panel Content container */}
      <main className="flex-grow">
        {activeTab === 'apps' && (
          <AppRegistrations apps={apps} setApps={setApps} />
        )}
        {activeTab === 'groups' && (
          <SecurityGroups groups={groups} setGroups={setGroups} />
        )}
        {activeTab === 'permissions' && (
          <PermissionsExplorer apps={apps} setApps={setApps} />
        )}
        {activeTab === 'expiry' && (
          <ExpiryTracker apps={apps} setApps={setApps} />
        )}
        {activeTab === 'audit' && (
          <AuditAdvisor 
            apps={apps} 
            groups={groups} 
            findings={findings} 
            setFindings={setFindings} 
          />
        )}
        {activeTab === 'live' && (
          <LiveIntegration 
            connection={connection} 
            setConnection={setConnection} 
          />
        )}
        {activeTab === 'azure' && (
          <AzureASWADeploy />
        )}
      </main>

      {/* Platform Footer Information panel */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-slate-600" />
            <span>Microsoft Entra ID Resource manager, Powered by AI Studio & Gemini 3.5</span>
          </div>
          <p className="font-mono text-[10px] text-slate-600">
            System status: standby &bull; Sandboxed Directory Active &bull; Time: 2026.06.07
          </p>
        </div>
      </footer>
    </div>
  );
}

