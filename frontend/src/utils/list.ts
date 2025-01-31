export const relistStartingWith = <T>(list: T[], start: T): T[] => {
    const index = list.indexOf(start);
    if (index === -1) {
        return list
    }
    return [...list.slice(index), ...list.slice(0, index)];
}