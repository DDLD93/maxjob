import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface TransitionWrapperProps {
  children: ReactNode;
}

const TransitionWrapper = ({ children }: TransitionWrapperProps) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('page-enter');

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage('page-exit');
      
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('page-enter');
      }, 300); // Match the duration in CSS
      
      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation]);

  useEffect(() => {
    if (transitionStage === 'page-enter') {
      const enterTimeout = setTimeout(() => {
        setTransitionStage('page-enter-active');
      }, 10);
      
      return () => clearTimeout(enterTimeout);
    }
  }, [transitionStage]);

  return (
    <div className={`transition-wrapper ${transitionStage}`}>
      {children}
    </div>
  );
};

export default TransitionWrapper; 