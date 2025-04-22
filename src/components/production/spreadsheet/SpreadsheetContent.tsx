
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { SpreadsheetItem, SpreadsheetSheet, SpreadsheetCell } from "../document-explorer/types";
import SpreadsheetToolbar from './SpreadsheetToolbar';
import SpreadsheetGrid from './SpreadsheetGrid';
import SpreadsheetTabs from './SpreadsheetTabs';

interface SpreadsheetContentProps {
  spreadsheet: SpreadsheetItem;
  onSpreadsheetChange: (updatedSpreadsheet: SpreadsheetItem) => void;
}

const SpreadsheetContent: React.FC<SpreadsheetContentProps> = ({ 
  spreadsheet,
  onSpreadsheetChange
}) => {
  const { toast } = useToast();
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [formulaValue, setFormulaValue] = useState<string>('');
  
  // Get current active sheet
  const activeSheetIndex = spreadsheet.activeSheet || 0;
  const activeSheet = spreadsheet.sheets?.[activeSheetIndex];
  
  useEffect(() => {
    if (selectedCell && activeSheet?.cells[selectedCell]) {
      const cell = activeSheet.cells[selectedCell];
      setFormulaValue(cell.formula || cell.value?.toString() || '');
    } else {
      setFormulaValue('');
    }
  }, [selectedCell, activeSheet]);

  const handleCellChange = (cellId: string, value: string, isFormula: boolean = false) => {
    if (!activeSheet) return;
    
    const newSheets = [...(spreadsheet.sheets || [])];
    const sheet = {...newSheets[activeSheetIndex]};
    
    // Update the cell in the active sheet
    sheet.cells = {
      ...sheet.cells,
      [cellId]: {
        ...(sheet.cells[cellId] || {}),
        value: isFormula ? evaluateFormula(value, sheet.cells) : value,
        formula: isFormula ? value : undefined
      }
    };
    
    newSheets[activeSheetIndex] = sheet;
    
    // Update the spreadsheet
    const updatedSpreadsheet: SpreadsheetItem = {
      ...spreadsheet,
      sheets: newSheets
    };
    
    onSpreadsheetChange(updatedSpreadsheet);
  };
  
  const handleFormulaChange = (value: string) => {
    setFormulaValue(value);
    if (selectedCell && value.startsWith('=')) {
      handleCellChange(selectedCell, value, true);
    } else if (selectedCell) {
      handleCellChange(selectedCell, value);
    }
  };
  
  const handleAddSheet = () => {
    const newSheetId = `sheet-${Date.now()}`;
    const newSheetName = `Sheet ${(spreadsheet.sheets?.length || 0) + 1}`;
    
    const newSheet: SpreadsheetSheet = {
      id: newSheetId,
      name: newSheetName,
      cells: {},
      columns: 26,
      rows: 100
    };
    
    const updatedSheets = [...(spreadsheet.sheets || []), newSheet];
    
    onSpreadsheetChange({
      ...spreadsheet,
      sheets: updatedSheets,
      activeSheet: updatedSheets.length - 1
    });
    
    toast({
      title: "Nova planilha",
      description: `${newSheetName} foi adicionada.`
    });
  };
  
  const handleRenameSheet = (index: number, name: string) => {
    const newSheets = [...(spreadsheet.sheets || [])];
    newSheets[index] = {
      ...newSheets[index],
      name
    };
    
    onSpreadsheetChange({
      ...spreadsheet,
      sheets: newSheets
    });
  };
  
  const handleSelectSheet = (index: number) => {
    onSpreadsheetChange({
      ...spreadsheet,
      activeSheet: index
    });
  };
  
  const handleDeleteSheet = (index: number) => {
    if (spreadsheet.sheets?.length === 1) {
      toast({
        title: "Erro",
        description: "A planilha precisa ter pelo menos uma aba.",
        variant: "destructive"
      });
      return;
    }
    
    const newSheets = [...(spreadsheet.sheets || [])];
    newSheets.splice(index, 1);
    
    let newActiveSheet = spreadsheet.activeSheet;
    if (newActiveSheet === index) {
      newActiveSheet = Math.max(0, index - 1);
    } else if (newActiveSheet > index) {
      newActiveSheet = newActiveSheet - 1;
    }
    
    onSpreadsheetChange({
      ...spreadsheet,
      sheets: newSheets,
      activeSheet: newActiveSheet
    });
  };
  
  // Basic formula evaluation function - simplified for demonstration
  const evaluateFormula = (formula: string, cells: Record<string, SpreadsheetCell>): any => {
    if (!formula.startsWith('=')) return formula;
    
    try {
      // Remove the leading '=' character
      const expression = formula.substring(1);
      
      // Replace cell references with their values
      const normalizedExpression = expression.replace(/[A-Z]+[0-9]+/g, (cellId) => {
        const cell = cells[cellId];
        return cell?.value !== undefined ? cell.value : '0';
      });
      
      // Evaluate the expression (Warning: using eval is generally not recommended in production)
      // A proper implementation would use a formula parser library
      return eval(normalizedExpression);
    } catch (error) {
      console.error("Formula evaluation error:", error);
      return '#ERROR!';
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-md overflow-hidden bg-white dark:bg-gray-900">
      <SpreadsheetToolbar 
        selectedCell={selectedCell}
        formulaValue={formulaValue}
        onFormulaChange={handleFormulaChange}
      />
      
      <div className="flex-grow overflow-auto">
        {activeSheet && (
          <SpreadsheetGrid
            sheet={activeSheet}
            selectedCell={selectedCell}
            onSelectCell={setSelectedCell}
            onCellChange={handleCellChange}
          />
        )}
      </div>
      
      <SpreadsheetTabs
        sheets={spreadsheet.sheets || []}
        activeIndex={activeSheetIndex}
        onSelectSheet={handleSelectSheet}
        onAddSheet={handleAddSheet}
        onRenameSheet={handleRenameSheet}
        onDeleteSheet={handleDeleteSheet}
      />
    </div>
  );
};

export default SpreadsheetContent;
