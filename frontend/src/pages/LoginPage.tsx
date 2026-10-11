import {
  Badge,
  Box,
  Circle,
  Code,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import type { IconType } from 'react-icons';
import { FiAward, FiGithub, FiZap } from 'react-icons/fi';
import { Navigate } from 'react-router-dom';
import { AuthSpinner } from '../components/auth/AuthSpinner';
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton';
import { AnimatedList, GlassCard, PageWrapper } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import { DEFAULT_POST_LOGIN_PATH } from '../services/authService';

interface HowItWorksStep {
  icon: IconType;
  title: string;
  description: string;
}

const STEPS: HowItWorksStep[] = [
  {
    icon: FiGithub,
    title: 'Paste your repo',
    description: 'Public GitHub link podu — assignment, side project, edhuvaa irundhaalum.',
  },
  {
    icon: FiZap,
    title: 'Pick your spice level',
    description: 'Mild 🌶️, Medium 🌶️🌶️ or Extra Spicy 🌶️🌶️🌶️ — un heart strength-ku yetha maadhiri.',
  },
  {
    icon: FiAward,
    title: 'Get roasted + improve',
    description: 'Roast, a score out of 100, and actionable tips to level up your code.',
  },
];

export default function LoginPage() {
  const { status } = useAuth();

  if (status === 'loading') return <AuthSpinner />;
  if (status === 'authenticated') return <Navigate to={DEFAULT_POST_LOGIN_PATH} replace />;

  return (
    <PageWrapper maxW="container.xl">
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 10, lg: 16 }} alignItems="center">
        <Stack spacing={6}>
          <Badge alignSelf="flex-start" colorScheme="brand" variant="subtle" px={3} py={1} borderRadius="full">
            AI code review, but make it spicy
          </Badge>
          <Heading as="h1" size="2xl" lineHeight="1.1">
            Assignment Roaster 2.0{' '}
            <Box as="span" role="img" aria-label="fire">
              🔥
            </Box>
          </Heading>
          <Text fontSize="xl" fontWeight="semibold" color="accent.fire">
            Un code-a naanga roast pannuvom, nee improve pannu!
          </Text>
          <Text color="text.muted" fontSize="lg">
            Drop your GitHub repo and get a brutally honest (but helpful) review of your code quality,
            structure, docs, AI best practices and security.
          </Text>
          <Stack spacing={2} align={{ base: 'stretch', sm: 'flex-start' }}>
            <GoogleSignInButton />
            <Text fontSize="sm" color="text.muted">
              Google login mattum dhaan — no passwords to forget.
            </Text>
          </Stack>
        </Stack>

        <GlassCard static aria-label="Sample roast">
          <HStack justify="space-between" mb={4}>
            <HStack spacing={2}>
              <Box as={FiGithub} aria-hidden="true" />
              <Code bg="transparent" fontSize="sm">
                student/todo-app-final-FINAL-v2
              </Code>
            </HStack>
            <Badge colorScheme="red" borderRadius="full" px={2}>
              Extra Spicy 🌶️🌶️🌶️
            </Badge>
          </HStack>
          <Text fontSize="lg" mb={4}>
            “Bro, <Code>main.py</Code>-la 800 lines-a? Idhu file illa, novel. And that API key in{' '}
            <Code>config.py</Code>… GitHub-la public-a podra alavukku generous-a irukka? 😭”
          </Text>
          <HStack spacing={4} align="center">
            <Circle size="56px" bg="brand.500" color="white" fontWeight="bold" fontSize="lg">
              42
            </Circle>
            <Stack spacing={0}>
              <Text fontWeight="semibold">Score: 42/100</Text>
              <Text fontSize="sm" color="text.muted">
                Top tip: split main.py into modules & move secrets to .env
              </Text>
            </Stack>
          </HStack>
        </GlassCard>
      </SimpleGrid>

      <Box mt={{ base: 14, md: 20 }}>
        <Heading as="h2" size="lg" mb={6} textAlign="center">
          How it works
        </Heading>
        <AnimatedList direction={{ base: 'column', md: 'row' }} spacing={6} align="stretch">
          {STEPS.map((step, index) => (
            <GlassCard key={step.title} h="full">
              <HStack spacing={3} mb={3}>
                <Circle size="40px" bg="brand.500" color="white" aria-hidden="true">
                  <Box as={step.icon} />
                </Circle>
                <Heading as="h3" size="sm">
                  {index + 1}. {step.title}
                </Heading>
              </HStack>
              <Text color="text.muted">{step.description}</Text>
            </GlassCard>
          ))}
        </AnimatedList>
      </Box>
    </PageWrapper>
  );
}
