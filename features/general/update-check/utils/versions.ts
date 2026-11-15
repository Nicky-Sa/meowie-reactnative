export type UpdateState = "required" | "available" | "none";

const isOlderVersion = (version: string, otherVersion: string) => {
  const versionParts = version.split(".").map(Number);
  const otherVersionParts = otherVersion.split(".").map(Number);
  const length = Math.max(versionParts.length, otherVersionParts.length);

  for (let i = 0; i < length; i++) {
    const part = versionParts[i] ?? 0;
    const otherPart = otherVersionParts[i] ?? 0;
    if (part !== otherPart) return part < otherPart;
  }
  return false;
};

export const getUpdateState = (
  appVersion: string,
  minimumVersion: string | undefined,
  latestVersion: string | undefined,
): UpdateState => {
  if (minimumVersion && isOlderVersion(appVersion, minimumVersion)) {
    return "required";
  }
  if (latestVersion && isOlderVersion(appVersion, latestVersion)) {
    return "available";
  }
  return "none";
};
