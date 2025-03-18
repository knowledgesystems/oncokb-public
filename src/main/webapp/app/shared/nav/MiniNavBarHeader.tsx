import React, { useContext, useEffect } from 'react';
import { StickyMiniNavBarContext } from './StickyMiniNavBar';

type IMiniNavBarHeader = {
  id: string;
  children: React.ReactNode;
  className?: string;
};
export default function MiniNavBarHeader({
  id,
  children,
  className = 'mt-5',
}: IMiniNavBarHeader) {
  const { invalidateCache } = useContext(StickyMiniNavBarContext);
  useEffect(() => {
    invalidateCache();
    return () => {
      invalidateCache();
    };
  }, []);
  return (
    <h3 id={id} className={className} mini-nav-bar-header="">
      {children}
    </h3>
  );
}
