export default class CoinMarketCapService {

    public static getCoinInfo = async () => {
        try {
            const response = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=${process.env.CMC_API_KEY}&id=3714`)
            const coinInfo = response
            return coinInfo.json()
        } catch (error) {
            throw new Error('Error fetching coin info')
        }
    }
}


