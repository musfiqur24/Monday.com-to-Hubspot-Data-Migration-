import React, { useState, useCallback, useEffect } from 'react'
import { ToastProvider, useToast } from './context/ToastContext.jsx'
import { Topbar } from './components/layout/Topbar.jsx'
import { Sidebar } from './components/layout/Sidebar.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { DataMigrate } from './pages/hubspot/DataMigrate.jsx'
import { AssociationMigration } from './pages/hubspot/AssociationMigration.jsx'
import { MondayMigration } from './pages/monday/MondayMigration.jsx'
import { MigrationHistory } from './pages/MigrationHistory.jsx'

function AppInner() {
  const { showToast } = useToast();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [mondayStep, setMondayStep] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let es = null;

    function connect() {
      try {
        es = new EventSource('/api/progress');
        es.onopen = () => setIsConnected(true);
        es.onerror = () => setIsConnected(false);
      } catch {
        setIsConnected(false);
      }
    }

    connect();

    // Heartbeat check so connection dot reflects real server status even if SSE buffers
    const checkStatus = () => {
      fetch('/api/status')
        .then((r) => {
          if (r.ok) setIsConnected(true);
        })
        .catch(() => setIsConnected(false));
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);

    return () => {
      es?.close();
      clearInterval(interval);
    };
  }, []);

  const handleSelectModule = useCallback((module) => {
    setActiveModule(module);
  }, []);

  const handleSelectMondayStep = useCallback((step) => {
    setActiveModule('monday');
    setMondayStep(step);
  }, []);

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard key={activeModule} onShowToast={showToast} />;
      case 'data-migrate':
        return <DataMigrate key={activeModule} onShowToast={showToast} />;
      case 'data-migrate-association':
        return <AssociationMigration key={activeModule} onShowToast={showToast} />;
      case 'monday':
        return <MondayMigration key={activeModule} onShowToast={showToast} initialStep={mondayStep} onStepChange={setMondayStep} />;
      case 'history':
        return <MigrationHistory key={activeModule} onShowToast={showToast} />;
      case 'dashboard':
      default:
        return <Dashboard key={activeModule} onShowToast={showToast} />;
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <Topbar activeModule={activeModule} isConnected={isConnected} />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar
          activeModule={activeModule}
          onSelectModule={handleSelectModule}
          mondayStep={mondayStep}
          onSelectMondayStep={handleSelectMondayStep}
        />
        <main className="flex-1 min-h-0 overflow-y-auto bg-slate-50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}
