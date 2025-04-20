
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col h-screen">
        {/* Empty header for future implementation */}
        <header className="h-16 border-b flex items-center px-6">
          <h1 className="text-xl font-semibold text-gray-800">infinity-crm</h1>
        </header>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Empty sidebar for future implementation */}
          <aside className="w-64 border-r hidden md:block">
            <div className="p-4">
              {/* Sidebar content will go here */}
            </div>
          </aside>
          
          {/* Main content area */}
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
