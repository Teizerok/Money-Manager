//URL 
const getUrl = (currency = 'USD') => {
	return `https://min-api.cryptocompare.com/data/price?fsym=${currency}&tsyms=USD,UAH,EUR`
}

//получение курсов валют к доллару
export const loadRates = async () => {
	return await fetch(getUrl()).then(data => data.json())
}

//получение курсов валют к переданой валюте
export const loadRatesFor = async (currency) => {
	return await fetch(getUrl(currency)).then(data => data.json())
}
