'use client';

import PageNotFoundOrAccessDenied from '@/components/PageNotFoundOrAccessDenied';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // You could optionally log the error to a service like Sentry
  // console.error(error);

  const actionButton = (
    <Button
      onClick={() => reset()}
      className="mt-8"
    >
      Try again
    </Button>
  );

  return (
    <PageNotFoundOrAccessDenied
      type="genericError"
      actionButton={actionButton}
    />
  );
}