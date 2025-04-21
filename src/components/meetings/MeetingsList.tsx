import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import MeetingItem from "./MeetingItem";

// Simulate meetings data
const getMeetings = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayDate = `${year}-${month}-${day}`;
  
  // Current hour and minute
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // Create a meeting that's 5 minutes away
  const meetingSoonHour = hours;
  const meetingSoonMinute = minutes + 5;
  const meetingSoonTime = `${String(meetingSoonHour).padStart(2, '0')}:${String(meetingSoonMinute).padStart(2, '0')}`;
  
  // Create a meeting that's 30 minutes away
  const meetingLaterHour = hours;
  const meetingLaterMinute = minutes + 30;
  const meetingLaterTime = `${String(meetingLaterHour).padStart(2, '0')}:${String(meetingLaterMinute).padStart(2, '0')}`;
  
  // Create a meeting in the past
  const pastHour = hours > 0 ? hours - 1 : 23;
  const pastTime = `${String(pastHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  
  return [
    {
      id: "1",
      title: "Reunião com Equipe de Marketing",
      description: "Discussão sobre nova campanha de marketing digital",
      date: todayDate,
      time: meetingSoonTime,
      participants: 5,
      link: "https://meet.google.com/example-link"
    },
    {
      id: "2",
      title: "Apresentação para Novo Cliente",
      description: "Demonstração dos recursos do sistema para potencial cliente",
      date: todayDate,
      time: meetingLaterTime,
      participants: 3,
      link: "https://zoom.us/example-link"
    },
    {
      id: "3",
      title: "Review Semanal de Projeto",
      description: "Análise do progresso do projeto e próximos passos",
      date: todayDate,
      time: pastTime,
      participants: 8,
      link: "https://teams.microsoft.com/example-link"
    }
  ];
};

const MeetingsList = () => {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeetings() {
      setLoading(true);
      // Exemplo: buscar tasks do tipo "meeting"
      const { data } = await supabase.from("tasks").select("*").match({ status: "meeting" });
      setMeetings(data || []);
      setLoading(false);
    }
    fetchMeetings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span>Carregando reuniões...</span>
      </div>
    );
  }

  if (!meetings.length) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Ainda não há dados suficientes. Adicione para ver os resultados.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Reuniões Agendadas</h2>
        <Button size="sm">
          <PlusCircle size={16} className="mr-2" />
          Nova Reunião
        </Button>
      </div>
      <div className="space-y-3">
        {meetings.map((meeting) => (
          <MeetingItem key={meeting.id} {...meeting} />
        ))}
      </div>
    </div>
  );
};

export default MeetingsList;
