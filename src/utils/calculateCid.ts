import {BlackHoleBlockstore} from "blockstore-core/black-hole"
import {importer} from "ipfs-unixfs-importer"

export default async function calculateCid(files: Array<{name: string, read: () => Promise<Uint8Array>}>): Promise<string> {
  const source = await Promise.all(
    files.map(async file => ({
      path: `./${file.name}`,
      content: await file.read(),
    }))
  )

  const blockstore = new BlackHoleBlockstore()

  for await (const entry of importer(source, blockstore)) {
    if (entry.path === '' && entry.unixfs?.type === 'directory') return entry.cid.toString()
  }

  throw new Error("Failed to calculate directory CID: importer did not find a directory entry in the input files")
}
