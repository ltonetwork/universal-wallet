import { LTO } from "@ltonetwork/lto"

export default class ApiClientService {

    public static getAccountDetails = async (address: string) => {
        try {
            const response = await fetch(process.env.LTO_API_URL + address)
            return await response.json()
        } catch (error) {
            return console.log(error)
        }
    }

    public static getAccountBalance = (account: string) => {
        const lto = new LTO('T')
        return lto.getBalance(account)
    }
}
