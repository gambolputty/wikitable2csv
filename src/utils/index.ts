export * from "./parseTable";
export * from "./createApiUrl";

export const startCase = (text: string) => {
  return text
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
    .trim();
};
