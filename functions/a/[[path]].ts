import { handleAnalytics } from '../../src/lib/analytics-forward';

interface Env {
  ANALYTICS_FORWARDING_URL?: string;
  ANALYTICS_WEBSITE_ID?: string;
}

export const onRequest: PagesFunction<Env> = ({ request, env }) => handleAnalytics(request, env);
