import { useAuthStore } from '../../store/useAuthStore';
import { Navigate, Outlet } from 'react-router-dom';
import logo from '../../assets/logo.png';

function AuthLayout() {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left decorative section with logo and stylized background */}
            <div className="hidden md:flex md:w-1/2 bg-slate-900 flex-col items-center justify-center p-8 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute h-24 w-24 rounded-full bg-sky-500 top-1/4 left-1/4"></div>
                    <div className="absolute h-36 w-36 rounded-full bg-sky-600 bottom-1/3 right-1/4"></div>
                    <div className="absolute h-16 w-16 rounded-full bg-sky-400 top-1/3 right-1/3"></div>
                    <div className="absolute h-20 w-20 rounded-full bg-sky-300 bottom-1/4 left-1/3"></div>
                    
                    {/* Connection lines */}
                    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <line x1="25%" y1="25%" x2="66%" y2="33%" style={{ stroke: '#0ea5e9', strokeWidth: 1 }} />
                        <line x1="66%" y1="33%" x2="75%" y2="66%" style={{ stroke: '#0ea5e9', strokeWidth: 1 }} />
                        <line x1="75%" y1="66%" x2="33%" y2="75%" style={{ stroke: '#0ea5e9', strokeWidth: 1 }} />
                        <line x1="33%" y1="75%" x2="25%" y2="25%" style={{ stroke: '#0ea5e9', strokeWidth: 1 }} />
                    </svg>
                </div>
                
                {/* Logo and text */}
                <div className="z-10 text-center">
                    <img src={logo} alt="Maxjob Africa Logo" className="w-52 mx-auto mb-8" />
                    <h1 className="text-white text-3xl font-bold mb-4">Maxjob Africa</h1>
                    <p className="text-sky-200 max-w-md text-center">
                        Access your admin dashboard to manage jobs, users, and applications all in one place.
                    </p>
                </div>
            </div>
            
            {/* Right content section */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile logo - only shown on mobile */}
                    <div className="block md:hidden text-center mb-8">
                        <img src={logo} alt="Maxjob Africa Logo" className="h-16 mx-auto" />
                    </div>
                    
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AuthLayout