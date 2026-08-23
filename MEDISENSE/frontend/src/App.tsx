import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import FullScreenLoader from './components/ui/FullScreenLoader';

const LandingPage = lazy(() => import('./pages/Landing/LandingPage'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/Auth/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/Auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/Auth/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('./pages/Auth/VerifyEmailPage'));

const OnboardingPage = lazy(() => import('./pages/Onboarding/OnboardingPage'));

const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage'));
const AnalysisHistoryPage = lazy(() => import('./pages/Analysis/AnalysisHistoryPage'));
const AnalysisDetailPage = lazy(() => import('./pages/Analysis/AnalysisDetailPage'));
const ChatPage = lazy(() => import('./pages/Chat/ChatPage'));
const ReportsPage = lazy(() => import('./pages/Reports/ReportsPage'));
const ClinicsPage = lazy(() => import('./pages/Clinics/ClinicsPage'));
const QuizPage = lazy(() => import('./pages/Quiz/QuizPage'));
const QuizAttemptPage = lazy(() => import('./pages/Quiz/QuizAttemptPage'));
const ArticlesPage = lazy(() => import('./pages/Articles/ArticlesPage'));
const ArticleDetailPage = lazy(() => import('./pages/Articles/ArticleDetailPage'));
const AnalyticsPage = lazy(() => import('./pages/Analytics/AnalyticsPage'));
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'));
const ConditionsPage = lazy(() => import('./pages/Conditions/ConditionsPage'));
const ConditionDetailPage = lazy(() => import('./pages/Conditions/ConditionDetailPage'));
const SearchResultsPage = lazy(() => import('./pages/Search/SearchResultsPage'));

const AdminDashboardPage = lazy(() => import('./pages/Admin/AdminDashboardPage'));

const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const App: React.FC = () => {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

        {/* Onboarding (auth required, onboarding not required) */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* App (auth + onboarding required) */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/analysis" element={<ProtectedRoute><AnalysisHistoryPage /></ProtectedRoute>} />
        <Route path="/analysis/:id" element={<ProtectedRoute><AnalysisDetailPage /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/chat/:id" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/clinics" element={<ProtectedRoute><ClinicsPage /></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
        <Route path="/quiz/:id" element={<ProtectedRoute><QuizAttemptPage /></ProtectedRoute>} />
        <Route path="/articles" element={<ProtectedRoute><ArticlesPage /></ProtectedRoute>} />
        <Route path="/articles/:slug" element={<ProtectedRoute><ArticleDetailPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/conditions" element={<ProtectedRoute><ConditionsPage /></ProtectedRoute>} />
        <Route path="/conditions/:slug" element={<ProtectedRoute><ConditionDetailPage /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchResultsPage /></ProtectedRoute>} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default App;
