import { motion } from "framer-motion";

interface AudioVisualizerProps {
  active: boolean;
  mode: "listening" | "speaking";
}

export function AudioVisualizer({ active, mode }: AudioVisualizerProps) {
  if (!active) return null;

  const barColor = mode === "listening" ? "bg-red-500" : "bg-primary";
  const numBars = 5;

  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {Array.from({ length: numBars }).map((_, i) => (
        <motion.div
          key={i}
          className={`w-1.5 rounded-full ${barColor}`}
          animate={{
            height: ["20%", "100%", "20%"],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
          style={{ height: "40%" }}
        />
      ))}
    </div>
  );
}
