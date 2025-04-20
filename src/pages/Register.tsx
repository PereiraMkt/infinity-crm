
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Building2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Checkbox } from '@/components/ui/checkbox';

const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirmação de senha obrigatória'),
  terms: z.boolean().refine(val => val === true, {
    message: 'Você deve aceitar os termos de serviço',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const { signUp, user, loading } = useAuth();
  const [userType, setUserType] = useState('company');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false
    }
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await signUp(
        values.email, 
        values.password, 
        values.name, 
        userType === 'company'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Se o usuário já está autenticado, redirecionar para o dashboard
  if (user && !loading) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-hidden">
      {/* Background grid pattern */}
      <div className="fixed inset-0 z-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
      
      {/* Global light effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <header className="container relative z-10 px-4 py-6 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a página inicial
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">Login</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          <Card className="bg-black/40 border-white/10 backdrop-blur-lg shadow-[0_0_25px_rgba(130,80,223,0.2)]">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-white">Criar Conta</CardTitle>
              <CardDescription className="text-center text-white/70">
                Escolha como deseja se cadastrar no Infinity CRM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="company" className="w-full" onValueChange={setUserType}>
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-black/60">
                  <TabsTrigger value="company" className="flex items-center gap-2 data-[state=active]:bg-primary">
                    <Building2 className="h-4 w-4" />
                    Empresa
                  </TabsTrigger>
                  <TabsTrigger value="collaborator" className="flex items-center gap-2 data-[state=active]:bg-primary">
                    <User className="h-4 w-4" />
                    Colaborador
                  </TabsTrigger>
                </TabsList>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <TabsContent value="company">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Nome da Empresa</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Informe o nome da sua empresa" 
                                  required 
                                  {...field} 
                                  className="bg-black/60 border-white/10 text-white placeholder:text-white/50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">E-mail</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="seu@email.com" 
                                  type="email" 
                                  required 
                                  {...field}
                                  className="bg-black/60 border-white/10 text-white placeholder:text-white/50"
                                />
                              </FormControl>
                              <FormDescription className="text-white/50">
                                Use qualquer email válido para cadastro.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="collaborator">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Seu Nome</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Informe seu nome completo" 
                                  required 
                                  {...field}
                                  className="bg-black/60 border-white/10 text-white placeholder:text-white/50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">E-mail</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="seu@email.com" 
                                  type="email" 
                                  required 
                                  {...field}
                                  className="bg-black/60 border-white/10 text-white placeholder:text-white/50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Senha</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="••••••••" 
                              type="password" 
                              required 
                              {...field}
                              className="bg-black/60 border-white/10 text-white placeholder:text-white/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Confirmar Senha</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="••••••••" 
                              type="password" 
                              required 
                              {...field}
                              className="bg-black/60 border-white/10 text-white placeholder:text-white/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="terms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 bg-black/20">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-white">
                              Concordo com os <a href="#" className="text-primary hover:underline">Termos de Serviço</a> e <a href="#" className="text-primary hover:underline">Política de Privacidade</a>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 text-white group relative overflow-hidden"
                      disabled={isSubmitting}
                    >
                      <span className="relative z-10">
                        {isSubmitting ? "Processando..." : "Criar Conta"}
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </Button>
                  </form>
                </Form>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t border-white/10">
              <div className="text-center text-sm text-white/70">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Entrar
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Register;
