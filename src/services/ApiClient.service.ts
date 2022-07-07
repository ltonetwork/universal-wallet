import { LTO } from "@ltonetwork/lto"
// import { LTO_API_URL } from "@env"

export default class ApiClientService {

    public static getAccountDetails = async (address: string) => {
        return fetch(process.env.LTO_API_URL + address)
            .then(response => response.json())
    }

    public static getAccountBalance = async (account: string) => {
        const lto = new LTO('T')
        lto.getBalance(account)
    }
}
