import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Shield, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

interface AnalysisResult {
  verdict: "authentic" | "suspicious" | "fake";
  confidence: number;
  signals: string[];
}

const DemoSection = () => {
  const [reviewText, setReviewText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const sampleReviews = [
    "This product is amazing! Best purchase ever. Totally recommend to everyone. 5 stars!!!",
    "I've been using this for 3 months now. The build quality is decent, though the battery life could be better. Setup was straightforward. Overall satisfied with my purchase given the price point.",
    "INCREDIBLE AMAZING BEST PRODUCT EVER BUY NOW DON'T WAIT PERFECT IN EVERY WAY!!!!! 10/10!!!!!!",
  ];

  const analyzeReview = async () => {
    if (!reviewText.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: reviewText,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      // Map backend response to frontend verdict
      const verdict: AnalysisResult["verdict"] =
        data.label === "fake" ? "fake" : "authentic";

      setResult({
        verdict,
        confidence: Math.round(data.confidence * 100),
        signals: data.signals,
      });
    } catch (error) {
      console.error("Error analyzing review:", error);
      // Fallback error message
      setResult({
        verdict: "suspicious",
        confidence: 0,
        signals: [
          "Unable to connect to analysis service. Please ensure the backend is running on http://localhost:8000",
        ],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getVerdictConfig = (verdict: AnalysisResult["verdict"]) => {
    switch (verdict) {
      case "authentic":
        return {
          icon: CheckCircle,
          label: "Likely Authentic",
          bgClass: "bg-success/10",
          textClass: "text-success",
          borderClass: "border-success/30",
        };
      case "suspicious":
        return {
          icon: AlertTriangle,
          label: "Suspicious",
          bgClass: "bg-warning/10",
          textClass: "text-warning",
          borderClass: "border-warning/30",
        };
      case "fake":
        return {
          icon: Shield,
          label: "Likely Fake",
          bgClass: "bg-destructive/10",
          textClass: "text-destructive",
          borderClass: "border-destructive/30",
        };
    }
  };

  return (
    <section id="demo" className="section-padding">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary-soft text-primary text-sm font-medium mb-4">
            Try It Now
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Live demo
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Paste any product review below and see VeriTrust in action.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          {/* Sample reviews */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">
              Try a sample review:
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {sampleReviews.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setReviewText(sample);
                    setResult(null);
                  }}
                  className="px-3 py-1.5 text-xs rounded-lg bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
                >
                  Sample {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Input area */}
          <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
            <textarea
              value={reviewText}
              onChange={(e) => {
                setReviewText(e.target.value);
                setResult(null);
              }}
              placeholder="Paste a product review here..."
              className="w-full min-h-[160px] p-6 bg-transparent resize-none text-foreground placeholder:text-muted-foreground focus:outline-none text-base leading-relaxed"
            />
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-secondary/30 border-t border-border gap-4">
              <span className="text-sm text-muted-foreground">
                {reviewText.length} characters
              </span>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={analyzeReview}
                disabled={!reviewText.trim() || isAnalyzing}
                className="btn-primary px-6 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Analyze review
                  </>
                )}
              </motion.button>
            </div>
          </div>

          {/* Results area */}
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="mt-6"
              >
                {(() => {
                  const config = getVerdictConfig(result.verdict);
                  const VerdictIcon = config.icon;

                  return (
                    <div
                      className={`rounded-2xl border ${config.borderClass} ${config.bgClass} p-6`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl ${config.bgClass} flex items-center justify-center`}
                        >
                          <VerdictIcon className={`w-6 h-6 ${config.textClass}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3
                              className={`text-xl font-semibold ${config.textClass}`}
                            >
                              {config.label}
                            </h3>
                            <span className="px-2.5 py-1 rounded-full bg-background text-sm font-medium text-foreground">
                              {result.confidence}% confidence
                            </span>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-foreground mb-3">
                              Signals detected:
                            </p>
                            <ul className="space-y-2">
                              {result.signals.map((signal, index) => (
                                <motion.li
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-start gap-2 text-sm text-muted-foreground"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-current mt-1 flex-shrink-0" />
                                  <span className="break-words">{signal}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default DemoSection;
