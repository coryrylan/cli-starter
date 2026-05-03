export function capitalize(text: string, shouldCapitalize: boolean): string {
  return shouldCapitalize ? text.toUpperCase() : text;
}
