import { motion } from 'motion/react';

export function TextHoverEffect({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <motion.span
      initial={{ backgroundPosition: '100% 50%' }}
      whileHover={{ backgroundPosition: '0% 50%' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={{
        backgroundImage:
          'linear-gradient(105deg, #fff 0%, #fff 40%, #a5f3fc 49%, #fff 58%, #fff 100%)',
        backgroundSize: '240% 100%',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        WebkitBoxDecorationBreak: 'clone',
        boxDecorationBreak: 'clone',
      }}
    >
      {text}
    </motion.span>
  );
}
