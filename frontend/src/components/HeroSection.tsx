import { motion } from "framer-motion";
import { Shield, Sparkles, BarChart3, ArrowRight } from "lucide-react";

const HeroSection = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const bentoCards = [
    {
      icon: BarChart3,
      title: "91% Accuracy",
      description: "Industry-leading detection rate",
      className: "col-span-1 row-span-1",
      delay: 0.3,
    },
    {
      icon: Sparkles,
      title: "Explainable AI",
      description: "Understand why reviews are flagged",
      className: "col-span-1 row-span-1",
      delay: 0.4,
    },
    {
      icon: Shield,
      title: "Trust Score",
      description: "Confidence ratings you can rely on",
      className: "col-span-2 row-span-1 md:col-span-1",
      delay: 0.5,
    },
  ];

  return (
    <section
      id="home"
      className="min-h-screen flex items-center pt-20 md:pt-24 pb-16"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="container-tight">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-soft text-primary text-sm font-medium mb-6"
            >
              <Shield className="w-4 h-4" />
              AI-Powered Review Verification
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
            >
              Verify product reviews{" "}
              <span className="gradient-text">with confidence</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            >
              VeriTrust uses deep language models to detect fake and deceptive
              product reviews. Get trust verdicts, confidence scores, and
              explainable signals instantly.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToSection("#demo")}
                className="btn-primary px-8 py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 group"
              >
                Try live demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToSection("#how-it-works")}
                className="btn-secondary px-8 py-4 rounded-xl font-semibold text-base"
              >
                How it works
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column - Bento Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
          >
            {bentoCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: card.delay }}
                whileHover={{ y: -4, scale: 1.02 }}
                className={`${card.className} glass-card rounded-2xl p-6 md:p-7 cursor-default`}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center mb-4">
                  <card.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {card.description}
                </p>
              </motion.div>
            ))}

            {/* Large feature card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ y: -4 }}
              className="col-span-1 md:col-span-2 glass-card rounded-2xl p-6 md:p-7 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1">
                    <div className="h-2 bg-gradient-to-r from-success to-primary rounded-full mb-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Authentic</span>
                      <span>Suspicious</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                  <span className="text-sm font-medium text-foreground">
                    Real-time analysis in under 2 seconds
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
