import { motion } from "framer-motion";
import { Leaf, Recycle, Heart, Droplets } from "lucide-react";

const benefits = [
  { icon: Recycle, title: "Reduce Waste", desc: "Renting extends garment life and keeps clothes out of landfills." },
  { icon: Leaf, title: "Lower Carbon Footprint", desc: "Skip fast fashion — one rented outfit saves up to 3kg of CO₂." },
  { icon: Droplets, title: "Save Water", desc: "Reusing clothes saves thousands of liters of water per garment." },
  { icon: Heart, title: "Promote Reuse", desc: "Join the circular fashion movement and wear with purpose." },
];

const SustainableFashionBanner = () => (
  <section className="container mx-auto px-4 py-12">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-secondary/10 via-primary/5 to-secondary/10 border border-secondary/20 rounded-3xl p-8 md:p-10"
    >
      <div className="text-center mb-8">
        <span className="text-3xl mb-2 block">🌿</span>
        <h2 className="font-serif text-3xl text-primary mb-2">Sustainable Fashion</h2>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm">
          Every rental is a step toward a greener planet. Here's why renting beats buying.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {benefits.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="bg-card/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center mx-auto mb-3">
              <b.icon className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="font-bold text-primary text-sm mb-1">{b.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </section>
);

export default SustainableFashionBanner;
