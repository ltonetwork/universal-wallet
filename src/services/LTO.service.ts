import {Account, LTO, Transaction} from "@ltonetwork/lto"
import LocalStorageService from "./LocalStorage.service";
export const lto = new LTO(process.env.LTO_NETWORK_ID)
if (process.env.LTO_API_URL) lto.nodeAddress = process.env.LTO_API_URL;

export default class LTOService {
    static account?: Account;

    public static isUnlocked = (): boolean => {
        return !!LTOService.account
    }

    public static unlock = async (password: string) => {
        const [encryptedAccount] = await LocalStorageService.getData('@accountData')
        LTOService.account = lto.account({seedPassword: password, ...encryptedAccount})
    }

    public static lock = () => {
        delete LTOService.account
    }

    public static getAccount = async (): Promise<Account> => {
        if (!LTOService.account) {
            throw new Error("Not logged in")
        }

        return LTOService.account
    }

    public static storeAccount = async (nickname: string, password: string) => {
        if (!LTOService.account) {
            throw new Error("Account not created")
        }

        await LocalStorageService.storeData('@accountData', [{
            nickname: nickname,
            address: LTOService.account.address,
            seed: LTOService.account.encryptSeed(password),
        }])
    }

    public static createAccount = async () => {
        try {
            LTOService.account = lto.account()
        } catch (error) {
            throw new Error('Error creating account')
        }
    }

    public static importAccount = async (seed: string) => {
        try {
            LTOService.account = lto.account({ seed: seed })
        } catch (error) {
            throw new Error('Error importing account from seeds')
        }
    }

    public static getAccountDetails = async (address: string) => {
        try {
            const url = lto.nodeAddress.replace(/\/$/g, '') + '/addresses/balance/details/' + address
            const response = await fetch(url)
            return response.json()
        } catch (error) {
            throw new Error('Error fetching account details')
        }
    }

    public static broadcast = async (transaction: Transaction) => {
        await fetch(lto.nodeAddress.replace(/\/$/g, '') + '/broadcast', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaction)
        })
    }
}
