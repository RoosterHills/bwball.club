import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import SiteLayout from '@/components/site/SiteLayout';
import Home from '@/pages/Home';
import TeamHub from '@/pages/TeamHub';
import Schedule from '@/pages/Schedule';
import RegistrationCenter from '@/pages/RegistrationCenter';
import GameChangerHub from '@/pages/GameChangerHub';
import VolunteerCenter from '@/pages/VolunteerCenter';
import ParentResources from '@/pages/ParentResources';
import SponsorCenter from '@/pages/SponsorCenter';
import News from '@/pages/News';
import CoachesCorner from '@/pages/CoachesCorner';
import Admin from '@/pages/Admin';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/teams/:teamId" element={<TeamHub />} />
        <Route path="/:slug" element={<TeamHub />} />
        <Route path="/:sport/:slug" element={<TeamHub />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/register" element={<RegistrationCenter />} />
        <Route path="/gamechanger" element={<GameChangerHub />} />
        <Route path="/volunteer" element={<VolunteerCenter />} />
        <Route path="/parents" element={<ParentResources />} />
        <Route path="/sponsors" element={<SponsorCenter />} />
        <Route path="/news" element={<News />} />
        <Route path="/coaches" element={<CoachesCorner />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App