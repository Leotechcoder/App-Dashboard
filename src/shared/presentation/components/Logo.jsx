"use client";
import { motion } from "framer-motion";

const logoPieceVariant = {
  hidden: { opacity: 0, y: 40, rotate: -15 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      delay: 0.3 + i * 0.15,
      duration: 1.8,
      ease: "easeOut",
    },
  }),
};

const floatAnimation = {
  animate: {
    y: [0, -4, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const Logo = () => {
  return (
    <motion.svg
      width="150"
      height="150"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...floatAnimation}
    >
      <motion.path
        custom={0}
        variants={logoPieceVariant}
        initial="hidden"
        animate="visible"
        d="M3 9H21V11H3V9Z"
        fill="#FFB703"
      />
      <motion.path
        custom={1}
        variants={logoPieceVariant}
        initial="hidden"
        animate="visible"
        d="M3 13H21V15H3V13Z"
        fill="#E63946"
      />
      <motion.path
        custom={2}
        variants={logoPieceVariant}
        initial="hidden"
        animate="visible"
        d="M4 17H20C20 19.2091 17.7614 21 15 21H9C6.23858 21 4 19.2091 4 17Z"
        fill="#2A9D8F"
      />
      <motion.circle
        custom={3}
        variants={logoPieceVariant}
        initial="hidden"
        animate="visible"
        cx="7"
        cy="5"
        r="2"
        fill="#E76F51"
      />
    </motion.svg>
  );
};

export default Logo;
