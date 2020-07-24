var btnGet = document.getElementById("btnGet");
var result = document.getElementById("result");
btnGet.addEventListener("click", getCurrencyValue);

function getCurrencyValue() {
  var cdate = document.getElementById("cdate").value.split("-").join("");
  var currency = document.getElementById("currency").value;
  var URI = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${currency}&date=${cdate}&json`;

  var XHR = new XMLHttpRequest();
  XHR.open("GET", URI);
  XHR.send();
  XHR.addEventListener("readystatechange", function () {
    if ((XHR.readyState === 4) && (XHR.status === 200)) {
      var data = JSON.parse(XHR.responseText);
      result.innerHTML = `<h1>${data[0].rate}</h1>`;
    }
  });

}