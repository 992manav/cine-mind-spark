import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Film, LayoutDashboard, User, Sparkles } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full z-50 glass-effect border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:animate-glow transition-all">
              <Film className="w-6 h-6 text-background" />
            </div>
            <div>
              <div className="text-xl font-bold text-gradient">CineMind AI</div>
              <div className="text-xs text-muted-foreground hidden sm:block">
                Intelligent Movie Discovery
              </div>
            </div>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="hidden md:flex items-center gap-2 hover:text-primary transition-colors">
              <Sparkles className="w-4 h-4" />
              <span>Discover</span>
            </Link>
            <Link to="/admin" className="hidden md:flex items-center gap-2 hover:text-primary transition-colors">
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin</span>
            </Link>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
