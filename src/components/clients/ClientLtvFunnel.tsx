
import React, { useState } from "react";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import { KanbanColumnItem } from "@/components/kanban/types";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const initialColumns: KanbanColumnItem[] = [
  {
    id: "ltv-new",
    title: "Novos Clientes",
    cards: [
      {
        id: "ltv-card-1",
        title: "Empresa ABC",
        description: "Primeiro contrato de serviços",
        tags: [
          { label: "Tecnologia", color: "bg-blue-100 text-blue-800" },
          { label: "SaaS", color: "bg-green-100 text-green-800" }
        ],
        priority: "medium",
        completion: 0,
        metadata: {
          value: "R$ 2.500,00",
          assignee: "Carlos Silva",
          date: "10/04/2023"
        }
      },
      {
        id: "ltv-card-2",
        title: "Startup XYZ",
        description: "Desenvolvimento de software",
        tags: [
          { label: "Startup", color: "bg-purple-100 text-purple-800" },
          { label: "Desenvolvimento", color: "bg-cyan-100 text-cyan-800" }
        ],
        priority: "medium",
        completion: 0,
        metadata: {
          value: "R$ 8.000,00",
          assignee: "Ana Oliveira",
          date: "15/04/2023"
        }
      }
    ],
    color: "bg-gray-200 dark:bg-gray-700"
  },
  {
    id: "ltv-active",
    title: "Clientes Ativos",
    cards: [
      {
        id: "ltv-card-3",
        title: "Consultoria ABC",
        description: "Renovação de contrato mensal",
        tags: [
          { label: "Consultoria", color: "bg-yellow-100 text-yellow-800" },
          { label: "Recorrente", color: "bg-orange-100 text-orange-800" }
        ],
        priority: "medium",
        completion: 50,
        metadata: {
          value: "R$ 5.000,00/mês",
          assignee: "Marcos Souza",
          date: "Desde 01/01/2023"
        }
      },
      {
        id: "ltv-card-4",
        title: "Indústria ACME",
        description: "Contrato de manutenção",
        tags: [
          { label: "Indústria", color: "bg-blue-100 text-blue-800" },
          { label: "B2B", color: "bg-green-100 text-green-800" }
        ],
        priority: "medium",
        completion: 50,
        metadata: {
          value: "R$ 12.000,00/mês",
          assignee: "Paula Andrade",
          date: "Desde 15/02/2023"
        }
      }
    ],
    color: "bg-blue-200 dark:bg-blue-900"
  },
  {
    id: "ltv-growth",
    title: "Clientes em Crescimento",
    cards: [
      {
        id: "ltv-card-5",
        title: "TechSoft",
        description: "Expansão de serviços para novas áreas",
        tags: [
          { label: "Tecnologia", color: "bg-blue-100 text-blue-800" },
          { label: "Expansão", color: "bg-purple-100 text-purple-800" }
        ],
        priority: "medium",
        completion: 75,
        metadata: {
          value: "R$ 15.000,00/mês",
          assignee: "Roberto Alves",
          date: "Cliente desde 2022"
        }
      }
    ],
    color: "bg-purple-200 dark:bg-purple-900"
  },
  {
    id: "ltv-loyalty",
    title: "Clientes Fiéis",
    cards: [
      {
        id: "ltv-card-6",
        title: "Global Shop",
        description: "Parceiro estratégico há 5 anos",
        tags: [
          { label: "Varejo", color: "bg-pink-100 text-pink-800" },
          { label: "Parceria", color: "bg-indigo-100 text-indigo-800" }
        ],
        priority: "medium",
        completion: 90,
        metadata: {
          value: "R$ 250.000,00/ano",
          assignee: "Joana Lima",
          date: "Cliente desde 2019"
        }
      }
    ],
    color: "bg-indigo-200 dark:bg-indigo-900"
  },
  {
    id: "ltv-advocate",
    title: "Advogados da Marca",
    cards: [
      {
        id: "ltv-card-7",
        title: "Mega Corp",
        description: "Indicações frequentes, participação em cases",
        tags: [
          { label: "Corporativo", color: "bg-gray-100 text-gray-800" },
          { label: "Indicações", color: "bg-amber-100 text-amber-800" }
        ],
        priority: "medium",
        completion: 100,
        metadata: {
          value: "R$ 500.000,00/ano",
          assignee: "Felipe Costa",
          date: "Cliente desde 2018"
        }
      }
    ],
    color: "bg-amber-200 dark:bg-amber-900"
  }
];

const ClientLtvFunnel = () => {
  const [columns, setColumns] = useState<KanbanColumnItem[]>(initialColumns);

  return (
    <div className="space-y-4">
      <SectionHeader 
        title="Funil de Valor do Cliente (LTV)" 
        description="Visualize e gerencie o ciclo de vida e valor de seus clientes"
        actions={
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        }
      />
      <div className="overflow-x-auto pb-4">
        <KanbanBoard 
          columns={columns} 
          setColumns={setColumns}
        />
      </div>
    </div>
  );
};

export default ClientLtvFunnel;
