import React from "react";
import { motion } from "framer-motion";

const ThreeDotLoading = () => {
  const dots = [0, 1, 2];
  const delay = 0.2;

  return (
    <div className="flex items-center justify-start py-4 space-x-1 h-16">
      {dots.map((dot, index) => (
        <motion.div
          key={index}
          className="w-2 h-2 bg-blue-500 rounded-full"
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: index * delay,
          }}
        />
      ))}
    </div>
  );
};

export default ThreeDotLoading;
