import { Button, Heading, Stack, Text } from '@chakra-ui/react';
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error('Unhandled UI error', error, info.componentStack);
    }
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <Stack align="center" justify="center" minH="100vh" spacing={4} px={4} textAlign="center">
          <Heading size="lg">Aiyo, edho thappa poachu 😵</Heading>
          <Text color="text.muted">Something broke. Reload panni paaru.</Text>
          <Button onClick={this.handleReload}>Reload</Button>
        </Stack>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
