export type RouteName =
  | "configure"
  | "concept"
  | "generating"
  | "download"
  | "failed"
  | "missing"
  | "files"
  | "settings"
  | "help"
  | "profile"
  | "history"
  | "storage"
  | "invite";

export interface RouteState {
  name: RouteName;
  runId?: string;
}

export const toyboxBasePath = "/lusie/ai";

const routeSlugs: Record<RouteName, string> = {
  configure: "/configure",
  concept: "/concept",
  generating: "/generate",
  download: "/download",
  failed: "/failed",
  missing: "/download",
  files: "/files",
  settings: "/settings",
  help: "/help",
  profile: "/profile",
  history: "/history",
  storage: "/storage",
  invite: "/invite"
};

export const routePaths: Record<RouteName, string> = {
  configure: `${toyboxBasePath}${routeSlugs.configure}`,
  concept: `${toyboxBasePath}${routeSlugs.concept}`,
  generating: `${toyboxBasePath}${routeSlugs.generating}`,
  download: `${toyboxBasePath}${routeSlugs.download}`,
  failed: `${toyboxBasePath}${routeSlugs.failed}`,
  missing: `${toyboxBasePath}${routeSlugs.missing}`,
  files: `${toyboxBasePath}${routeSlugs.files}`,
  settings: `${toyboxBasePath}${routeSlugs.settings}`,
  help: `${toyboxBasePath}${routeSlugs.help}`,
  profile: `${toyboxBasePath}${routeSlugs.profile}`,
  history: `${toyboxBasePath}${routeSlugs.history}`,
  storage: `${toyboxBasePath}${routeSlugs.storage}`,
  invite: `${toyboxBasePath}${routeSlugs.invite}`
};

export function parseRoute(pathname: string): RouteState {
  const normalizedPath = stripToyboxBasePath(pathname);

  if (normalizedPath === "/" || normalizedPath === routeSlugs.configure) return { name: "configure" };
  if (normalizedPath === routeSlugs.concept) return { name: "concept" };
  if (normalizedPath === routeSlugs.generating) return { name: "generating" };

  const downloadMatch = /^\/download\/([^/]+)$/.exec(normalizedPath);
  if (downloadMatch) return { name: "download", runId: decodeURIComponent(downloadMatch[1]) };
  if (normalizedPath === routeSlugs.download) return { name: "download" };

  const failedMatch = /^\/failed\/([^/]+)$/.exec(normalizedPath);
  if (failedMatch) return { name: "failed", runId: decodeURIComponent(failedMatch[1]) };
  if (normalizedPath === routeSlugs.failed) return { name: "failed" };

  const utilityRoute = Object.entries(routeSlugs).find(
    ([name, path]) => path === normalizedPath && !["download", "failed", "missing"].includes(name)
  );
  if (utilityRoute) return { name: utilityRoute[0] as RouteName };

  return { name: "configure" };
}

function stripToyboxBasePath(pathname: string) {
  if (pathname === toyboxBasePath) return "/";
  if (pathname.startsWith(`${toyboxBasePath}/`)) {
    const stripped = pathname.slice(toyboxBasePath.length);
    return stripped || "/";
  }
  return pathname;
}
