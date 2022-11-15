import {LTO, Transaction} from "@ltonetwork/lto"
export const lto = new LTO(process.env.LTO_NETWORK_ID)
if (process.env.LTO_API_URL) lto.nodeAddress = process.env.LTO_API_URL;

export default class ApiClientService {

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
            const url = lto.nodeAddress.replace(/\/$/g, '') + '/addresses/balance/details/' + address
            const response = await fetch(url)
            return response.json()
        } catch (error) {
            throw new Error('Error fetching account details')
        }
    }

    public static broadcast = async (transaction: Transaction) => {
        return lto.node.broadcast(transaction);
    }
}
