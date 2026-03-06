import { motion } from "motion/react";
import { Paintbrush, Server, Plug, Cloud, PenTool, Globe } from "lucide-react";

const capabilities = [
  {
    icon: Paintbrush,
    title: "AI UI Generation",
    description:
      "Beautiful interfaces generated from descriptions. Pixel-perfect responsive design every time.",
  },
  {
    icon: Server,
    title: "Backend Automation",
    description:
      "Database schemas, APIs, and server logic created automatically from your requirements.",
  },
  {
    icon: Plug,
    title: "API Integration",
    description:
      "Connect to any third-party service with natural language. OAuth, webhooks, and more.",
  },
  {
    icon: Cloud,
    title: "Smart Hosting",
    description:
      "Auto-scaling infrastructure that grows with your application. Zero configuration needed.",
  },
  {
    icon: PenTool,
    title: "Real-time Editing",
    description:
      "Iterate on your application in real-time. See changes instantly as you refine your vision.",
  },
  {
    icon: Globe,
    title: "Global Deployment",
    description:
      "Deploy to edge locations worldwide with one click. Ultra-low latency for all users.",
  },
];

export default function PlatformCapabilities() {
  return (
    <section className="py-24 md:py-32 bg-secondary">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Platform{" "}
            <span className="bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] bg-clip-text text-transparent">
              Capabilities
            </span>
          </h2>
          <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
            Everything you need to build, deploy, and scale modern applications.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {capabilities.map((cap, index) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group flex items-start gap-4"
            >
              <div className="relative flex-shrink-0">
                {/* Glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] rounded-xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-r from-[#3D4EF0] to-[#23A0FF] flex items-center justify-center">
                  <cap.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold mb-1">{cap.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {cap.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
