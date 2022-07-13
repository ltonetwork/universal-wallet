export default class CoinMarketCapService {

    public static getCoinInfo = async () => {
        try {                                           // Add '_URL' after API do this can work
            const response = await fetch(`${process.env.CMC_API_URL}`)
            return response.json()
        } catch (error) {
            throw new Error('Error fetching coin info')
        }
    }
}


