// lutherceltors/tubes-arc/Tubes-ARC-f8596e02c2996eefe0dce58471fb9523888a73b3/src/backend/currencyConverter.js

// Pastikan Anda sudah menginstal axios: npm install axios
const axios = require('axios');

// GANTI DENGAN API KEY ANDA DARI EXCHANGERATE-API
const API_KEY = 'fe3773a76918c8757761f6cb';
const BASE_CURRENCY = 'IDR'; // Mata uang dasar kita adalah Rupiah

/**
 * Fungsi untuk mendapatkan data kurs mata uang terbaru dari API.
 * @param {string} baseCurrency Mata uang dasar untuk perbandingan (default: IDR).
 * @returns {Promise<object|null>} Objek berisi data kurs atau null jika terjadi error.
 */
async function getExchangeRates(baseCurrency = BASE_CURRENCY) {
  try {
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

/**
 * Fungsi untuk mengkonversi sejumlah uang dari Rupiah ke mata uang asing.
 * @param {number} amount Jumlah uang dalam Rupiah.
 * @param {string} targetCurrency Kode mata uang tujuan (contoh: 'USD', 'EUR', 'JPY').
 * @returns {Promise<number|null>} Hasil konversi atau null jika terjadi error.
 */
async function convertFromRupiah(amount, targetCurrency) {
  if (typeof amount !== 'number' || amount <= 0) {
    console.error('Jumlah harus berupa angka positif.');
    return null;
  }
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

/**
 * Fungsi untuk mengkonversi sejumlah uang dari mata uang asing ke Rupiah.
 * @param {number} amount Jumlah uang dalam mata uang asing.
 * @param {string} sourceCurrency Kode mata uang sumber (contoh: 'USD', 'EUR', 'JPY').
 * @returns {Promise<number|null>} Hasil konversi ke Rupiah atau null jika terjadi error.
 */
async function convertToRupiah(amount, sourceCurrency) {
    if (typeof amount !== 'number' || amount <= 0) {
        console.error('Jumlah harus berupa angka positif.');
        return null;
    }
    if (typeof sourceCurrency !== 'string' || sourceCurrency.length !== 3) {
        console.error('Kode mata uang sumber tidak valid.');
        return null;
    }

    // Fetch rate dengan basis mata uang sumber untuk mendapatkan rate ke IDR.
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


// Contoh penggunaan (bisa dihapus atau dikomentari jika ini hanya modul):
// async function main() {
//   console.log('Memulai tes konversi mata uang...');

//   // Tes 1: Konversi dari Rupiah ke USD
//   const amountIDRtoUSD = 150000;
//   const targetUSD = 'USD';
//   console.log(`\nMengkonversi ${amountIDRtoUSD} IDR ke ${targetUSD}...`);
//   let convertedToUSD = await convertFromRupiah(amountIDRtoUSD, targetUSD);
//   if (convertedToUSD !== null) {
//     console.log(`Hasil: ${amountIDRtoUSD} IDR = ${convertedToUSD.toFixed(2)} ${targetUSD}`);
//   } else {
//     console.log(`Gagal mengkonversi IDR ke ${targetUSD}.`);
//   }

//   // Tes 2: Konversi dari USD ke Rupiah
//   const amountUSDtoIDR = 10;
//   const sourceUSD = 'USD';
//   console.log(`\nMengkonversi ${amountUSDtoIDR} ${sourceUSD} ke IDR...`);
//   let convertedToIDR = await convertToRupiah(amountUSDtoIDR, sourceUSD);
//   if (convertedToIDR !== null) {
//     console.log(`Hasil: ${amountUSDtoIDR} ${sourceUSD} = ${convertedToIDR.toFixed(2)} IDR`);
//   } else {
//     console.log(`Gagal mengkonversi ${sourceUSD} ke IDR.`);
//   }

//   // Tes 3: Mata uang target tidak ada
//   const amountIDRtoXYZ = 100000;
//   const targetXYZ = 'XYZ'; // Mata uang fiktif
//   console.log(`\nMencoba konversi ${amountIDRtoXYZ} IDR ke ${targetXYZ}...`);
//   let convertedToXYZ = await convertFromRupiah(amountIDRtoXYZ, targetXYZ);
//    if (convertedToXYZ !== null) {
//     console.log(`Hasil: ${amountIDRtoXYZ} IDR = ${convertedToXYZ.toFixed(2)} ${targetXYZ}`);
//   } else {
//     console.log(`Gagal mengkonversi IDR ke ${targetXYZ} (seperti yang diharapkan).`);
//   }
// }

// Baris ini menjalankan main() HANYA jika script dijalankan langsung (node currencyConverter.js)
// Komentari atau hapus jika Anda hanya akan menggunakannya sebagai modul.
if (require.main === module) {
  // Pastikan API Key sudah diganti sebelum menjalankan tes ini.
  if (API_KEY === 'fe3773a76918c8757761f6cb') {
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.error("!!! HARAP GANTI 'GANTI_DENGAN_API_KEY_ANDA' DENGAN API KEY ASLI ANDA !!!");
    console.error("!!! di file currencyConverter.js sebelum menjalankan tes.     !!!");
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  } else {
    main();
  }
}

// Ekspor fungsi agar bisa digunakan di file lain (misalnya server.js)
module.exports = {
  getExchangeRates,
  convertFromRupiah,
  convertToRupiah
};