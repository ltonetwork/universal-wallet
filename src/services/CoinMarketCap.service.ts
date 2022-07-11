export default class CoinMarketCapService {

    public static getCoinInfo = async () => {
        try {                                                                                  // add 'latest' instead of *
            const response = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/*?${process.env.CMC_API}&id=3714`)
            return await response.json()
        } catch (error) {
            return console.log(error)
        }
    }
}


