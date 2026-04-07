import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="gradient-hero text-primary-foreground py-16 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-serif text-4xl md:text-5xl mb-3">Get in Touch</h1>
          <p className="text-lg opacity-90">We'd love to hear from you</p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {[
              { icon: Mail, label: "Email", value: "hello@ecothrift.com" },
              { icon: Phone, label: "Phone", value: "+91 98765 43210" },
              { icon: MapPin, label: "Location", value: "Mumbai, India" },
            ].map((c) => (
              <div key={c.label} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <c.icon className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="font-sans font-semibold text-primary">{c.label}</p>
                  <p className="text-sm text-muted-foreground">{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-3 bg-card rounded-2xl p-6 shadow-[var(--shadow-card)] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="rounded-xl" />
              <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="rounded-xl" />
            </div>
            <Input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className="rounded-xl" />
            <Textarea placeholder="Your message..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required className="rounded-xl min-h-[120px]" />
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8">
              <Send className="h-4 w-4 mr-2" /> Send Message
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
