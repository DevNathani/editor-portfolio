import { useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { CheckCircle, AlertCircle, Send } from "lucide-react";
import api from "../api";

export function ContactDialog({ trigger }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      await api.post('/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', budget: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const handleOpenChange = (val) => {
    setOpen(val);
    if (!val) {
      // Reset after closing
      setTimeout(() => { setStatus('idle'); setErrorMsg(''); }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px] border-white/10 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading text-foreground">Let's build something epic.</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Send me a message and I'll get back to you within 24 hours.
          </DialogDescription>
        </DialogHeader>

        {status === 'success' ? (
          <div className="py-10 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold font-heading">Message Sent!</h3>
            <p className="text-muted-foreground text-sm max-w-xs">Your message is on its way. Expect a reply within 24 hours.</p>
            <Button variant="outline" className="mt-2 border-white/10" onClick={() => handleOpenChange(false)}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-foreground">Name *</Label>
                <Input id="name" required value={form.name} onChange={handleChange} placeholder="John Doe" className="border-white/10 bg-white/5" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-foreground">Email *</Label>
                <Input id="email" type="email" required value={form.email} onChange={handleChange} placeholder="john@example.com" className="border-white/10 bg-white/5" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message" className="text-foreground">Message *</Label>
              <Textarea
                id="message"
                required
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about your project..."
                className="border-white/10 bg-white/5 min-h-[120px] resize-none"
              />
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg py-6 shadow-lg"
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Transmitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Send Message
                </span>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
