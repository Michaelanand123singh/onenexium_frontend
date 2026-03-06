import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What is OneNexium?",
    answer:
      "OneNexium is an AI-powered app builder that lets you create complete web applications, SaaS platforms, landing pages, eCommerce stores, and more just by describing what you want in plain English. No coding required.",
  },
  {
    question: "How does OneNexium work?",
    answer:
      "Simply type a description of the app or website you want to build. OneNexium's AI will analyze your request and generate a fully functional application with a backend, database, authentication, and beautiful UI. You can then iterate and refine by chatting with the AI.",
  },
  {
    question: "What can I build?",
    answer:
      "You can build virtually any web application: SaaS platforms, eCommerce stores, landing pages, personal websites, internal tools, dashboards, blogs, portfolios, mobile-friendly web apps, and much more.",
  },
  {
    question: "Do I need coding experience?",
    answer:
      "No coding experience is required. OneNexium is designed for everyone, from non-technical founders to experienced developers who want to move faster. Just describe what you want and the AI handles the rest.",
  },
  {
    question: "Can I connect to my own domain?",
    answer:
      "Yes! Every OneNexium app gets a free subdomain, and you can also connect your own custom domain. You can even purchase domains directly through the platform.",
  },
  {
    question: "Can I build mobile apps?",
    answer:
      "OneNexium builds Progressive Web Apps (PWAs) that work beautifully on mobile devices and can be installed on any phone or tablet just like a native app. Users can add your app to their home screen for a native app experience.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-5 text-left cursor-pointer group"
      >
        <h3 className="text-base font-semibold pr-4 group-hover:text-foreground/80 transition-colors">
          {question}
        </h3>
        <div className="flex-shrink-0">
          {isOpen ? (
            <Minus className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Plus className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="text-muted-foreground text-sm leading-relaxed pb-5">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-28 bg-secondary">
      <div className="max-w-[700px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-base mt-3">
            Everything you need to know about building with OneNexium
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
