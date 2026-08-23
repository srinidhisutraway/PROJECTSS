import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import FloatingCameraButton from '../analysis/FloatingCameraButton';

const DashboardLayout: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-canvas dark:bg-canvas-dark">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar title={title} />
        <main className="mx-auto max-w-6xl px-6 py-8 pb-28">{children}</main>
      </div>
      <FloatingCameraButton />
    </div>
  );
};

export default DashboardLayout;
