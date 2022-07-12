import { LTO } from "@ltonetwork/lto"

export default class ApiClientService {

    public static getAccountDetails = async (address: string) => {
        try {
            const response = await fetch(process.env.LTO_API_URL + address)
            return response.json()
        } catch (error) {
            throw new Error('Error fetching account details')
        }
    }

    public static getAccountBalance = (account: string) => {
        const lto = new LTO('T')
        return lto.getBalance(account)
    }
}
