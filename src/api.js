const URL = 'https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=USD,UAH,EUR'

export const loadRates = async () => {
	return await fetch(URL).then(data => data.json())
}

