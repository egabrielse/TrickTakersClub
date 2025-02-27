import { generateSlug } from "random-word-slugs";
import { Size } from "../types/size";
import { scaleBySize } from "./size";

/**
 * Converts avatar size to pixels.
 * @param size name of the size ("small", "medium", etc.)
 * @returns pixel size of the avatar
 */
export function getAvatarPixelSize(size: Size): number {
  const basePixelSize = 32;
  return scaleBySize(size, basePixelSize);
}

/**
 * Converts avatar size to font size.
 * @param size name of the size ("small", "medium", etc.)
 * @returns font size of the avatar
 */
export function getAvatarFontSize(size: Size, charCount: 1 | 2 | 3): number {
  const baseFontSize = 24;
  const scaledPixelSize = scaleBySize(size as Size, baseFontSize);
  if (charCount === 3) return scaledPixelSize * 0.5;
  if (charCount === 2) return scaledPixelSize * 0.75;
  return scaledPixelSize;
}

/**
 * Converts display name size to font size.
 * @param size name of the size ("small", "medium", etc.)
 * @returns font size of the display name
 */
export function getDisplayNameFontSize(size: Size): number {
  const baseFontSize = 18;
  return scaleBySize(size, baseFontSize);
}

/**
 * Returns the initials of a username.
 * @param username username to get initials for
 * @returns initials (e.g. "JD" "for John Doe")
 */
export function getInitials(username: string): string {
  const nameArr = username.split(" ");
  return nameArr
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

/**
 * Generates a random username consisting of two words (e.g. "Red Apple").
 * @returns a random username
 */
export function generateDisplayName() {
  return generateSlug(2, { format: "title" });
}

/**
 * Generates a hex color based on the username.
 * @param username username to generate color for
 * @returns hex color (e.g. "#FF0000")
 */
export function usernameToColor(username: string): string {
  let hash = 0;
  let color = "#";
  for (let i = 0; i < username.length; i += 1) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}
