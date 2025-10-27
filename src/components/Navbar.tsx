import { Shield } from "lucide-react";


export const Navbar = () => {


  const isLoggedIn = !!localStorage.getItem('userToken');


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            DetetivAI
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button  className="text-muted-foreground hover:text-foreground">
            Como Funciona
          </button>
          <button  className="text-muted-foreground hover:text-foreground">
            Preços
          </button>

          {isLoggedIn ? (
            <button  className="border-primary/20 hover:bg-primary/10"
              onClick={() => window.location.href = "/dashboard"}>
              Dashboard
            </button>
          ) : (

            <button  className="border-primary/20 hover:bg-primary/10"
              onClick={() => window.location.href = "/auth"}>
              Login
            </button>
          )}


          <button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
            Começar Grátis
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;