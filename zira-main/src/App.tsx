import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  
  // Use useRef to persist timer references across renders
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningShownRef = useRef(false);
  const lastActivityRef = useRef(Date.now());

  // Handle logout function
  const handleLogout = useCallback(async () => {
    console.log('Logging out due to inactivity...');
    
    // Clear timers first
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    warningShownRef.current = false;
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged out due to inactivity');
      setUser(null);
      setSession(null);
    }
    toast.dismiss();
  }, []);

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    warningShownRef.current = false;
    toast.dismiss('inactivity-warning');
  }, []);

  // Reset inactivity timer function
  const resetInactivityTimer = useCallback(() => {
    // Don't set timers if not logged in
    if (!session) return;
    
    console.log('Resetting inactivity timer...');
    lastActivityRef.current = Date.now();
    
    // Clear existing timers and toasts
    clearTimers();

    // Set warning timer for 2.5 minutes (150000 ms)
    warningTimerRef.current = setTimeout(() => {
      console.log('Showing inactivity warning...');
      if (!warningShownRef.current && session) {
        toast('You will be logged out due to inactivity in 30 seconds', { 
          icon: '⚠️',
          id: 'inactivity-warning',
          duration: 30000
        });
        warningShownRef.current = true;
      }
    }, 150000); // 2.5 minutes
    
    // Set logout timer for 3 minutes (180000 ms)
    inactivityTimerRef.current = setTimeout(() => {
      console.log('Auto-logout timer triggered');
      if (session) {
        handleLogout();
      }
    }, 180000); // 3 minutes
    
  }, [session, handleLogout, clearTimers]);

  // Throttled activity handler to prevent excessive timer resets
  const lastResetRef = useRef(0);
  const handleActivity = useCallback(() => {
    const now = Date.now();
    // Only reset timer if more than 1 second has passed since last reset
    if (now - lastResetRef.current > 1000) {
      lastResetRef.current = now;
      resetInactivityTimer();
    }
  }, [resetInactivityTimer]);

  useEffect(() => {
    console.log('Setting up auth and activity listeners...');
    
    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session ? 'Found session' : 'No session');
      setSession(session);
      setAuthChecked(true);
      
      if (session?.user?.email) {
        setUser({
          email: session.user.email,
          role: 'administrator'
        });
        // Start inactivity timer when session exists
        setTimeout(() => resetInactivityTimer(), 100);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session ? 'Session exists' : 'No session');
      setSession(session);
      setAuthChecked(true);
      
      if (session?.user?.email) {
        setUser({
          email: session.user.email,
          role: 'administrator'
        });
        // Reset timer on auth state change (login)
        setTimeout(() => resetInactivityTimer(), 100);
      } else {
        setUser(null);
        clearTimers();
      }
    });

    return () => {
      console.log('Cleaning up auth subscription...');
      subscription.unsubscribe();
      clearTimers();
    };
  }, []); // Remove dependencies to prevent recreation

  // Separate effect for activity listeners
  useEffect(() => {
    if (!session) return;

    console.log('Setting up activity listeners...');
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      console.log('Cleaning up activity listeners...');
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [session, handleActivity]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

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