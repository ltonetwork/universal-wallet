import { LTO } from "@ltonetwork/lto"

export default class ApiClientService {

    public static getAccountDetails = async (address: string) => {
        return fetch(`https://testnet.lto.network/addresses/balance/details/${address}`)
            .then(response => response.json())
    }
    
    public static getAccountBalance = async (account: string) => {
        const lto = new LTO('T')
        lto.getBalance(account)        
     } 
}
