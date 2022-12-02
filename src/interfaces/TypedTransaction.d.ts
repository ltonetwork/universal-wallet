export interface TypedTransaction {
    id?: string
    type: number
    version: string
    fee: number
    timestamp?: number
    sender: string
    transfers?: any
    anchors?: any
    associationType?: number
    accounts?: any
    amount?: number
    recipient?: string
    pending?: boolean
}
