import {client as apiClient} from './apiService';

async function getEthEurRate() {
  let response  = await apiClient.get("https://api.kraken.com/0/public/Ticker?pair=ETHEUR");
  return parseFloat(response.data.result.XETHZEUR.c[0]);
}

let currencyConversionService = {
  getEthEurRate: getEthEurRate
};

export default currencyConversionService;