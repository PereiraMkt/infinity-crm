
import MainLayout from "../components/layout/MainLayout";
import DashboardPlaceholder from "../components/placeholder/DashboardPlaceholder";
import CustomersPlaceholder from "../components/placeholder/CustomersPlaceholder";
import SalesPlaceholder from "../components/placeholder/SalesPlaceholder";

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium text-gray-700">Welcome to infinity-crm</h2>
          <p className="text-gray-500">Your blank CRM project is ready for development</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardPlaceholder />
          <CustomersPlaceholder />
          <SalesPlaceholder />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
