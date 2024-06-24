/**
 * Generates a hex color based on the username.
 * @param username username to generate color for
 * @returns hex color (e.g. "#FF0000")
 */
export function usernameToColor(username: string): string {
    let hash = 0;
    let i;
    let color = '#';

    for (i = 0; i < username.length; i += 1) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
}

/**
 * Converts avatar size to pixels.
 * @param size name of the size ("small", "medium", etc.)
 * @returns pixel size of the avatar
 */
export function avatarSizeToPixels(size: string): number {
    return size === "xlarge"
        ? 64
        : size === "large"
        ? 44
        : size === "small"
        ? 24
        : 32;
}

/**
 * Converts avatar size to font size.
 * @param size name of the size ("small", "medium", etc.)
 * @returns font size of the avatar
 */
export function avatarSizeToFontSize(size: string): string {
    switch (size) {
        case "xlarge":
            return "2rem";
        case "large":
            return "1.75rem";
        case "medium":
            return "1.25rem";
        default:
            // small
            return "1rem";
    }
}

export function displayNameSizeToFontSize(size: string): string {
    switch (size) {
        case "xlarge":
            return "1.5rem";
        case "large":
            return "1rem";
        case "medium":
            return "0.75rem";
        default:
            // small
            return "0.66rem";
    }
}

/**
 * Returns the initials of a username.
 * @param username username to get initials for
 * @returns initials (e.g. "JD" "for John Doe")
 */
export function initials(username: string): string {
    const nameArr = username.split(' ');
    return nameArr.map((n) => n[0]).join('').toUpperCase();
}