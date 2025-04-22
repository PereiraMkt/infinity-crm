
import React from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Calculator,
  Download
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';

interface SpreadsheetToolbarProps {
  selectedCell: string | null;
  formulaValue: string;
  onFormulaChange: (value: string) => void;
}

const colors = [
  { label: 'Default', value: '#000000', bg: '#000000' },
  { label: 'Gray', value: '#6B7280', bg: '#6B7280' },
  { label: 'Red', value: '#EF4444', bg: '#EF4444' },
  { label: 'Yellow', value: '#F59E0B', bg: '#F59E0B' },
  { label: 'Green', value: '#10B981', bg: '#10B981' },
  { label: 'Blue', value: '#3B82F6', bg: '#3B82F6' },
  { label: 'Purple', value: '#8B5CF6', bg: '#8B5CF6' }
];

const backgrounds = [
  { label: 'Default', value: '#FFFFFF', bg: '#FFFFFF' },
  { label: 'Light Gray', value: '#F3F4F6', bg: '#F3F4F6' },
  { label: 'Light Yellow', value: '#FEF3C7', bg: '#FEF3C7' },
  { label: 'Light Green', value: '#D1FAE5', bg: '#D1FAE5' },
  { label: 'Light Blue', value: '#DBEAFE', bg: '#DBEAFE' },
  { label: 'Light Purple', value: '#EDE9FE', bg: '#EDE9FE' }
];

const formulas = [
  { name: "SUM", formula: "=SUM(A1:A5)", description: "Soma os valores na faixa" },
  { name: "AVERAGE", formula: "=AVERAGE(A1:A5)", description: "Calcula a média" },
  { name: "COUNT", formula: "=COUNT(A1:A5)", description: "Conta células não vazias" },
  { name: "MAX", formula: "=MAX(A1:A5)", description: "Encontra o maior valor" },
  { name: "MIN", formula: "=MIN(A1:A5)", description: "Encontra o menor valor" },
  { name: "IF", formula: "=IF(A1>10,\"Alto\",\"Baixo\")", description: "Condição se/senão" }
];

const SpreadsheetToolbar: React.FC<SpreadsheetToolbarProps> = ({ 
  selectedCell, 
  formulaValue,
  onFormulaChange
}) => {
  return (
    <div className="border-b p-1 bg-gray-50 dark:bg-gray-800">
      <div className="flex items-center space-x-2 mb-1">
        {selectedCell && (
          <div className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 text-sm">
            {selectedCell}
          </div>
        )}
        <Input
          value={formulaValue}
          onChange={(e) => onFormulaChange(e.target.value)}
          placeholder="Digite um valor ou fórmula iniciando com ="
          className="h-8"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" title="Fórmulas">
              <Calculator className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {formulas.map((formula) => (
              <DropdownMenuItem
                key={formula.name}
                onClick={() => onFormulaChange(formula.formula)}
              >
                <div>
                  <div className="font-bold">{formula.name}</div>
                  <div className="text-xs text-gray-500">{formula.description}</div>
                  <div className="text-xs font-mono mt-1">{formula.formula}</div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap gap-1 items-center">
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Underline className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button variant="ghost" size="icon" className="h-7 w-7">
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <AlignRight className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Palette className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Cor do texto</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <div className="grid grid-cols-4 gap-1 p-1">
                  {colors.map((color) => (
                    <div
                      key={color.value}
                      className="w-6 h-6 rounded cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: color.bg }}
                    />
                  ))}
                </div>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Cor do fundo</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <div className="grid grid-cols-4 gap-1 p-1">
                  {backgrounds.map((bg) => (
                    <div
                      key={bg.value}
                      className="w-6 h-6 rounded cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: bg.bg }}
                    />
                  ))}
                </div>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Download className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Exportar como CSV</DropdownMenuItem>
            <DropdownMenuItem>Exportar como Excel</DropdownMenuItem>
            <DropdownMenuItem>Exportar como PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SpreadsheetToolbar;
