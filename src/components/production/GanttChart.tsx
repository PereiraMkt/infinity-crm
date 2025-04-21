
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  ZoomIn, 
  ZoomOut
} from 'lucide-react';
import { format, addDays, subDays, startOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { KanbanCardItem } from '@/components/kanban/types';

// Largura A4 (~794px), a tabela Gantt deve expandir em largura
const TIME_BLOCK_WIDTH = 48; // um pouco menor para caber na largura A4/grafico expandido
const ROW_HEIGHT = 58;
const HEADER_HEIGHT = 60;

interface GanttChartProps {
  tasks: KanbanCardItem[];
  onTaskUpdate?: (updatedTask: KanbanCardItem) => void;
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks, onTaskUpdate }) => {
  const [startDate, setStartDate] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [days, setDays] = useState<Date[]>([]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [visibleTasks, setVisibleTasks] = useState<KanbanCardItem[]>(tasks);

  useEffect(() => {
    const endDate = addDays(startDate, 29); // 30 dias na tela
    setDays(eachDayOfInterval({ start: startDate, end: endDate }));
  }, [startDate]);

  useEffect(() => {
    if (filter === 'all') setVisibleTasks(tasks);
    else setVisibleTasks(tasks.filter(task => task.priority === filter));
  }, [tasks, filter]);

  const handlePrevPeriod = () => setStartDate(subDays(startDate, 30));
  const handleNextPeriod = () => setStartDate(addDays(startDate, 30));
  const handleZoomIn = () => zoomLevel < 2 && setZoomLevel(zoomLevel + 0.25);
  const handleZoomOut = () => zoomLevel > 0.5 && setZoomLevel(zoomLevel - 0.25);

  const getTaskBarStyle = (task: KanbanCardItem) => {
    if (!task.startDate || !task.endDate) return { display: 'none' };
    const tStart = new Date(task.startDate), tEnd = new Date(task.endDate);
    const firstDayTimestamp = days[0].getTime();
    let startOffset = Math.max(0, (tStart.getTime() - firstDayTimestamp) / (24 * 60 * 60 * 1000) * TIME_BLOCK_WIDTH * zoomLevel);
    if (tStart < days[0]) startOffset = 0;

    let width;
    if (tStart < days[0] && tEnd > days[days.length - 1])
      width = days.length * TIME_BLOCK_WIDTH * zoomLevel;
    else if (tStart < days[0])
      width = (Math.min((tEnd.getTime() - days[0].getTime()) / (24 * 60 * 60 * 1000) + 1, days.length)) * TIME_BLOCK_WIDTH * zoomLevel;
    else if (tEnd > days[days.length - 1])
      width = (Math.min((days[days.length - 1].getTime() - tStart.getTime()) / (24 * 60 * 60 * 1000) + 1, days.length)) * TIME_BLOCK_WIDTH * zoomLevel;
    else
      width = ((tEnd.getTime() - tStart.getTime()) / (24 * 60 * 60 * 1000) + 1) * TIME_BLOCK_WIDTH * zoomLevel;

    const getBarColor = () => {
      switch (task.priority) {
        case 'high': return 'rgb(34,197,94)';
        case 'medium': return 'rgb(59,130,246)';
        case 'low': return 'rgb(156,163,175)';
        default: return 'rgb(209,213,219)';
      }
    };
    return {
      left: `${startOffset}px`,
      width: `${width}px`,
      height: `${ROW_HEIGHT - 18}px`,
      top: '9px',
      backgroundColor: getBarColor(),
      position: 'absolute' as 'absolute',
      borderRadius: '6px',
      boxShadow: '0 1px 3px rgba(0,0,0,.09)',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '8px',
      color: 'white',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as 'nowrap',
      fontWeight: '500'
    };
  };

  const getRemainingTime = (task: KanbanCardItem) => {
    if (!task.endDate) return null;
    const now = new Date(), end = new Date(task.endDate);
    if (now > end) return 'Atrasado';
    const diffInMs = end.getTime() - now.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return diffInDays > 0 ? `${diffInDays}d ${diffInHours}h` : `${diffInHours}h`;
  };

  return (
    <div className="relative w-full bg-white border border-gray-200 rounded-lg shadow">
      {/* Controles superiores inspirados no print */}
      <div className="p-2 flex items-center justify-between border-b bg-neutral-50">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevPeriod}>
            <ChevronLeft size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextPeriod}>
            <ChevronRight size={16} />
          </Button>
          <div className="flex items-center bg-muted/50 px-2 py-1 rounded-md ml-2">
            <Calendar size={16} className="mr-2 text-muted-foreground" />
            <span className="text-sm font-medium">
              {format(days[0], "dd/MM/yyyy", { locale: ptBR })} - {format(days[days.length - 1], "dd/MM/yyyy", { locale: ptBR })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(value: 'all' | 'high' | 'medium' | 'low') => setFilter(value)}>
            <SelectTrigger className="w-[130px] h-8">
              <Filter size={14} className="mr-2" />
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="high">Alta Prioridade</SelectItem>
              <SelectItem value="medium">Média Prioridade</SelectItem>
              <SelectItem value="low">Baixa Prioridade</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" onClick={handleZoomIn}><ZoomIn size={16} /></Button>
          <Button variant="ghost" size="sm" onClick={handleZoomOut}><ZoomOut size={16} /></Button>
        </div>
      </div>
      {/* Gantt Table */}
      <div className="overflow-x-auto w-full pb-2">
        <div style={{ minWidth: 794 }}>
          {/* Header */}
          <div className="flex text-[15px] font-medium bg-neutral-100 border-b" style={{ height: HEADER_HEIGHT }}>
            <div className="flex-shrink-0 border-r px-4 flex items-center" style={{ width: 230 }}>
              Tarefa
            </div>
            <div className="flex-shrink-0 border-r px-3 flex items-center" style={{ width: 120 }}>
              Responsável
            </div>
            <div className="flex-shrink-0 border-r px-3 flex items-center" style={{ width: 90 }}>
              Progresso
            </div>
            <div className="flex-shrink-0 border-r px-3 flex items-center" style={{ width: 100 }}>
              Tempo Restante
            </div>
            <div className="flex" style={{ width: (TIME_BLOCK_WIDTH * zoomLevel) * days.length, minWidth: 580 }}>
              {days.map((day, idx) => (
                <div key={idx}
                  className="text-center border-r px-2"
                  style={{ width: TIME_BLOCK_WIDTH * zoomLevel, minWidth: TIME_BLOCK_WIDTH * zoomLevel }}>
                  <div className="text-[11px] font-bold">{format(day, "EE", { locale: ptBR }).toUpperCase()}</div>
                  <div className="text-[11px]">{format(day, "dd/MM")}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Rows */}
          <div className="relative">
            {visibleTasks.map((task, idx) => (
              <div key={task.id}
                className={`flex border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}
                style={{ height: ROW_HEIGHT, position: "relative" }}>
                <div className="flex-shrink-0 border-r px-4 py-2 flex items-center" style={{ width: 230 }}>
                  <div>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-xs text-muted-foreground">{task.description || "--"}</div>
                  </div>
                </div>
                <div className="flex-shrink-0 border-r px-3 flex items-center" style={{ width: 120 }}>
                  <span className="text-sm">{task.assignedTo?.name || "-"}</span>
                </div>
                <div className="flex-shrink-0 border-r px-3 flex items-center" style={{ width: 90 }}>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden mr-1">
                    <div className="h-full rounded-full" style={{
                      width: `${task.completion}%`,
                      backgroundColor: task.completion === 100 ? 'rgb(34,197,94)' : 'rgb(59,130,246)'
                    }} />
                  </div>
                  <span className="text-xs">{task.completion}%</span>
                </div>
                <div className="flex-shrink-0 border-r px-3 flex items-center" style={{ width: 100 }}>
                  <span className="text-sm">{getRemainingTime(task) || '-'}</span>
                </div>
                {/* Timeline side */}
                <div className="flex-grow relative" style={{ minWidth: (TIME_BLOCK_WIDTH * zoomLevel) * days.length }}>
                  <div style={getTaskBarStyle(task)}>
                    <span className="text-xs truncate">{task.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
