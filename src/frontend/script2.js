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
        const res = await fetch(`/api/updownratio_period?targetCurrency=${base}&period=${period}`);
        console.log(`Currency = ${base}`);
        const data = await res.json();

        if (data && typeof data.percentChange === 'number') {
            const change = data.percentChange.toFixed(2);

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
})
