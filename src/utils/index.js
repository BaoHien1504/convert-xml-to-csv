export const cutStringBetween = (text, lang) => {
  const startPattern = lang === "en" ? "<!--:en---->" : "<!--:ja---->",
    endPattern = "<!--:-->",
    pattern = new RegExp(
      `(?<=${escapeRegExp(startPattern)}).*?(?=${escapeRegExp(endPattern)})`,
      "gs"
    ),
    result = text.match(pattern);
  return result ? result[0] : "";
};

export const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escapes special characters
};
