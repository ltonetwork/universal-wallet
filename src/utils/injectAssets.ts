export default async function injectAssets(
    contents: string,
    getAsset: (filename: string) => Promise<string>
): Promise<string> {
    return contents;
}
