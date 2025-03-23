// LoadingScreen.jsx
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen backgroundNoPattern  text-white">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin text-white"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
        <motion.p
          className="mt-4 text-xl font-semibold tracking-wide text-white"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
