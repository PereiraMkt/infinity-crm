
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
  Settings, 
  ZoomIn, 
  ZoomOut
} from 'lucide-react';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { KanbanCardItem } from '@/components/kanban/types';

interface GanttChartProps {
  tasks: KanbanCardItem[];
  onTaskUpdate?: (updatedTask: KanbanCardItem) => void;
}

const TIME_BLOCK_WIDTH = 60; // Width in pixels of each time block
const ROW_HEIGHT = 50; // Height of each task row
const HEADER_HEIGHT = 60; // Height of the header row

const GanttChart: React.FC<GanttChartProps> = ({ tasks, onTaskUpdate }) => {
  const [startDate, setStartDate] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [days, setDays] = useState<Date[]>([]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [visibleTasks, setVisibleTasks] = useState<KanbanCardItem[]>(tasks);

  // Calculate days in the visible range
  useEffect(() => {
    const endDate = addDays(startDate, 13); // 2 weeks view by default
    const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });
    setDays(daysInRange);
  }, [startDate]);

  // Apply filters
  useEffect(() => {
    if (filter === 'all') {
      setVisibleTasks(tasks);
    } else {
      setVisibleTasks(tasks.filter(task => task.priority === filter));
    }
  }, [tasks, filter]);

  // Navigate to previous period
  const handlePrevPeriod = () => {
    setStartDate(subDays(startDate, 14));
  };

  // Navigate to next period
  const handleNextPeriod = () => {
    setStartDate(addDays(startDate, 14));
  };

  // Zoom in
  const handleZoomIn = () => {
    if (zoomLevel < 2) {
      setZoomLevel(zoomLevel + 0.25);
    }
  };

  // Zoom out
  const handleZoomOut = () => {
    if (zoomLevel > 0.5) {
      setZoomLevel(zoomLevel - 0.25);
    }
  };

  // Calculate bar position and width for a task
  const getTaskBarStyle = (task: KanbanCardItem) => {
    if (!task.startDate || !task.endDate) {
      return {
        display: 'none',
      };
    }

    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);

    // Check if the task is within the visible range
    const isStartVisible = days.some(day => isSameDay(day, taskStart));
    const isEndVisible = days.some(day => isSameDay(day, taskEnd));
    const isSpanningVisible = taskStart < days[0] && taskEnd > days[days.length - 1];

    if (!isStartVisible && !isEndVisible && !isSpanningVisible) {
      return {
        display: 'none',
      };
    }

    // Calculate position and width
    const firstDayTimestamp = days[0].getTime();
    let startOffset = Math.max(0, (taskStart.getTime() - firstDayTimestamp) / (24 * 60 * 60 * 1000) * TIME_BLOCK_WIDTH * zoomLevel);
    
    // Handle tasks that start before the visible range
    if (taskStart < days[0]) {
      startOffset = 0;
    }

    // Calculate width
    let width;
    if (taskStart < days[0] && taskEnd > days[days.length - 1]) {
      // Task spans the entire visible range
      width = days.length * TIME_BLOCK_WIDTH * zoomLevel;
    } else if (taskStart < days[0]) {
      // Task starts before visible range
      const daysVisible = Math.min(
        (taskEnd.getTime() - days[0].getTime()) / (24 * 60 * 60 * 1000) + 1,
        days.length
      );
      width = daysVisible * TIME_BLOCK_WIDTH * zoomLevel;
    } else if (taskEnd > days[days.length - 1]) {
      // Task ends after visible range
      const daysVisible = Math.min(
        (days[days.length - 1].getTime() - taskStart.getTime()) / (24 * 60 * 60 * 1000) + 1,
        days.length
      );
      width = daysVisible * TIME_BLOCK_WIDTH * zoomLevel;
    } else {
      // Task is fully within the visible range
      const durationDays = (taskEnd.getTime() - taskStart.getTime()) / (24 * 60 * 60 * 1000) + 1;
      width = durationDays * TIME_BLOCK_WIDTH * zoomLevel;
    }

    // Get color based on priority
    const getBarColor = () => {
      switch (task.priority) {
        case 'high': return 'rgb(239, 68, 68)';
        case 'medium': return 'rgb(249, 115, 22)';
        case 'low': return 'rgb(34, 197, 94)';
        default: return 'rgb(59, 130, 246)';
      }
    };

    return {
      left: `${startOffset}px`,
      width: `${width}px`,
      height: `${ROW_HEIGHT - 20}px`,
      top: '10px',
      backgroundColor: getBarColor(),
      position: 'absolute' as 'absolute',
      borderRadius: '4px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '8px',
      color: 'white',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as 'nowrap',
    };
  };

  // Calculate remaining time
  const getRemainingTime = (task: KanbanCardItem) => {
    if (!task.endDate) return null;
    
    const now = new Date();
    const end = new Date(task.endDate);
    
    if (now > end) return 'Atrasado';
    
    const diffInMs = end.getTime() - now.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffInHours}h ${diffInMinutes}m`;
  };

  return (
    <div className="bg-card/80 dark:bg-gray-800/40 backdrop-blur-md shadow-md border border-border/40 rounded-lg">
      {/* Chart Controls */}
      <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrevPeriod}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextPeriod}
            className="h-8 w-8 p-0"
          >
            <ChevronRight size={16} />
          </Button>
          <div className="flex items-center bg-muted/50 px-3 py-1 rounded-md">
            <Calendar size={16} className="mr-2 text-muted-foreground" />
            <span className="text-sm font-medium">
              {format(startDate, 'dd/MM/yyyy', { locale: ptBR })} - {format(days[days.length - 1] || startDate, 'dd/MM/yyyy', { locale: ptBR })}
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
          
          <Button variant="outline" size="sm" className="h-8">
            <Settings size={14} className="mr-2" />
            Configurações
          </Button>
          
          <Button variant="ghost" size="sm" onClick={handleZoomIn} className="h-8 w-8 p-0">
            <ZoomIn size={16} />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={handleZoomOut} className="h-8 w-8 p-0">
            <ZoomOut size={16} />
          </Button>
        </div>
      </div>
      
      <div className="relative">
        {/* Header fixed */}
        <div 
          className="border-b bg-muted/30 sticky top-0 z-10"
          style={{ height: HEADER_HEIGHT }}
        >
          <div className="flex">
            <div className="flex-shrink-0 border-r font-medium p-3" style={{ width: '280px' }}>
              Tarefa
            </div>
            <div className="flex-shrink-0 border-r font-medium p-3" style={{ width: '120px' }}>
              Responsável
            </div>
            <div className="flex-shrink-0 border-r font-medium p-3" style={{ width: '100px' }}>
              Progresso
            </div>
            <div className="flex-shrink-0 border-r font-medium p-3" style={{ width: '100px' }}>
              Tempo Restante
            </div>
            <div className="flex overflow-hidden">
              {days.map((day, index) => (
                <div 
                  key={index} 
                  className="flex flex-col justify-center items-center border-r p-1 text-center"
                  style={{ 
                    width: TIME_BLOCK_WIDTH * zoomLevel,
                    minWidth: TIME_BLOCK_WIDTH * zoomLevel 
                  }}
                >
                  <div className="text-xs font-semibold">
                    {format(day, 'EEE', { locale: ptBR })}
                  </div>
                  <div className="text-xs">
                    {format(day, 'dd/MM')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Scrollable content */}
        <ScrollArea className="h-[calc(100vh-22rem)]">
          <div className="min-w-max">
            {visibleTasks.map((task, index) => (
              <div 
                key={task.id} 
                className={`flex border-b hover:bg-muted/20 ${index % 2 === 0 ? 'bg-muted/10' : ''}`}
                style={{ height: ROW_HEIGHT }}
              >
                <div 
                  className="flex-shrink-0 border-r p-3 truncate flex items-center"
                  style={{ width: '280px' }}
                >
                  <div>
                    <div className="font-medium truncate">{task.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{task.description || 'Sem descrição'}</div>
                  </div>
                </div>
                
                <div 
                  className="flex-shrink-0 border-r p-3 truncate flex items-center"
                  style={{ width: '120px' }}
                >
                  <div className="text-sm truncate">{task.assignedTo?.name || '-'}</div>
                </div>
                
                <div 
                  className="flex-shrink-0 border-r p-3 flex items-center"
                  style={{ width: '100px' }}
                >
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${task.completion}%`, 
                        backgroundColor: task.completion === 100 
                          ? 'rgb(34, 197, 94)' 
                          : task.completion > 60 
                            ? 'rgb(59, 130, 246)' 
                            : 'rgb(249, 115, 22)' 
                      }}
                    />
                  </div>
                  <span className="text-xs ml-1">{task.completion}%</span>
                </div>
                
                <div 
                  className="flex-shrink-0 border-r p-3 flex items-center"
                  style={{ width: '100px' }}
                >
                  <div className="text-sm truncate">
                    {getRemainingTime(task) || '-'}
                  </div>
                </div>
                
                <div className="flex-grow relative">
                  <div style={getTaskBarStyle(task)}>
                    <span className="text-xs truncate">{task.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default GanttChart;
