import {BaseBlockstore} from "blockstore-core/base"
import {importer} from "ipfs-unixfs-importer"

class DummyBlockstore extends BaseBlockstore {
  async put(): Promise<any> { }
  async has(): Promise<boolean> { return false }
}

export default async function calculateCid(files: Array<{name: string, read: () => Promise<Uint8Array>}>): Promise<string> {
  const source = await Promise.all(
    files.map(async file => ({
      path: `./${file.name}`,
      content: await file.read(),
    }))
  )

  const blockstore = new DummyBlockstore()

  for await (const entry of importer(source, blockstore)) {
    if (entry.path === '' && entry.unixfs?.type === 'directory') return entry.cid.toString()
  }

  throw new Error("Failed to calculate directory CID: importer did not find a directory entry in the input files")
}
