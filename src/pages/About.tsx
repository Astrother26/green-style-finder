import { motion } from "framer-motion";
import { Leaf, Droplets, Zap, Recycle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const missions = [
  { icon: Recycle, title: "Reduce Waste", desc: "The fashion industry produces 92 million tons of waste annually. We're changing that by promoting thrift fashion." },
  { icon: Leaf, title: "Lower Carbon", desc: "Every thrifted item saves an average of 4.8 kg of CO₂ emissions compared to buying new." },
  { icon: Droplets, title: "Save Water", desc: "Thrift shopping saves approximately 2,700 liters of water per garment." },
];

const stats = [
  { number: "500K+", label: "Items Thrifted" },
  { number: "2.4M kg", label: "CO₂ Saved" },
  { number: "1.3B L", label: "Water Conserved" },
  { number: "90%", label: "Waste Reduced" },
];

const About = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />

    <section className="gradient-hero text-primary-foreground py-16 px-4 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-4xl md:text-5xl mb-3">🌍 About EcoThrift</h1>
        <p className="text-lg opacity-90">Making sustainable fashion accessible through AI technology</p>
      </motion.div>
    </section>

    <section className="container mx-auto px-4 py-16">
      <h2 className="font-serif text-3xl text-primary text-center mb-10">Our Mission</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {missions.map((m, i) => (
          <motion.div
            key={m.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-8 text-center shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-2 transition-all"
          >
            <m.icon className="h-12 w-12 text-secondary mx-auto mb-4" />
            <h3 className="font-sans font-bold text-xl text-primary mb-2">{m.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Video */}
    <section className="container mx-auto px-4 pb-16">
      <div className="bg-card rounded-3xl shadow-[var(--shadow-card)] p-8 max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl text-primary text-center mb-6">🎬 Understanding Carbon Footprint in Fashion</h2>
        <div className="relative pb-[56.25%] h-0 rounded-2xl overflow-hidden shadow-lg">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/JpVJPCGe5X4"
            title="Carbon Footprint in Fashion"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="container mx-auto px-4 pb-16">
      <h2 className="font-serif text-3xl text-primary text-center mb-10">Our Environmental Impact</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="gradient-stat text-primary-foreground rounded-2xl p-6 text-center shadow-lg"
          >
            <div className="text-3xl font-bold mb-1">{s.number}</div>
            <div className="text-sm opacity-90">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Why Thrift */}
    <section className="container mx-auto px-4 pb-16">
      <div className="bg-card rounded-3xl shadow-[var(--shadow-card)] p-8 max-w-5xl mx-auto">
        <h2 className="font-serif text-3xl text-primary text-center mb-8">Why Thrift Fashion Matters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-sans font-bold text-lg text-secondary mb-3">🌱 The Problem with Fast Fashion</h3>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              The fashion industry is the second-largest polluter globally, contributing to:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["10% of global carbon emissions", "20% of global wastewater", "85% of textiles ending in landfills", "Microplastic pollution in oceans"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-accent flex-shrink-0" /> {item}
                </li>
              ))}
            </ul>

            <h3 className="font-sans font-bold text-lg text-secondary mt-6 mb-3">💚 The Thrift Solution</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Extending garment lifespan", "Reducing demand for new production", "Saving natural resources", "Supporting circular economy"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-secondary flex-shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-md">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=500&fit=crop"
              alt="Sustainable fashion"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default About;
