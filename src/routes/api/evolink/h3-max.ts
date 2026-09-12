import { createFileRoute } from '@tanstack/react-router';
import { GET, POST } from '@/routes/api/fal/h3-max';

export const Route = createFileRoute('/api/evolink/h3-max')({
  server: { handlers: { GET, POST } },
});
