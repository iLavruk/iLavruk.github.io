var btnGet = document.getElementById("btnGet");
var result = document.getElementById("result");
let chartData = [], dates = [], currencies = [];
btnGet.addEventListener("click", getCurrencyValue);

function dateToStringNBU(dateObj) {
    function add0(value) {
        return (value.toString().length < 2) ? `0${value}` : value.toString();
    }
    if (dateObj instanceof Date) {
        return `${dateObj.getFullYear()}${add0(dateObj.getMonth() + 1)}${add0(dateObj.getDate())}`;
    }
    return false;
}

function getCurrencyValue() {
    const ONEDAY = 24 * 60 * 60 * 1000; // amount of miliseconds in one day
    var sDate = new Date(document.getElementById("sdate").value);
    var eDate = new Date(document.getElementById("edate").value);
    var currency = document.getElementById("currency").value;

    var diff = (eDate - sDate) / ONEDAY;
    var cDate;
    let i = 0;
    while (i <= diff) {
        cDate = new Date(sDate.valueOf() + (i * ONEDAY));
        i++;
        var URI = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${currency}&date=${dateToStringNBU(cDate)}&json`;
        fetch(URI)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                chartData.push({ exchangedate: new Date(data[0].exchangedate.split(".").reverse().join(".")), rate: data[0].rate });
            });
    }
    setTimeout(() => {
        chartData.sort((firstElement, secondElement) => {
            return firstElement.exchangedate - secondElement.exchangedate;
        });
        chartData.forEach((elementDate) => {
            dates.push(elementDate.exchangedate);
            currencies.push(elementDate.rate);
        })
        console.log(dates, currencies);

        Highcharts.chart('container', {
            title: {
                text: 'Sizing & Currency Chart'
            },

            chart: {
                type: 'line'
            },
            credits: {
                enabled: false
            },
            xAxis: {
                categories: dates
            },
            yAxis: {
                title: {
                    text: 'Value'

                }
            },

            series: [{
                name: 'Currency',
                data: currencies
            }]
        });
    }, 1000);
}
