
export function sortCustomizationOptions(options) {
  if (!Array.isArray(options)) return [];

  const SPECIAL_NAME = "Andet, se note".toLowerCase();

  return options
    .slice()
    .sort((a, b) => {
      const aSpecial = a.name.toLowerCase() === SPECIAL_NAME;
      const bSpecial = b.name.toLowerCase() === SPECIAL_NAME;

      // "Andet, se note" is always last
      if (aSpecial && !bSpecial) return 1;
      if (!aSpecial && bSpecial) return -1;

      // Normal alphabetical sorting 
      return a.name.localeCompare(b.name, "da", { sensitivity: "base" });
    });
}
