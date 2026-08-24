import { motion } from 'framer-motion'

export default function PageWrap({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{ position: 'relative', zIndex: 1, minHeight: '80vh' }}
    >
      {children}
    </motion.main>
  )
}
