import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { Plane } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, login, register } = useAuth();
  const navigate = useNavigate();


  async function handleLogin(email: string, password: string) {
    try {
      const response = await login(email, password);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erro ao fazer login' };
    }
  }

  async function handleRegister(name: string, email: string, password: string) {
    try {
      const response = await register(name, email, password);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Erro ao criar conta' };
    }
  }



  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const result = await handleLogin(email, password);
        if (result.success) {
          toast.success('Login realizado com sucesso!');
          navigate('/');
        } else {
          toast.error(result.error || 'Erro ao fazer login');
        }
      } else {
        const result = await handleRegister(name, email, password);
        if (result.success) {
          toast.success('Conta criada com sucesso!');
          navigate('/');
        } else {
          toast.error(result.error || 'Erro ao criar conta');
        }
      }
    } catch (error) {
      toast.error('Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Plane className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                TravelAI
              </h1>
            </div>
            <p className="text-muted-foreground">Planeje suas viagens com inteligência artificial</p>
          </div>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Bem-vindo</CardTitle>
              <CardDescription>
                {isLogin ? 'Faça login para continuar' : 'Crie sua conta para começar'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(v) => setIsLogin(v === 'login')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Registro</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Senha</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        variant="link"
                        className="px-0 text-sm text-muted-foreground hover:text-primary"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate('/recover-password');
                        }}
                      >
                        Esqueci minha senha
                      </Button>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Entrando...' : 'Entrar'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Nome</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Seu nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Senha</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Criando conta...' : 'Criar conta'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Auth;
