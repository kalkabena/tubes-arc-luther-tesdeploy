document.addEventListener("DOMContentLoaded", async () => {
  const baseCurrencies = ['USD', 'EUR', 'CNY', 'JPY', 'SGD', 'MYR'];
  const persenUbah = document.querySelectorAll('.tingkat h5');
  const perubahanIcons = document.querySelectorAll('.perubahan i');

  for (let i = 0; i < baseCurrencies.length; i++) {
    const base = baseCurrencies[i];
    console.log(`Currency = ${base}`);

    try {
      const res = await fetch(`/api/updownratio_period?targetCurrency=${base}&period=7`);
      const data = await res.json();

      if (data && typeof data.percentChange === 'number') {
        const change = data.percentChange.toFixed(2);

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
});
