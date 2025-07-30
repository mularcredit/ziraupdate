import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import EmployeeList from './components/Employees/EmployeeList';
import PayrollDashboard from './components/Payroll/PayrollDashboard';
import RecruitmentDashboard from './components/Recruitment/RecruitmentDashboard';
import toast, { Toaster } from 'react-hot-toast';
import PerformanceDashboard from './components/Perfomance/PerfomanceDashboard';
import { supabase } from './lib/supabase';
import Login from '../src/pages/Login';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [session, setSession] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);
  const [warningTimer, setWarningTimer] = useState<NodeJS.Timeout | null>(null);

  // Reset inactivity timer function
  const resetInactivityTimer = useCallback(() => {
    // Clear existing timers
    if (inactivityTimer) clearTimeout(inactivityTimer);
    if (warningTimer) clearTimeout(warningTimer);
    
    // Set warning timer for 2.5 minutes (150000 ms)
    const newWarningTimer = setTimeout(() => {
      toast('You will be logged out due to inactivity in 30 seconds', { 
        icon: '⚠️',
        duration: 30000
      });
    }, 150000);
    
    // Set logout timer for 3 minutes (180000 ms)
    const newInactivityTimer = setTimeout(() => {
      handleLogout();
      toast('You were automatically logged out due to inactivity', { 
        icon: '⏳',
        duration: 5000
      });
    }, 180000);
    
    setWarningTimer(newWarningTimer);
    setInactivityTimer(newInactivityTimer);
  }, [inactivityTimer, warningTimer]);

  // Handle logout function
  const handleLogout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged out successfully');
      setUser(null);
      setSession(null);
    }
    // Clear timers on logout
    if (inactivityTimer) clearTimeout(inactivityTimer);
    if (warningTimer) clearTimeout(warningTimer);
  }, [inactivityTimer, warningTimer]);

  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthChecked(true);
      
      if (session?.user?.email) {
        setUser({
          email: session.user.email,
          role: 'administrator'
        });
        // Start inactivity timer when session exists
        resetInactivityTimer();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthChecked(true);
      
      if (session?.user?.email) {
        setUser({
          email: session.user.email,
          role: 'administrator'
        });
        // Reset timer on auth state change (login)
        resetInactivityTimer();
      } else {
        setUser(null);
        // Clear timers on logout
        if (inactivityTimer) clearTimeout(inactivityTimer);
        if (warningTimer) clearTimeout(warningTimer);
      }
    });

    // Set up activity event listeners if session exists
    if (session) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      
      const handleActivity = () => {
        resetInactivityTimer();
      };

      events.forEach(event => {
        window.addEventListener(event, handleActivity);
      });

      return () => {
        subscription.unsubscribe();
        events.forEach(event => {
          window.removeEventListener(event, handleActivity);
        });
        if (inactivityTimer) clearTimeout(inactivityTimer);
        if (warningTimer) clearTimeout(warningTimer);
      };
    }

    return () => {
      subscription.unsubscribe();
      if (inactivityTimer) clearTimeout(inactivityTimer);
      if (warningTimer) clearTimeout(warningTimer);
    };
  }, [resetInactivityTimer, inactivityTimer, warningTimer, session]);

  const renderContent = () => {
    if (!authChecked) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      );
    }

    if (!session) {
      return <Login onLoginSuccess={() => window.location.reload()} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'employees':
        return <EmployeeList />;
      case 'payroll':
        return <PayrollDashboard />;
      case 'recruitment':
        return <RecruitmentDashboard />;
      case 'leaves':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-4">Leave Management</h1>
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8 text-center">
              <p className="text-gray-400">Leave management module coming soon...</p>
            </div>
          </div>
        );
      case 'performance':
        return <PerformanceDashboard />;
      case 'training':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-4">Training & Development</h1>
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8 text-center">
              <p className="text-gray-400">Training management module coming soon...</p>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-4">Reports & Analytics</h1>
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8 text-center">
              <p className="text-gray-400">Reports module coming soon...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-4">System Settings</h1>
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-8 text-center">
              <p className="text-gray-400">Settings module coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {session ? (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-100/30 via-transparent to-transparent"></div>
          
          <div className="relative flex">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
            
            <div className="flex-1">
              <Header 
                user={user} 
                onLogout={handleLogout}
              />
              
              <main className="overflow-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderContent()}
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>
          </div>
        </>
      ) : (
        renderContent()
      )}
      
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;