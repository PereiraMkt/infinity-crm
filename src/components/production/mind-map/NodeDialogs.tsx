
import { Node, Edge } from "reactflow";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NodeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNode: Node | null;
  onDelete: () => void;
}

export const NodeDialog = ({ isOpen, onOpenChange, selectedNode, onDelete }: NodeDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Nó</DialogTitle>
          <DialogDescription>
            {selectedNode?.data?.label || "Nó sem título"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Deseja excluir este nó do seu mapa mental?
          </p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface EdgeDialogProps {
  isOpen: boolean;
  edge: Edge | null;
  onClose: () => void;
  onUpdate: (source: string, target: string) => void;
  onDelete: () => void;
}

export const EdgeDialog = ({ isOpen, edge, onClose, onUpdate, onDelete }: EdgeDialogProps) => {
  if (!isOpen || !edge) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Conexão</DialogTitle>
          <DialogDescription>
            Conexão de {edge.source} para {edge.target}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Você pode excluir esta conexão do mapa mental.
          </p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
