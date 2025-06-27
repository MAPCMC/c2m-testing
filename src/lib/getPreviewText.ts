import stripTags from "striptags";

export function getPreviewText(
  html: string,
  maxLength = 50
) {
  const plainText = stripTags(html, [], " ");
  if (plainText.length <= maxLength) return plainText;
  return plainText.slice(0, maxLength) + "…";
}
