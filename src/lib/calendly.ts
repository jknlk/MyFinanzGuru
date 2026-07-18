const CALENDLY_API_BASE = "https://api.calendly.com";

async function calendlyFetch(path: string) {
  const token = process.env.CALENDLY_API_TOKEN;
  if (!token) return null;

  const res = await fetch(`${CALENDLY_API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

/**
 * Resolves the public booking link for the Calendly account behind
 * CALENDLY_API_TOKEN, preferring the first active event type over the
 * generic profile URL so visitors land straight on a bookable page.
 */
export async function getCalendlySchedulingUrl(): Promise<string | null> {
  try {
    const me = await calendlyFetch("/users/me");
    const userUri = me?.resource?.uri;
    if (!userUri) return null;

    const eventTypes = await calendlyFetch(
      `/event_types?user=${encodeURIComponent(userUri)}&active=true&count=1`
    );
    const firstEvent = eventTypes?.collection?.[0];

    return firstEvent?.scheduling_url ?? me.resource.scheduling_url ?? null;
  } catch {
    return null;
  }
}
