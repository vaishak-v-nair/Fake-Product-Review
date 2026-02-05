import { motion } from "framer-motion";
import { ClipboardPaste, Brain, CheckCircle2 } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: ClipboardPaste,
      step: "01",
      title: "Paste a review",
      description:
        "Simply copy and paste any product review you want to verify. Works with reviews from any e-commerce platform.",
    },
    {
      icon: Brain,
      step: "02",
      title: "AI analyzes patterns",
      description:
        "Our deep learning models examine linguistic patterns, sentiment markers, and behavioral signals in real-time.",
    },
    {
      icon: CheckCircle2,
      step: "03",
      title: "Get trust verdict",
      description:
        "Receive a clear trust score with detailed explanations of why the review was flagged or verified.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="how-it-works" className="section-padding bg-secondary/30">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary-soft text-primary text-sm font-medium mb-4">
            Simple & Effective
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to verify any product review with AI-powered
            accuracy.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group bg-card rounded-2xl p-8 shadow-soft border border-border hover:shadow-glow transition-all duration-300 relative"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary-soft flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                  <step.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <span className="text-5xl font-bold text-muted/50 group-hover:text-primary/20 transition-colors">
                  {step.step}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>

              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
