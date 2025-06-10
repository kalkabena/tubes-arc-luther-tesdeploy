document.addEventListener("DOMContentLoaded", () =>{

async function loadUpDownRatio(){
    const baseCurrencies = ['USD', 'EUR', 'CNY', 'JPY', 'SGD', 'MYR'];
    const persenUbah = document.querySelectorAll('.tingkat h5');
    const perubahanIcons = document.querySelectorAll('.perubahan i');
    var activeElem = document.getElementsByClassName("activeop")[0];
    var period = 0;

    if (activeElem) {
        var text = activeElem.innerText || activeElem.textContent;
    
        if (text === "30H") {
        period = 30;
        } else if (text === "90H") {
        period = 90;
        } else if (text === "1T") {
        period = 365;
        } else if (text === "1M") {
        period = 7;
        }
    }

    for (let i = 0; i < baseCurrencies.length; i++) {
        const base = baseCurrencies[i];

        try {
        const res = await fetch(`https://tubes-arc-luther-tesdeploy-production.up.railway.app/api/updownratio_period?targetCurrency=${base}&period=${period}`);
        console.log(`Currency = ${base}`);
        const data = await res.json();

        if (data && typeof data.percentChange === 'number') {
            const change = data.percentChange.toFixed(4);

            // Update percentage text
            persenUbah[i].innerHTML = `${change}%`;

            if (data.percentChange > 0) {
            persenUbah[i].style.color = 'green';
            perubahanIcons[i].classList.add('fa-caret-up');
            perubahanIcons[i].style.color = 'green';
            } else if (data.percentChange < 0) {
            persenUbah[i].style.color = 'red';
            perubahanIcons[i].classList.add('fa-caret-down');
            perubahanIcons[i].style.color = 'red';
            } else {
            persenUbah[i].style.color = 'gray';
            perubahanIcons[i].classList.add('fa-minus');
            perubahanIcons[i].style.color = 'gray';
            }

        } else {
            persenUbah[i].textContent = 'N/A';
            persenUbah[i].style.color = 'gray';
            perubahanIcons[i].classList.add('fa-question');
            perubahanIcons[i].style.color = 'gray';
        }
        } catch (err) {
        console.error(`Error for ${base}:`, err);
        persenUbah[i].textContent = 'Error';
        persenUbah[i].style.color = 'orange';
        perubahanIcons[i].classList.add('fa-exclamation-triangle');
        perubahanIcons[i].style.color = 'orange';
        }
      }
    }
    loadUpDownRatio();
    document.querySelectorAll('.buttons nav button').forEach((el) => {
        el.addEventListener('click', () => {
            document.querySelectorAll('.activeop').forEach(elem => elem.classList.remove('activeop'));
            el.classList.add('activeop');
            loadUpDownRatio();
        });
    });
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
})
