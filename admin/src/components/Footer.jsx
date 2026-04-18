import { Camera, PlayCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background/80 backdrop-blur-3xl py-12 mt-10">
      <div className="max-w-[1400px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-2xl font-heading font-bold text-foreground">
          VFX<span className="text-primary">.</span>Designer
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium items-center">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
            <Camera className="w-4 h-4" /> Instagram
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
            <PlayCircle className="w-4 h-4" /> YouTube
          </a>
          {/* <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Behance</a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">LinkedIn</a> */}
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
