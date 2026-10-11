import { Alert, AlertDescription, AlertIcon, Box, Divider, Flex, FormLabel, Heading, Stack, Text, chakra } from '@chakra-ui/react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, PageWrapper } from '../components/ui';
import { IntensityPicker, RecentRoasts, RepoUrlInput, RoastMeButton } from '../components/roast';
import { DEFAULT_INTENSITY, isValidRepoUrl } from '../lib/roastUi';
import { getErrorMessage } from '../services/api';
import { createRoast } from '../services/roastApi';
import { fireGradient } from '../theme';
import type { RoastIntensity } from '../types/roast';

const INVALID_URL_MESSAGE = 'Valid GitHub repo URL kudu da — e.g. https://github.com/owner/repo';

export default function NewRoastPage() {
  const navigate = useNavigate();
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [intensity, setIntensity] = useState<RoastIntensity>(DEFAULT_INTENSITY);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [touched, setTouched] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validate = (value: string): string | null => {
    if (!value.trim()) return 'Repo URL podu da!';
    return isValidRepoUrl(value) ? null : INVALID_URL_MESSAGE;
  };

  const handleUrlChange = (value: string): void => {
    setRepoUrl(value);
    setServerError(null);
    if (touched) setUrlError(validate(value));
  };

  const handleBlur = (): void => {
    if (!repoUrl) return;
    setTouched(true);
    setUrlError(validate(repoUrl));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setTouched(true);
    const validation = validate(repoUrl);
    setUrlError(validation);
    if (validation) return;

    setIsSubmitting(true);
    setServerError(null);
    try {
      const roast = await createRoast({ repo_url: repoUrl.trim(), intensity });
      navigate(`/roasts/${roast.id}`);
    } catch (err: unknown) {
      setServerError(getErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper maxW="container.md">
      <Stack spacing={2} mb={8} textAlign={{ base: 'left', md: 'center' }}>
        <Heading as="h1" size={{ base: 'xl', md: '2xl' }}>
          Un repo-va{' '}
          <chakra.span bgGradient={fireGradient} bgClip="text">
            roast
          </chakra.span>{' '}
          pannalaama? 🔥
        </Heading>
        <Text color="text.muted" fontSize={{ base: 'md', md: 'lg' }}>
          Public GitHub repo link podu, spice level choose pannu. Tanglish roast + score + fix tips varum.
        </Text>
      </Stack>

      <GlassCard static>
        <chakra.form onSubmit={(e: FormEvent<HTMLFormElement>) => void handleSubmit(e)} noValidate>
          <Stack spacing={6}>
            <RepoUrlInput
              value={repoUrl}
              onChange={handleUrlChange}
              onBlur={handleBlur}
              error={urlError}
              isDisabled={isSubmitting}
            />

            <Box>
              <FormLabel as="p" mb={3}>
                Spice level
              </FormLabel>
              <IntensityPicker value={intensity} onChange={setIntensity} isDisabled={isSubmitting} />
            </Box>

            {serverError && (
              <Alert status="error" borderRadius="xl" data-testid="server-error">
                <AlertIcon />
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <Flex justify="center">
              <RoastMeButton isLoading={isSubmitting} />
            </Flex>
          </Stack>
        </chakra.form>
      </GlassCard>

      <Divider my={10} borderColor="border.subtle" />

      <RecentRoasts />
    </PageWrapper>
  );
}
