import { Menu, MonitorPlay } from "lucide-react";
import { Button } from "./ui/button";
import { ContactDialog } from "./ContactDialog";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-white/5 backdrop-blur-xl">
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <MonitorPlay className="w-6 h-6" />
          <span className="font-heading font-bold text-xl tracking-tight text-foreground">
            Admin Panel
          </span>
        </Link>

        <nav className="hidden md:flex gap-8 items-center">
          <Link to="/projects" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Work</Link>
          <Link to="/achievements" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Achievements</Link>
          <a href="/#skills" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Skills</a>
        </nav>

        <div className="flex items-center gap-4">
          <ContactDialog trigger={
            <Button variant="outline" className="hidden md:flex border-primary/50 hover:bg-primary/20 text-primary transition-all">
              Let's Talk
            </Button>
          } />
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-6 h-6 text-foreground" />
          </Button>
        </div>
      </div>
    </header>
  );
}
