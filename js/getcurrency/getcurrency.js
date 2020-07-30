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
        // console.log(URI);
        fetch(URI)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                //   console.log(data);
                chartData.push({ exchangedate: new Date(data[0].exchangedate.split(".").reverse().join(".")), rate: data[0].rate });
            });
    }
    //console.log(chartData);
    setTimeout(() => {
        chartData.sort((firstElement, secondElement) => {
            return firstElement.exchangedate - secondElement.exchangedate;
        });
        //  console.log(chartData);
        chartData.forEach((elementDate) => {
            dates.push(elementDate.exchangedate);
            currencies.push(elementDate.rate);
        })
        console.log(dates, currencies);
    }, 2000);
}

// highcharts
Highcharts.chart('container', {

    chart: {
        scrollablePlotArea: {
            minWidth: 700
        }
    },

    data: {
        csvURL: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/analytics.csv',
        beforeParse: function (csv) {
            return csv.replace(/\n\n/g, '\n');
        }
    },

    // title: {
    //     text: 'Daily sessions at www.highcharts.com'
    // },

    // subtitle: {
    //     text: 'Source: Google Analytics'
    // },

    xAxis: {
        tickInterval: 48 * 60 * 60 * 1000, // two days
        tickWidth: 0,
        gridLineWidth: 1,
        labels: {
            align: 'left',
            x: 3,
            y: -3
        }
    },

    yAxis: [{ // left y axis
        title: {
            text: null
        },
        labels: {
            align: 'left',
            x: 3,
            y: 16,
            format: '{value:.,0f}'
        },
        showFirstLabel: false
    }, { // right y axis
        linkedTo: 0,
        gridLineWidth: 0,
        opposite: true,
        title: {
            text: null
        },
        labels: {
            align: 'right',
            x: -3,
            y: 16,
            format: '{value:.,0f}'
        },
        showFirstLabel: false
    }],

    legend: {
        align: 'left',
        verticalAlign: 'top',
        borderWidth: 0
    },

    tooltip: {
        shared: true,
        crosshairs: true
    },

    plotOptions: {
        series: {
            cursor: 'pointer',
            point: {
                events: {
                    click: function (e) {
                        hs.htmlExpand(null, {
                            pageOrigin: {
                                x: e.pageX || e.clientX,
                                y: e.pageY || e.clientY
                            },
                            headingText: this.series.name,
                            maincontentText: Highcharts.dateFormat('%A, %b %e, %Y', this.x) + ':<br/> ' +
                                this.y + ' sessions',
                            width: 200
                        });
                    }
                }
            },
            marker: {
                lineWidth: 1
            }
        }
    },

    series: [{
        name: 'Installation',
        date:currencies
    }]
});
