import { Button, type ButtonProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import type { MotionSafe } from '../../lib/motion';
import { fireGradient } from '../../theme';

const MotionButton = motion.create(Button);

interface GradientButtonProps extends MotionSafe<ButtonProps> {
  /** When set, renders as a react-router Link to this path. */
  to?: string;
}

export function GradientButton({ children, to, ...rest }: GradientButtonProps) {
  const linkProps = to ? { as: RouterLink, to } : {};
  return (
    <MotionButton
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      bgGradient={fireGradient}
      color="white"
      px={6}
      borderRadius="full"
      fontWeight="semibold"
      boxShadow="0 8px 24px -8px rgba(249, 98, 15, 0.6)"
      _hover={{ bgGradient: 'linear(to-r, brand.300, red.400)' }}
      _active={{ bgGradient: 'linear(to-r, brand.500, red.600)' }}
      {...linkProps}
      {...rest}
    >
      {children}
    </MotionButton>
  );
}

export default GradientButton;
