
import React, { useState, useEffect, useRef } from 'react';
import { SpreadsheetSheet } from '../document-explorer/types';

interface SpreadsheetGridProps {
  sheet: SpreadsheetSheet;
  selectedCell: string | null;
  onSelectCell: (cellId: string) => void;
  onCellChange: (cellId: string, value: string, isFormula?: boolean) => void;
}

const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({ 
  sheet, 
  selectedCell, 
  onSelectCell,
  onCellChange 
}) => {
  const [editCell, setEditCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Column headers (A, B, C, ..., Z, AA, AB, ...)
  const columnHeaders = Array.from({ length: sheet.columns }, (_, i) => {
    if (i < 26) return String.fromCharCode(65 + i); // A-Z
    const firstChar = String.fromCharCode(64 + Math.floor((i) / 26));
    const secondChar = String.fromCharCode(65 + (i % 26));
    return `${firstChar}${secondChar}`;
  });
  
  useEffect(() => {
    if (editCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editCell]);
  
  const handleCellClick = (cellId: string) => {
    onSelectCell(cellId);
    
    // If double click, enter edit mode
    if (cellId === selectedCell) {
      setEditCell(cellId);
      setEditValue(sheet.cells[cellId]?.formula || sheet.cells[cellId]?.value?.toString() || '');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle navigation with arrow keys
    if (selectedCell && !editCell) {
      const [colChar, rowStr] = selectedCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      const colIndex = columnHeaders.indexOf(colChar);
      const rowIndex = parseInt(rowStr) - 1;
      
      if (e.key === 'ArrowUp' && rowIndex > 0) {
        onSelectCell(`${colChar}${rowIndex}`);
      } else if (e.key === 'ArrowDown' && rowIndex < sheet.rows - 1) {
        onSelectCell(`${colChar}${rowIndex + 2}`);
      } else if (e.key === 'ArrowLeft' && colIndex > 0) {
        onSelectCell(`${columnHeaders[colIndex - 1]}${rowIndex + 1}`);
      } else if (e.key === 'ArrowRight' && colIndex < sheet.columns - 1) {
        onSelectCell(`${columnHeaders[colIndex + 1]}${rowIndex + 1}`);
      } else if (e.key === 'Enter') {
        setEditCell(selectedCell);
        setEditValue(sheet.cells[selectedCell]?.formula || sheet.cells[selectedCell]?.value?.toString() || '');
        e.preventDefault();
      }
    } else if (editCell && e.key === 'Enter') {
      // Submit cell edit on Enter
      finishEditing();
      e.preventDefault();
    } else if (editCell && e.key === 'Escape') {
      // Cancel edit on Escape
      setEditCell(null);
      e.preventDefault();
    }
  };
  
  const finishEditing = () => {
    if (editCell) {
      const isFormula = editValue.startsWith('=');
      onCellChange(editCell, editValue, isFormula);
      setEditCell(null);
    }
  };
  
  const getCellValue = (row: number, col: string) => {
    const cellId = `${col}${row}`;
    return sheet.cells[cellId]?.value || '';
  };

  return (
    <div 
      className="spreadsheet-grid relative"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="grid"
    >
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="bg-gray-100 dark:bg-gray-800 w-8 h-8 sticky top-0 left-0 z-20"></th>
            {columnHeaders.map(col => (
              <th 
                key={col}
                className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-2 min-w-[60px] h-8 sticky top-0 z-10 text-center select-none"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: sheet.rows }, (_, rowIndex) => {
            const rowNum = rowIndex + 1;
            
            return (
              <tr key={rowNum}>
                <td 
                  className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-2 text-center sticky left-0 z-10 select-none"
                >
                  {rowNum}
                </td>
                {columnHeaders.map(colHeader => {
                  const cellId = `${colHeader}${rowNum}`;
                  const isSelected = cellId === selectedCell;
                  const isEditing = cellId === editCell;
                  const cellValue = getCellValue(rowNum, colHeader);
                  
                  return (
                    <td 
                      key={cellId}
                      className={`border border-gray-300 dark:border-gray-700 px-1 h-6 relative ${
                        isSelected ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                      }`}
                      onClick={() => handleCellClick(cellId)}
                      onDoubleClick={() => {
                        setEditCell(cellId);
                        setEditValue(sheet.cells[cellId]?.formula || sheet.cells[cellId]?.value?.toString() || '');
                      }}
                      data-cell-id={cellId}
                    >
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          className="absolute inset-0 w-full h-full px-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onBlur={finishEditing}
                        />
                      ) : (
                        <div className="cell-content truncate">{cellValue}</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SpreadsheetGrid;
