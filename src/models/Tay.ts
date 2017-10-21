export interface ITayInfo {
    files: Array<{
        url: string,
        noseInPixels: { x: number, y: number },
        sizeInPixels: { width: number, height: number },
        noseInFractions: { x: number, y: number }
    }>;
}