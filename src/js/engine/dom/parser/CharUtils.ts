export function isAlpha(char: string) {
    return char.charCodeAt(0) >= 65 && char.charCodeAt(0) <= 122
}

export function isWhiteSpace(char: string): boolean {
        return [9, 10, 13, 32].includes(char.charCodeAt(0));
}