export function parseZoneName(domain: string): string {
  const parts = domain.split(".");
  if (parts.length < 2) {
    throw new Error(
      `Unable to parse zoneName from "${domain}". Please specific either zoneId or zoneName in configuration.`
    );
  }
  return `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
}
