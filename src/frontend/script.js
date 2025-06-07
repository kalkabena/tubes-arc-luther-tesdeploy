// === FRONTEND ===
document.addEventListener("DOMContentLoaded", function () {
  // Grafik hover effect
  const grafik = document.querySelector(".grafik");
  const konversi = document.querySelector(".konversi");

  if (grafik && konversi) {
    grafik.addEventListener("mouseover", () => {
      konversi.style.color = "rgb(112, 112, 112)";
      konversi.style.fontWeight = "lighter";
    });

    grafik.addEventListener("mouseout", () => {
      konversi.style.color = "";
      konversi.style.fontWeight = "";
    });
  }

  // === .countrycontainer (untuk .activecountry di index2.html) ===
  // Variabel ini spesifik untuk logika dropdown di index2.html (atau bagian header yang serupa)
  const countryButtonPage2 = document.querySelector(".buttons .countryOp .countrybut"); 
  const countryContainerPage2 = document.querySelector(".buttons .countryOp .countrycontainer");
  const indicatorPage2 = document.querySelector(".buttons .countryOp .indicator"); // Variabel ini dideklarasikan tapi tidak digunakan di snippet Anda
  const activeCountryPage2 = document.querySelector(".buttons .countryOp .activecountry");


  if (countryButtonPage2 && countryContainerPage2 && activeCountryPage2) { // indicatorPage2 dihapus dari kondisi jika tidak digunakan
    countryContainerPage2.style.display = "none";

    // const selectedDisplay = document.createElement("div"); // Anda membuat selectedDisplay untuk '.indicator' di kode asli Anda, mungkin ini untuk UI index2.html
    // selectedDisplay.className = "selected-display";
    // if(indicatorPage2) indicatorPage2.appendChild(selectedDisplay); // Pastikan indicator yang tepat

    countryButtonPage2.addEventListener("click", function (e) {
      e.stopPropagation();
      countryContainerPage2.style.display =
        countryContainerPage2.style.display === "flex" ? "none" : "flex";
    });

    const activeTextPage2 = activeCountryPage2.querySelector("h5");
    const activeFlagPage2 = activeCountryPage2.querySelector("div[class$='flag']");
    
    const buttonsPage2 = countryContainerPage2.querySelectorAll("button");
    buttonsPage2.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.stopPropagation(); 
        const currency = button.querySelector("p").textContent;
        const flagClass = button.querySelector("div").className;

        if(activeTextPage2) activeTextPage2.textContent = currency;
        if(activeFlagPage2) activeFlagPage2.className = flagClass;
        countryContainerPage2.style.display = "none";
      });
    });

    document.addEventListener("click", function (e) {
      if (
        countryContainerPage2 && 
        !countryContainerPage2.contains(e.target) &&
        !countryButtonPage2.contains(e.target)
      ) {
        countryContainerPage2.style.display = "none";
      }
    });
  }
  
  // === Variabel untuk elemen konversi di index.html ===
  const amountInputElementIndexHTML = document.querySelector(".inputval");
  const sourceCurrencyH5IndexHTML = document.querySelector(".jumlah .changecountry h5");
  const sourceCurrencyFlagIndexHTML = document.querySelector(".jumlah .changecountry div[class$='flag']");
  const targetCurrencyH5IndexHTML = document.querySelector(".dikonversi .changecountry h5");
  const targetCurrencyFlagIndexHTML = document.querySelector(".dikonversi .changecountry div[class$='flag']");
  const outputValueElementIndexHTML = document.querySelector(".dikonversi .outputval");
  const swapButtonIndexHTML = document.querySelector(".arrow");
  const exchangeRateDisplayIndexHTML = document.querySelector(".exchange");


  // === Setup fungsi umum untuk .bar & .bar2 di index.html (pemilih mata uang) ===
  function setupIndexHTMLCountrySelectorLogic(barSelector, containerSelector, isSourceCurrencySelector) {
    const bar = document.querySelector(barSelector);
    const container = document.querySelector(containerSelector);

    if (!bar || !container) return;

    const button = bar.querySelector(".countrybut");
    const h5 = bar.querySelector("h5");
    const flag = bar.querySelector("div[class$='flag']");

    container.style.display = "none";

    button.addEventListener("click", function (e) {
      e.stopPropagation();
      const otherContainer = isSourceCurrencySelector ? document.querySelector(".countrycontainer3") : document.querySelector(".countrycontainer2");
      if (otherContainer && otherContainer !== container) {
        otherContainer.style.display = "none";
      }
      container.style.display =
        container.style.display === "flex" ? "none" : "flex";
    });

    const buttons = container.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation(); 
        const currency = btn.querySelector("p").textContent;
        const flagClass = btn.querySelector("div").className;

        h5.textContent = currency;
        flag.className = flagClass; 
        container.style.display = "none";
        processAndDisplayConversion(); 
      });
    });

    document.addEventListener("click", function (e) {
      if (!container.contains(e.target) && !bar.contains(e.target)) {
        container.style.display = "none";
      }
    });
  }

  // Hanya terapkan setup ini jika kita berada di halaman index.html
  if (document.querySelector(".jumlah .bar") && document.querySelector(".dikonversi .bar2")) {
    setupIndexHTMLCountrySelectorLogic(".jumlah .bar", ".countrycontainer2", true); 
    setupIndexHTMLCountrySelectorLogic(".dikonversi .bar2", ".countrycontainer3", false); 
  }

  // === Swap currencies between jumlah and dikonversi (di index.html) ===
  if (swapButtonIndexHTML && sourceCurrencyH5IndexHTML && targetCurrencyH5IndexHTML && sourceCurrencyFlagIndexHTML && targetCurrencyFlagIndexHTML) {
    swapButtonIndexHTML.addEventListener("click", () => {
      const leftH5 = sourceCurrencyH5IndexHTML;
      const rightH5 = targetCurrencyH5IndexHTML;
      const leftFlag = sourceCurrencyFlagIndexHTML;
      const rightFlag = targetCurrencyFlagIndexHTML;

      const tempText = leftH5.textContent;
      leftH5.textContent = rightH5.textContent;
      rightH5.textContent = tempText;

      const tempClass = leftFlag.className;
      leftFlag.className = rightFlag.className;
      rightFlag.className = tempClass;
      
      processAndDisplayConversion(); 
    });
  }

  // Event listener untuk input jumlah di index.html
  if (amountInputElementIndexHTML) {
    amountInputElementIndexHTML.addEventListener("input", processAndDisplayConversion);
  }

  // Inisialisasi halaman konversi (jika elemen index.html ada)
  // Pastikan initializeConverterPageIndexHTML didefinisikan (akan kita definisikan di bawah)
  if (amountInputElementIndexHTML && outputValueElementIndexHTML && exchangeRateDisplayIndexHTML) {
    initializeConverterPageIndexHTML(); // Nama fungsi sudah benar sekarang
  }
  // Hapus duplikasi event listener untuk .inputval
  // const amountInputEl = document.querySelector(".inputval"); // Ini sudah ditangani oleh amountInputElementIndexHTML
  // if (amountInputEl) {
  //   amountInputEl.addEventListener('input', async () => {
  //     await processAndDisplayConversionForIndexHTML(); // Menggunakan nama fungsi yang konsisten
  //   });
  // }

  // Ambil semua tombol rentang waktu dan elemen canvas chart
  const rangeButtons = document.querySelectorAll(".nav button");
  const canvas = document.getElementById("chart-canvas");
  let chart;

  // Mengambil mata uang yang sedang aktif dipilih oleh user
  function getSelectedCurrency() {
    return document.querySelector(".activecountry h5").textContent;
  }

  // Mengambil label rentang waktu yang sedang aktif
  function getActiveRange() {
    const activeBtn = document.querySelector(".nav .activeop");
    return activeBtn.textContent;
  }

  // Memetakan label rentang waktu ke format API (misalnya '30H' -> '1M')
  // Lalu fetch data historis dari server untuk ditampilkan di grafik
  function fetchChartData() {
    const fromCurr = getSelectedCurrency();
    const rangeText = getActiveRange();
    const rangeMap = { '30H': '1M', '90H': '3M', '1T': '1Y' };
    const range = rangeMap[rangeText] || '1M';

    fetch(`https://tubes-arc-luther-tesdeploy-production.up.railway.app/api/chart?fromCurr=${fromCurr}&toCurr=IDR&range=${range}`)
      .then(res => res.json())
      .then(data => {
        renderChart(data.labels, data.values, fromCurr);
      })
      .catch(err => console.error("Gagal memuat grafik:", err));
  }

  function renderChart(labels, values, fromCurr) {
  // Validasi: pastikan canvas ada dan context 2D bisa diambil
  const canvas = document.getElementById("chart-canvas");
  if (!canvas) {
    console.warn("Canvas #chart-canvas tidak ditemukan di DOM.");
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.warn("Tidak bisa mendapatkan konteks 2D dari canvas.");
    return;
  }

  // Update chart yang sudah ada dengan data baru
  if (chart) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = values;
    chart.data.datasets[0].label = `${fromCurr} ke IDR`;
    chart.update();
  } else {
    // Buat chart baru jika belum pernah dibuat sebelumnya
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: `${fromCurr} ke IDR`,
          data: values,
          borderColor: "#00a6ff",
          backgroundColor: "rgba(0,166,255,0.2)",
          borderWidth: 2,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          tooltip: {
            // Konfigurasi tampilan tooltip saat hove
            mode: 'index',
            intersect: false,
            backgroundColor: 'white',
            borderColor: '#ccc',
            borderWidth: 1,
            titleColor: '#000',
            bodyColor: '#000',
            titleFont: { weight: 'bold' },
            padding: 10,
            displayColors: false,
            callbacks: {
            // Tampilkan kurs sebagai judul tooltip
            title: function(context) {
              return context[0].formattedValue;
            },
            // Tampilkan tanggal di bawahnya
            label: function(context) {
              return context.label;
            }
          },
          titleFont: { weight: 'bold', size: 14 }, // bold untuk kurs
          bodyFont: { weight: 'normal', size: 12 }, // biasa untuk tanggal
          },
          legend: { display: false }
        }
      }
    });
  }
}

    rangeButtons.forEach(btn => {
      btn.addEventListener("click", function () {
        document.querySelector(".nav .activeop").classList.remove("activeop");
        btn.classList.add("activeop");
        fetchChartData();
      });
    });

    const currencyButtons = document.querySelectorAll(".countrycontainer button");
    currencyButtons.forEach(button => {
      button.addEventListener("click", function () {
        fetchChartData();
      });
    });

    fetchChartData();
}); // Akhir dari DOMContentLoaded


// --- FUNGSI INTI UNTUK KONVERSI DI INDEX.HTML ---
async function processAndDisplayConversion() { // Nama fungsi diseragamkan
  const amountInput = document.querySelector(".inputval");
  const sourceCurrencyH5 = document.querySelector(".jumlah .changecountry h5");
  const targetCurrencyH5 = document.querySelector(".dikonversi .changecountry h5");
  const outputDiv = document.querySelector(".dikonversi .outputval");
  const exchangeDiv = document.querySelector(".exchange");

  if (!amountInput || !sourceCurrencyH5 || !targetCurrencyH5 || !outputDiv) {
      console.error("processAndDisplayConversion: Elemen HTML inti tidak ditemukan.");
      return;
  }

  const amountStr = amountInput.value;
  const fromCurrencyStr = sourceCurrencyH5.textContent.trim().toUpperCase();
  const toCurrencyStr = targetCurrencyH5.textContent.trim().toUpperCase();

  const amount = parseFloat(amountStr); // amount dideklarasikan di sini
  const fromCurrency = fromCurrencyStr; // fromCurrency dideklarasikan di sini
  const toCurrency = toCurrencyStr;     // toCurrency dideklarasikan di sini
  
  outputDiv.innerText = "Menghitung...";

  // Blok kondisi if (fromCurrency === toCurrency) dipindahkan ke setelah deklarasi variabel
  if (fromCurrency === toCurrency) {
    // Periksa apakah amount adalah angka yang valid sebelum .toFixed
    if (!isNaN(amount)) {
        outputDiv.innerText = amount.toFixed(2);
    } else {
        outputDiv.innerText = "0.00"; // Atau pesan error jika input tidak valid
    }
    if (exchangeDiv) exchangeDiv.innerText = `1 ${fromCurrency} = 1.0000 ${toCurrency}`;
    return;
  }


  if (isNaN(amount) || amount < 0) {
    if (amountInput.value.trim() !== "" && amount < 0) { 
        outputDiv.innerText = "Jumlah tidak boleh negatif";
    } else if (amountInput.value.trim() !== "" && isNaN(amount)) {
        outputDiv.innerText = "Jumlah tidak valid";
    } else {
        outputDiv.innerText = "0.00";
    }
    if (exchangeDiv) exchangeDiv.innerText = `Rate ${fromCurrency}/${toCurrency} tidak tersedia`; // Gunakan fromCurrency dan toCurrency yang sudah dideklarasikan
    if (amount < 0 || isNaN(amount)) return; 
  }
  
  if (!fromCurrency || !toCurrency ) {
    outputDiv.innerText = "Pilih mata uang";
    if (exchangeDiv) exchangeDiv.innerText = `Rate tidak tersedia`;
    return;
  }
  
  const apiUrl = `https://tubes-arc-luther-tesdeploy-production.up.railway.app`; 
  const queryParams = `?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`;

  try {
    const response = await fetch(apiUrl + queryParams);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `Server Error! Status: ${response.status}` }));
      throw new Error(errorData.error || `Gagal mengambil data.`);
    }

    const data = await response.json();
    outputDiv.innerText = data.convertedAmount;

    if (exchangeDiv && data.fromCurrency && data.toCurrency && data.originalAmount !== undefined && data.convertedAmount !== undefined) {
      if (parseFloat(data.originalAmount) === 0 && amount === 0) {
           const rateResponse = await fetch(`https://tubes-arc-luther-tesdeploy-production.up.railway.app/api/convert?amount=1&from=${data.fromCurrency}&to=${data.toCurrency}`);
           if (rateResponse.ok) {
               const rateData = await rateResponse.json();
               exchangeDiv.innerText = `1 ${data.fromCurrency} = ${parseFloat(rateData.convertedAmount).toFixed(4)} ${data.toCurrency}`;
           } else {
               exchangeDiv.innerText = `Rate ${data.fromCurrency}/${data.toCurrency} tidak tersedia`;
           }
      } else if (parseFloat(data.originalAmount) !== 0) {
        const rate = parseFloat(data.convertedAmount) / parseFloat(data.originalAmount);
        if (!isNaN(rate)) {
            exchangeDiv.innerText = `1 ${data.fromCurrency} = ${rate.toFixed(4)} ${data.toCurrency}`;
        } else {
            exchangeDiv.innerText = `Rate ${data.fromCurrency}/${data.toCurrency} tidak valid`;
        }
      } else {
         exchangeDiv.innerText = `Rate ${data.fromCurrency}/${data.toCurrency} tidak dapat dihitung`;
      }
    }
  } catch (error) {
    console.error('Error saat konversi:', error);
    outputDiv.innerText = `Error!`;
    if (exchangeDiv) exchangeDiv.innerText = `Rate ${fromCurrency}/${toCurrency} tidak tersedia`; // Gunakan fromCurrency dan toCurrency yang sudah dideklarasikan
  }
}

// --- MEMPERTAHANKAN NAMA FUNGSI LAMA ANDA ---
// Komentar asli Anda dipertahankan, tetapi logikanya diubah untuk memanggil fungsi inti.
async function handleRupiahConversion() {
  // Pastikan elemen dengan ID ini ada di HTML Anda (index.html atau index2.html) // Komentar Asli Anda
  console.log("handleRupiahConversion dipanggil");
  if (document.querySelector(".inputval")) { 
    await processAndDisplayConversion(); // Panggil nama fungsi yang konsisten
  } else {
    console.warn("Konteks bukan index.html atau .inputval tidak ditemukan, logika ID lama mungkin relevan di sini.");
    // Logika lama Anda dengan getElementById bisa ditaruh di sini sebagai fallback
    // jika Anda punya halaman lain yang MENGGUNAKAN ID tersebut.
    // Contoh:
    // const amountInput = document.getElementById('inputAmountIDR');
    // const currencySelect = document.getElementById('selectTargetCurrency');
    // const resultDisplay = document.getElementById('conversionResult');
    // if (!amountInput || !currencySelect || !resultDisplay) { /* ... pesan error ... */ return; }
    // const amountToConvert = amountInput.value; /* ... sisa logika lama ... */
  }
}

async function handleConvertToRupiah() {
  // Pastikan elemen dengan ID ini ada di HTML Anda // Komentar Asli Anda
  console.log("handleConvertToRupiah dipanggil");
  if (document.querySelector(".inputval")) {
    await processAndDisplayConversion(); // Panggil nama fungsi yang konsisten
  } else {
    console.warn("Konteks bukan index.html atau .inputval tidak ditemukan, logika ID lama mungkin relevan di sini.");
    // const amountInput = document.getElementById('inputAmountForeign');
    // if (amountInput) { /* ... logika lama berbasis ID 'inputAmountForeign' ... */ }
  }
}

// --- FUNGSI INISIALISASI HALAMAN KONVERSI (index.html) ---
// (Definisi fungsi yang sebelumnya menyebabkan error ReferenceError)
async function initializeConverterPageIndexHTML() { 
  const amountInput = document.querySelector(".inputval");
  const outputDiv = document.querySelector(".dikonversi .outputval");
  const exchangeDiv = document.querySelector(".exchange");
  const sourceCurrencyH5 = document.querySelector(".jumlah .changecountry h5");
  const targetCurrencyH5 = document.querySelector(".dikonversi .changecountry h5");

  if (outputDiv) outputDiv.innerText = "0.00";

  const fromCurrencyInitial = sourceCurrencyH5?.textContent.trim().toUpperCase() || "USD";
  const toCurrencyInitial = targetCurrencyH5?.textContent.trim().toUpperCase() || "IDR";

  if (exchangeDiv && fromCurrencyInitial && toCurrencyInitial) {
      if (fromCurrencyInitial && toCurrencyInitial) {
          try {
              const response = await fetch(`https://tubes-arc-luther-tesdeploy-production.up.railway.app/api/convert?amount=1&from=${fromCurrencyInitial}&to=${toCurrencyInitial}`);
              if (response.ok) {
                  const data = await response.json();
                  exchangeDiv.innerText = `1 ${data.fromCurrency} = ${parseFloat(data.convertedAmount).toFixed(2)} ${data.toCurrency}`;
              } else {
                  const errorData = await response.json().catch(() => null);
                  exchangeDiv.innerText = `Rate ${fromCurrencyInitial}/${toCurrencyInitial} tdk tersedia.`;
                  console.error("Gagal memuat rate awal:", errorData?.error || response.status);
              }
          } catch (e) {
              exchangeDiv.innerText = "Error rate awal.";
              console.error("Gagal memuat rate awal:", e);
          }
      } else {
        exchangeDiv.innerText = "Pilih mata uang untuk rate awal.";
      }
  }
  
  if (amountInput && amountInput.value.trim() !== "") {
    processAndDisplayConversion();
  }
}