
import { Filter, Plus, Download, PieChart } from "lucide-react";
import { SectionHeader, ActionButton } from "@/components/ui/section-header";
import { FilterMenu } from "./FilterMenu";
import { useToast } from "@/hooks/use-toast";

interface FunnelHeaderProps {
  showAnalytics: boolean;
  setShowAnalytics: (show: boolean) => void;
  filterMenuOpen: boolean;
  setFilterMenuOpen: (open: boolean) => void;
  onAddNewLead: () => void;
}

export const FunnelHeader = ({
  showAnalytics,
  setShowAnalytics,
  filterMenuOpen,
  setFilterMenuOpen,
  onAddNewLead
}: FunnelHeaderProps) => {
  const { toast } = useToast();
  
  return (
    <SectionHeader 
      title="Funil de Vendas" 
      description="Gerencie seus leads e oportunidades"
      actions={
        <>
          <FilterMenu 
            open={filterMenuOpen} 
            onOpenChange={setFilterMenuOpen} 
          />
          
          <ActionButton
            icon={<PieChart size={16} />}
            label="Analytics"
            onClick={() => setShowAnalytics(!showAnalytics)}
            variant={showAnalytics ? "default" : "outline"}
          />
          
          <ActionButton
            icon={<Download size={16} />}
            label="Exportar"
            onClick={() => {
              toast({
                title: "Exportação iniciada",
                description: "O arquivo será baixado em instantes",
              });
            }}
            variant="outline"
          />
          
          <ActionButton
            icon={<Plus size={16} />}
            label="Novo Lead"
            onClick={onAddNewLead}
          />
        </>
      }
    />
  );
};
