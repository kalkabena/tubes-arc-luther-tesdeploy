const axios = require('axios');

const API_KEY = 'fe3773a76918c8757761f6cb';
const BASE_CURRENCY = 'IDR'; // Menetapkan Rupiah (IDR) sebagai mata uang dasar default.

// Mendapatkan kurs mata uang dari API
async function getExchangeRates(baseCurrency = BASE_CURRENCY) {
  try {
    // Memeriksa apakah permintaan API memberikan hasil yang sukses.
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`);
    if (response.data && response.data.result === 'success') {
      return response.data.conversion_rates;
    } else {
      console.error('Gagal mendapatkan data kurs:', response.data['error-type'] || 'Respon API tidak sukses');
      return null;
    }
  } catch (error) {
    console.error('Error saat mengambil data kurs:', error.message);
    if (error.response) {
      // Error dari server API (misalnya API key salah, dll.)
      console.error('Detail error API:', error.response.data);
    }
    return null;
  }
}

// Mengubah sejumlah Rupiah ke mata uang lain.
async function convertFromRupiah(amount, targetCurrency) {
  // Validasi input: jumlah harus angka positif.
  if (typeof amount !== 'number' || amount <= 0) {
    console.error('Jumlah harus berupa angka positif.');
    return null;
  }
  // Validasi input: kode mata uang harus 3 huruf.
  if (typeof targetCurrency !== 'string' || targetCurrency.length !== 3) {
    console.error('Kode mata uang tujuan tidak valid.');
    return null;
  }

  const rates = await getExchangeRates(); // Mendapatkan kurs dengan IDR sebagai basis

  if (rates && rates[targetCurrency.toUpperCase()]) {
    const exchangeRate = rates[targetCurrency.toUpperCase()];
    const convertedAmount = amount * exchangeRate;
    return convertedAmount;
  } else {
    console.error(`Tidak dapat menemukan kurs untuk ${targetCurrency.toUpperCase()} atau gagal mengambil data kurs.`);
    return null;
  }
}

// Mengubah mata uang lain ke Rupiah.
async function convertToRupiah(amount, sourceCurrency) {
    // Validasi input: jumlah harus angka positif.
    if (typeof amount !== 'number' || amount <= 0) {
        console.error('Jumlah harus berupa angka positif.');
        return null;
    }
    // Validasi input: kode mata uang harus 3 huruf.
    if (typeof sourceCurrency !== 'string' || sourceCurrency.length !== 3) {
        console.error('Kode mata uang sumber tidak valid.');
        return null;
    }

    // Ambil data kurs dengan mata uang sumber sebagai basisnya.
    const ratesFromSource = await getExchangeRates(sourceCurrency.toUpperCase());

    if (ratesFromSource && ratesFromSource[BASE_CURRENCY]) { // BASE_CURRENCY adalah 'IDR'
        const exchangeRateToIDR = ratesFromSource[BASE_CURRENCY];
        const convertedAmount = amount * exchangeRateToIDR;
        return convertedAmount;
    } else {
        console.error(`Tidak dapat menemukan kurs dari ${sourceCurrency.toUpperCase()} ke IDR atau gagal mengambil data kurs.`);
        return null;
    }
}

// Ekspor fungsi agar bisa digunakan di file lain 
module.exports = {
  getExchangeRates,
  convertFromRupiah,
  convertToRupiah
};