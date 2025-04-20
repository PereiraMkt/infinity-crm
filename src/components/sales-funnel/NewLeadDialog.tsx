
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KanbanCardItem } from "@/components/kanban/types";

interface NewLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeColumnId: string | null;
  onSave: (e: React.FormEvent) => void;
}

export const NewLeadDialog = ({ 
  open, 
  onOpenChange, 
  activeColumnId, 
  onSave 
}: NewLeadDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background border-border">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Lead</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do lead para adicioná-lo ao funil.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSave}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Nome do Lead*</Label>
              <Input
                id="title"
                name="title"
                placeholder="Ex.: Empresa ABC Ltda."
                required
                className="bg-background"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descreva o interesse do lead..."
                rows={3}
                className="bg-background"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="value">Valor Potencial (R$)</Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  min="0"
                  step="100"
                  placeholder="Ex.: 10000"
                  className="bg-background"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select name="priority" defaultValue="medium">
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Adicionar Lead</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
