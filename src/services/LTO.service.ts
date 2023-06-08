import { Account, CancelLease, Lease, LTO, Transaction } from "@ltonetwork/lto"
import StorageService from "./Storage.service"
import { TypedTransaction } from "../interfaces/TypedTransaction"

export const lto = new LTO(process.env.LTO_NETWORK_ID)
if (process.env.LTO_API_URL) lto.nodeAddress = process.env.LTO_API_URL

export default class LTOService {
    static account?: Account

    public static isUnlocked = (): boolean => {
        return !!this.account
    }

    public static unlock = async (password: string | undefined, signature?: string) => {
        const [encryptedAccount] = await StorageService.getItem('@accountData')
        const encodedSignature = signature && encodeURIComponent(signature)

        const seedIndex = encodedSignature ? 0 : 1
        const seed = encryptedAccount.seed[seedIndex]

        if (signature) {
            this.account = lto.account({ seedPassword: encodedSignature, seed })
        } else {
            this.account = lto.account({ seedPassword: password, seed })
        }
    }

    public static lock = () => {
        delete this.account
    }

    public static getAccount = async (): Promise<Account> => {
        if (!this.account) {
            throw new Error("Not logged in")
        }

        return this.account
    }

    public static storeAccount = async (nickname: string, password: string, signature?: string) => {
        if (!this.account) {
            throw new Error("Account not created")
        }
        const encodedSignature = signature && encodeURIComponent(signature)

        const encryptedWithSignature = encodedSignature ? this.account.encryptSeed(encodedSignature) : undefined
        const encryptedWithPassword = this.account.encryptSeed(password)


        await StorageService.setItem('@accountData', [{
            nickname: nickname,
            address: this.account.address,
            seed: [encryptedWithSignature, encryptedWithPassword],
        }])
    }

    public static createAccount = async () => {
        try {
            this.account = lto.account()
        } catch (error) {
            throw new Error('Error creating account')
        }
    }

    public static importAccount = async (seed: string) => {
        try {
            this.account = lto.account({ seed: seed })
        } catch (error) {
            throw new Error('Error importing account from seeds')
        }
    }

    public static deleteAccount = async () => {
        await Promise.all([
            StorageService.removeItem('@accountData'),
            StorageService.removeItem('@userAlias')
        ])
        this.lock()
    }

    private static apiUrl = (path: string): string => {
        return lto.nodeAddress.replace(/\/$/g, '') + path
    }

    public static getBalance = async (address: string) => {
        try {
            const url = this.apiUrl(`/addresses/balance/details/${address}`)
            const response = await fetch(url)
            return response.json()
        } catch (error) {
            throw new Error('Error fetching account details')
        }
    }

    public static getTransactions = async (address: string, limit?: number, page = 1) => {
        const pending = await this.getPendingTransactions(address)

        let offset
        if (!limit) {
            offset = 0
            limit = 100
        } else {
            offset = limit * (page - 1) - pending.length
            if (offset < 0) {
                limit = limit + offset
                offset = 0
            }
        }

        return ([] as TypedTransaction[]).concat(
            pending.slice(limit * (page - 1), limit),
            limit > 0 ? await this.getProcessedTransactions(address, limit, offset) : []
        )
    }

    private static getPendingTransactions = async (address: string) => {
        const url = this.apiUrl(`/transactions/unconfirmed`)
        const response = await fetch(url)
        const utx: TypedTransaction[] = await response.json()

        const txs = utx.filter(tx => tx.sender === address || tx.recipient === address)
        txs.forEach(tx => { tx.pending = true })

        return txs
    }

    private static getProcessedTransactions = async (address: string, limit = 100, offset = 0) => {
        const url = this.apiUrl(`/transactions/address/${address}?limit=${limit}&offset=${offset}`)
        const response = await fetch(url)
        const [txs] = await response.json()

        return txs
    }

    public static getLeases = async (address: string) => {
        const [pending, active] = await Promise.all([
            this.getPendingTransactions(address),
            this.getActiveLeases(address)
        ])
        const leases = [...pending.filter(tx => tx.type === Lease.TYPE), ...active]

        for (const cancel of pending.filter(tx => tx.type === CancelLease.TYPE)) {
            const lease = leases.find(tx => tx.id === cancel.leaseId)
            if (lease) lease.pending = true
        }

        return leases
    }

    private static getActiveLeases = async (address: string) => {
        const url = this.apiUrl(`/leasing/active/${address}`)

        const response = await fetch(url)
        return response.json()
    }

    public static broadcast = async (transaction: Transaction) => {
        const url = this.apiUrl('/transactions/broadcast')
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaction)
        })

        if (response.status >= 400) throw new Error('Broadcast transaction failed: ' + await response.text())
    }

    public static isValidAddress = (address: string): boolean => {
        try {
            return lto.isValidAddress(address)
        } catch (e) {
            return false
        }
    }
}
