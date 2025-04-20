
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Node } from "reactflow";

interface NodeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNode: Node | null;
  onDelete: () => void;
}

const NodeDialog = ({ isOpen, onOpenChange, selectedNode, onDelete }: NodeDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar Nó</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar o nó selecionado? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NodeDialog;
