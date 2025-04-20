
import StatsSection from "@/components/dashboard/StatsSection";
import SalesChart from "@/components/dashboard/SalesChart";
import FunnelChart from "@/components/dashboard/FunnelChart";
import FinanceChart from "@/components/dashboard/FinanceChart";
import ActivitiesSection from "@/components/dashboard/ActivitiesSection";
import IntegratedFunnel from "@/components/dashboard/IntegratedFunnel";
import { mockSalesData, mockFunnelData, mockTodayActivities } from "@/data/mockData";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <StatsSection />
      
      {/* First row - Sales Chart (Vendas do mês) 100% width */}
      <div className="grid grid-cols-1 gap-6">
        <SalesChart data={mockSalesData} />
      </div>
      
      {/* Second row - Funnel Chart (Conversão de Funil) 100% width */}
      <div className="grid grid-cols-1 gap-6">
        <FunnelChart data={mockFunnelData} />
      </div>
      
      {/* Third row - Finance Chart (DRE Simplificado) 50% + Integrated Funnel 50% */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 order-2 lg:order-1">
          <FinanceChart />
        </div>
        <div className="lg:col-span-2 order-1 lg:order-2">
          <IntegratedFunnel />
        </div>
      </div>
      
      {/* Fourth row - Activities 100% */}
      <div className="grid grid-cols-1 gap-6">
        <ActivitiesSection activities={mockTodayActivities} />
      </div>
    </div>
  );
};

export default Dashboard;
