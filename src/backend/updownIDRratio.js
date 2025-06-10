const axios = require('axios');
const BASE_CURRENCY = "IDR"; 

async function compareHistoricalPeriod(targetCurrency, period) {
  const today = new Date();
  const dayperiodpast = new Date();
  dayperiodpast.setDate(today.getDate() - period);

  const year = dayperiodpast.getFullYear();
  const month = String(dayperiodpast.getMonth() + 1).padStart(2, '0');
  const day = String(dayperiodpast.getDate()).padStart(2, '0');
  console.log(year, month, day);
  console.log(today.getFullYear(), today.getMonth(), today.getDay());
  console.log(BASE_CURRENCY, targetCurrency);

  try {
    const todayRes = await axios(`https://api.frankfurter.dev/v1/latest?base=${BASE_CURRENCY}`);
    const todayRate = todayRes.data.rates[targetCurrency]
    
    if (!todayRate){
        console.log("Data today not fetched");
    }

    const pastRes = await axios(`https://api.frankfurter.dev/v1/${year}-${month}-${day}?base=${BASE_CURRENCY}&symbols=${targetCurrency}`);
    const pastRate = pastRes.data.rates[targetCurrency];

    if (!todayRate){
        console.log("Data past rate not fetched");
    }

    const diff = todayRate - pastRate;
    const percentChange = (diff / pastRate) * 100;

    console.log(`${targetCurrency} → ${BASE_CURRENCY}`);
    console.log(`Today: ${todayRate}`);
    console.log(`${period} Days Ago: ${pastRate}`);
    console.log(`Change: ${diff.toFixed(4)} (${percentChange.toFixed(4)}%)`);

    return {
      todayRate,
      pastRate,
      percentChange: Number(percentChange.toFixed(10))
    };
  } catch (error) {
    console.error('❌ Failed to fetch data from Frankfurter API:', error.message);
    return null;
  }
}

module.exports = compareHistoricalPeriod;
