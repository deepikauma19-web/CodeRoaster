import { Box, Text } from '@chakra-ui/react';
import { motion, useReducedMotion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useCursorVector, type CursorVector } from '../../hooks/useCursorVector';

const MotionBox = motion.create(Box);

const HEAD_ANCHOR: CursorVector = { x: 0.5, y: 0.25 };
const FOLLOW_SPRING = { type: 'spring', stiffness: 130, damping: 14, mass: 0.6 } as const;

const HAIR = '#3b2218';
const SKIN = '#f6c9a8';
const MINT = '#8fe3c7';
const MINT_DARK = '#6fd2b0';
const CORAL = '#ff8fa3';

const GREETING = 'Vaanga! Un repo-va paste pannu, naan roast pannren 🔥';
const HOVER_LINE = 'Enna paakura? Sign in pannu da, score paakalaam! 😄';

/**
 * Cartoon presenter for the landing page. Her head and eyes follow the cursor,
 * she waves, and the speech bubble reacts when the pointer is over her.
 */
export function RoasterMascot() {
  const ref = useRef<HTMLDivElement>(null);
  const look = useCursorVector(ref, HEAD_ANCHOR);
  const reduceMotion = useReducedMotion() ?? false;
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      ref={ref}
      position="relative"
      w="full"
      maxW="340px"
      mx="auto"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <Box
        position="relative"
        bg="white"
        borderWidth="1px"
        borderColor="border.subtle"
        borderRadius="2xl"
        boxShadow="md"
        px={4}
        py={3}
        mb={4}
        _after={{
          content: '""',
          position: 'absolute',
          bottom: '-8px',
          left: '30%',
          w: '16px',
          h: '16px',
          bg: 'white',
          borderRightWidth: '1px',
          borderBottomWidth: '1px',
          borderColor: 'border.subtle',
          transform: 'rotate(45deg)',
        }}
      >
        <Text fontWeight="semibold" aria-live="polite">
          {hovered ? HOVER_LINE : GREETING}
        </Text>
      </Box>

      <MotionBox
        animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Box
          as="svg"
          viewBox="0 0 300 440"
          w="full"
          h="auto"
          role="img"
          aria-label="Cartoon illustration of a young woman in a mint blazer, waving and holding a laptop that shows a score of 92"
        >
          <ellipse cx="150" cy="424" rx="78" ry="9" fill="#000" opacity="0.08" />

          {/* wide-leg trousers */}
          <path
            d="M110 236 L190 236 L218 406 L160 406 L150 300 L140 406 L82 406 Z"
            fill="#fff1dc"
            stroke="#ecd6b4"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M150 300 L150 240" stroke="#ecd6b4" strokeWidth="2" />
          <rect x="108" y="230" width="84" height="12" rx="5" fill="#f4dcb8" />
          <circle cx="150" cy="236" r="4" fill="#ffcc4d" />

          {/* sneakers */}
          <path d="M80 404 h62 q5 15 -5 19 h-54 q-8 -9 -3 -19z" fill="#fff" stroke="#e4d9cf" strokeWidth="2" />
          <path d="M82 418 h58" stroke={CORAL} strokeWidth="4" strokeLinecap="round" />
          <path d="M158 404 h62 q5 10 -3 19 h-54 q-10 -4 -5 -19z" fill="#fff" stroke="#e4d9cf" strokeWidth="2" />
          <path d="M160 418 h58" stroke={CORAL} strokeWidth="4" strokeLinecap="round" />

          {/* long hair behind */}
          <path d="M96 100 Q80 190 104 226 Q124 214 124 190 Z" fill={HAIR} />
          <path d="M204 100 Q220 190 196 226 Q176 214 176 190 Z" fill={HAIR} />

          {/* crop top, neck, blazer */}
          <path d="M114 190 Q150 204 186 190 L190 240 L110 240 Z" fill={CORAL} />
          <rect x="139" y="160" width="22" height="34" rx="8" fill="#e9ac86" />
          <path
            d="M112 186 Q150 172 188 186 L196 214 L190 276 L168 276 L162 196 L138 196 L132 276 L110 276 L104 214 Z"
            fill={MINT}
          />
          <path d="M138 196 L122 188 L126 232 L132 276 Z" fill={MINT_DARK} />
          <path d="M162 196 L178 188 L174 232 L168 276 Z" fill={MINT_DARK} />

          {/* waving arm */}
          <g>
            {!reduceMotion && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="-6 114 200;10 114 200;-6 114 200"
                dur="1.4s"
                repeatCount="indefinite"
              />
            )}
            <path d="M114 200 L76 150" stroke={MINT} strokeWidth="26" strokeLinecap="round" />
            <path d="M114 200 L76 150" stroke={MINT_DARK} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
            <circle cx="70" cy="136" r="13" fill={SKIN} />
            <path d="M62 126 l-2 -10 M70 122 l0 -12 M78 126 l3 -10" stroke={SKIN} strokeWidth="6" strokeLinecap="round" />
          </g>

          {/* other arm + laptop showing the score */}
          <path
            d="M186 202 L208 250 L184 282"
            stroke={MINT}
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <rect x="124" y="238" width="70" height="44" rx="6" fill="#fff" stroke="#c9d1e6" strokeWidth="3" />
          <circle cx="148" cy="260" r="12" fill="none" stroke="#ffe0bf" strokeWidth="5" />
          <path d="M148 248 A12 12 0 1 1 138 267" fill="none" stroke="#f9620f" strokeWidth="5" strokeLinecap="round" />
          <text x="176" y="265" fontSize="14" fontWeight="700" fill="#e2470b" textAnchor="middle" fontFamily="Arial, sans-serif">
            92
          </text>
          <rect x="116" y="282" width="86" height="7" rx="3.5" fill="#c9d1e6" />
          <circle cx="186" cy="282" r="11" fill={SKIN} />

          {/* head: follows the cursor */}
          <motion.g animate={{ x: look.x * 4, y: look.y * 3, rotate: look.x * 5 }} transition={FOLLOW_SPRING}>
            <circle cx="150" cy="50" r="22" fill={HAIR} />
            <ellipse cx="150" cy="68" rx="24" ry="6" fill={CORAL} />
            <ellipse cx="150" cy="106" rx="58" ry="60" fill={HAIR} />
            <circle cx="106" cy="120" r="8" fill={SKIN} />
            <circle cx="194" cy="120" r="8" fill={SKIN} />
            <circle cx="104" cy="136" r="7" fill="none" stroke="#ffcc4d" strokeWidth="2.5" />
            <circle cx="196" cy="136" r="7" fill="none" stroke="#ffcc4d" strokeWidth="2.5" />
            <ellipse cx="150" cy="116" rx="44" ry="50" fill={SKIN} />
            <path d="M104 104 Q116 62 150 66 Q184 62 196 104 Q176 84 150 92 Q124 84 104 104 Z" fill={HAIR} />
            <path d="M118 80 Q130 70 146 70" stroke="#5a3524" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M118 100 Q130 94 142 100" stroke={HAIR} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M158 100 Q170 94 182 100" stroke={HAIR} strokeWidth="3" fill="none" strokeLinecap="round" />

            <ellipse cx="130" cy="118" rx="11" ry="13" fill="#fff" stroke={HAIR} strokeWidth="1.5" />
            <ellipse cx="170" cy="118" rx="11" ry="13" fill="#fff" stroke={HAIR} strokeWidth="1.5" />
            <motion.g animate={{ x: look.x * 3.5, y: look.y * 3.5 }} transition={FOLLOW_SPRING}>
              <circle cx="130" cy="118" r="7" fill="#4a2a1c" />
              <circle cx="130" cy="118" r="3.4" fill="#1d0f09" />
              <circle cx="132.5" cy="115" r="2" fill="#fff" />
              <circle cx="170" cy="118" r="7" fill="#4a2a1c" />
              <circle cx="170" cy="118" r="3.4" fill="#1d0f09" />
              <circle cx="172.5" cy="115" r="2" fill="#fff" />
            </motion.g>
            <path d="M118 108 q-4 -3 -6 -7 M182 108 q4 -3 6 -7" stroke={HAIR} strokeWidth="2.4" strokeLinecap="round" fill="none" />
            <ellipse cx="116" cy="140" rx="9" ry="5.5" fill={CORAL} opacity="0.5" />
            <ellipse cx="184" cy="140" rx="9" ry="5.5" fill={CORAL} opacity="0.5" />
            <path d="M148 130 q2 5 5 0" stroke="#d9966f" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M134 146 Q150 168 166 146 Q150 152 134 146 Z" fill="#d6405c" />
            <path d="M140 148 Q150 152 160 148 L158 152 Q150 155 142 152 Z" fill="#fff" />
          </motion.g>
        </Box>
      </MotionBox>
    </Box>
  );
}

export default RoasterMascot;
