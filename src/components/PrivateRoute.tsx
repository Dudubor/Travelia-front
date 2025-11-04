/* import { Navigate } from 'react-router-dom'; */
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  console.log("user ==> ", user);

  if (!user && !loading) {
    toast.error('Você precisa estar logado para acessar esta página.');
    setTimeout(() => {
        navigate('/auth');
    }, 2000);
  }

  return <>{children}</>;
};

export default PrivateRoute;