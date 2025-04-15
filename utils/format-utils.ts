export function formatFileNameAsTitle(fileName: string): string {
  //Remove file extensions and replace special characters
  // with spaces
  const withoutExtension = fileName.replace(/\.[^/.]+$/, "");
  const withSpaces = withoutExtension
    .replace(/[-_]+/g, " ") //replace dashes and underscores with spaces
    .replace(/([a-z])([A-Z])/g, "$1 $2"); //Add Space between Camelcase

  //convert to title case
  return withSpaces
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim();
}
