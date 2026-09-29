/** Domains that get a dedicated hub route (`/<id>`) instead of `/domain/<id>`. Single source of truth for App routes and links. */
export const HUBS = ['system-design', 'lld', 'ai', 'cybersecurity', 'dsa', 'cs-core'] as const;
export type Hub = (typeof HUBS)[number];

export const isHub = (id: string): id is Hub => (HUBS as readonly string[]).includes(id);

/** Canonical in-app route for a domain. */
export const domainHref = (id: string) => (isHub(id) ? `/${id}` : `/domain/${id}`);
