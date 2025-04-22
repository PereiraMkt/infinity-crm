
import React from "react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  minimal?: boolean;
}

const LoadingScreen = ({ minimal = false }: LoadingScreenProps) => {
  if (minimal) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[200px]">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center w-full h-screen bg-background">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <h3 className="mt-4 text-xl font-medium">Carregando</h3>
        <p className="mt-2 text-sm text-muted-foreground">Aguarde enquanto carregamos seu conteúdo...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
