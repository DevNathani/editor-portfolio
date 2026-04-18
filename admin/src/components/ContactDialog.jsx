import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export function ContactDialog({ trigger }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-white/10 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading text-foreground">Let's build something epic.</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Send me a message and I'll get back to you within 24 hours.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-foreground">Name</Label>
            <Input id="name" placeholder="John Doe" className="border-white/10 bg-white/5" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" className="border-white/10 bg-white/5" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message" className="text-foreground">Message</Label>
            <Textarea id="message" placeholder="Tell me about your project..." className="border-white/10 bg-white/5 min-h-[100px]" />
          </div>
        </div>
        <Button onClick={() => alert('Message Sent!')} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg py-6 shadow-lg">
          Send Message
        </Button>
      </DialogContent>
    </Dialog>
  );
}
