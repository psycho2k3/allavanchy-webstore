import { motion } from 'framer-motion';

function AnimatedPage({ children, className = '' }) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={className}
      exit={{ opacity: 0, y: 12 }}
      initial={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedPage;
