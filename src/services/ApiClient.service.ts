import { LTO } from "@ltonetwork/lto"
export const lto = new LTO(process.env.LTO_NETWORK_ID)

export default class ApiClientService {

    public static newLTO = async () => {
        return new LTO(process.env.LTO_NETWORK_ID)
    }

    public static createAccount = async () => {
        try {
            return lto.account()
        } catch (error) {
            throw new Error('Error creating account')
        }
    }

    public static importAccount = async (seed: string) => {
        try {
            return lto.account({ seed: seed })
        } catch (error) {
            throw new Error('Error importing account from seeds')
        }
    }

    public static getAccountDetails = async (address: string) => {
        try {
            const response = await fetch(process.env.LTO_API_URL + address)
            return response.json()
        } catch (error) {
            throw new Error('Error fetching account details')
        }
    }

    public static getAccountBalance = (account: string) => {
        try {
            return lto.getBalance(account)
        } catch (error) {
            throw new Error('Error fetching account balance')
        }
    }
}
