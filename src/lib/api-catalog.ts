// Builds the RFC 9727 API catalog (application/linkset+json) from the same
// origins the rest of the site already names.

import { APP_URL } from "../data/links";

const SITE = "https://lector.dev";

export type LinkTarget = {
  href: string;
  type: string;
};

export type CatalogEntry = {
  anchor: string;
  "service-desc": LinkTarget[];
  "service-doc": LinkTarget[];
  status?: LinkTarget[];
};

export type ApiCatalog = {
  linkset: CatalogEntry[];
};

export const API_CATALOG_CONTENT_TYPE =
  'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"';

export function buildApiCatalog(): ApiCatalog {
  return {
    linkset: [
      {
        anchor: APP_URL,
        "service-desc": [
          {
            href: `${SITE}/openapi.json`,
            type: "application/json",
          },
        ],
        "service-doc": [
          {
            href: `${SITE}/docs/api/`,
            type: "text/html",
          },
        ],
        status: [
          {
            href: `${APP_URL}/health`,
            type: "application/json",
          },
        ],
      },
    ],
  };
}
