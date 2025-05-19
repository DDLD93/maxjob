import { createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Lazy-loaded components
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout'));
const AuthLayout = lazy(() => import('./pages/Auth/AuthLayout'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/Auth/ForgotPasswordPage'));
const AuthCallback = lazy(() => import('./pages/Auth/AuthCallback'));

// Main pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const JobDetailsPage = lazy(() => import('./pages/JobDetailsPage'));
const SeminarsPage = lazy(() => import('./pages/SeminarsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));
const PageLoader = lazy(() => import('./components/pageLoader'));
const SavedJobsPage = lazy(() => import('./pages/SavedJobsPage'));
const ApplicationsPage = lazy(() => import('./pages/ApplicationsPage'));
const LearningPage = lazy(() => import('./pages/LearningPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));

const router = createBrowserRouter([
    {
        path: "auth",
        element: <Suspense fallback={<PageLoader />}><AuthLayout /></Suspense>,
        errorElement: <Suspense fallback={<PageLoader />}><ErrorPage /></Suspense>,
        children: [
            {
                path: "login",
                element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense>,
            },
            {
                path: "register",
                element: <Suspense fallback={<PageLoader />}><RegisterPage /></Suspense>,
            },
            {
                path: "forgot-password",
                element: <Suspense fallback={<PageLoader />}><ForgotPasswordPage /></Suspense>,
            },
            {
                path: "reset-password",
                element: <Suspense fallback={<PageLoader />}><ForgotPasswordPage /></Suspense>,
            },
        ]
    },
    {
        path: "auth/callback",
        element: <Suspense fallback={<PageLoader />}><AuthCallback /></Suspense>,
        errorElement: <Suspense fallback={<PageLoader />}><ErrorPage /></Suspense>,
    },
    {
        path: "/",
        element: <Suspense fallback={<PageLoader />}><DashboardLayout /></Suspense>,
        errorElement: <Suspense fallback={<PageLoader />}><ErrorPage /></Suspense>,
        children: [
            {
                path: "/",
                index: true,
                element: <Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>,
            },
            {
                path: "explore",
                element: <Suspense fallback={<PageLoader />}><ExplorePage /></Suspense>,
            },
            {
                path: "profile",
                element: <Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>,
            },
            {
                path: "saved-jobs",
                element: <Suspense fallback={<PageLoader />}><SavedJobsPage /></Suspense>,
            },
            {
                path: "applications",
                element: <Suspense fallback={<PageLoader />}><ApplicationsPage /></Suspense>,
            },
            {
                path: "jobs/:id",
                element: <Suspense fallback={<PageLoader />}><JobDetailsPage /></Suspense>,
            },
            {
                path: "seminars",
                element: <Suspense fallback={<PageLoader />}><SeminarsPage /></Suspense>,
            },
            {
                path: "seminars/:id",
                element: <Suspense fallback={<PageLoader />}><SeminarsPage /></Suspense>,
            },
            {
                path: "learning",
                element: <Suspense fallback={<PageLoader />}><LearningPage /></Suspense>,
            },
            {
                path: "notifications",
                element: <Suspense fallback={<PageLoader />}><NotificationsPage /></Suspense>,
            },
            {
                path: "settings",
                element: <Suspense fallback={<PageLoader />}><NotFoundPage title="Settings" /></Suspense>,
            },
            {
                path: "*",
                element: <Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense>,
            }
        ]
    }
]);

export default router;

