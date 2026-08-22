import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

/**
 * Lazy on purpose: createClient() throws synchronously when projectId is
 * empty, and this module is imported at the top of lib/content.ts — eagerly
 * constructing the client would crash every page before the
 * isSanityConfigured guard in content.ts ever runs. Only called from inside
 * that guard, so it's never invoked while unconfigured.
 */
let cachedClient: SanityClient | undefined;

export function getSanityClient(): SanityClient {
  if (!cachedClient) {
    cachedClient = createClient({
      projectId: projectId ?? "",
      dataset,
      apiVersion,
      useCdn: true,
    });
  }
  return cachedClient;
}
