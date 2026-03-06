import { motion } from "motion/react";
import { Globe, Layers, Rocket, Boxes } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "AI Website Builder",
    description:
      "Generate complete websites instantly with natural language prompts. From landing pages to full-stack applications.",
  },
  {
    icon: Layers,
    title: "AI App Generator",
    description:
      "Create web apps and SaaS platforms without writing a single line of code. Just describe what you need.",
  },
  {
    icon: Rocket,
    title: "Smart Deployment",
    description:
      "Launch projects instantly with one click. Automatic scaling, SSL, and global CDN included.",
  },
  {
    icon: Boxes,
    title: "AI Components",
    description:
      "Generate UI components, backend logic, and APIs automatically. Build faster with intelligent code generation.",
  },
];

export default function FeatureSection() {
  return (
    <section id="features" className="py-24 md:py-32 bg-secondary">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Build Anything{" "}
            <span className="bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] bg-clip-text text-transparent">
              With AI
            </span>
          </h2>
          <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
            Powerful features that help you go from idea to production in
            minutes, not months.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group bg-card rounded-2xl p-6 border border-border hover:border-[#3D4EF0]/30 hover:shadow-[0_0_30px_rgba(61,78,240,0.08)] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(61,78,240,0.3)] transition-shadow duration-300">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
