//#region  T2DS Function
const oT2DSCoreFunc = {
  initCore: function () {
    console.log("T2DS Init Core Function");
    this.onRouteMatch();
    this.initCityData();
  },
  onRouteMatch: function () {
    let currUrlString = window.location.href;
    let url = new URL(currUrlString);
    let location = url.searchParams.get("location");
    if (location) {
      this.getLatestDataAndBuildChart(location);
      return;
    }
    this.getLatestDataAndBuildChart();
  },
  updateMetadata: function (latestUpdate) {
    let msgTitle =
      "Thống kê tình hình COVID-19 tại Việt Nam, cập nhật ngày: " +
      latestUpdate;
    document.title = msgTitle;
    $("#head-title")[0].text = msgTitle;
    $("#head-title").attr("href", appUrl);
  },
  getLatestDataAndBuildChart: function (city) {
    const that = this;
    if (apiConfig.dataEndpoint) {
      $.getJSON(apiConfig.dataEndpoint)
        .done(function (json) {
          let source = json;
          if (city) {
            let aCities = that.getExistItemsInArray(
              json.detail,
              "hc-key",
              city
            );
            if (aCities && aCities.length > 0) {
              let latest = aCities[0];
              source = {
                infected: latest.value,
                treated: latest.socadangdieutri,
                recovered: latest.socakhoi,
                deceased: latest.socatuvong,
                lastUpdatedAtSource: json.lastUpdatedAtSource,
              };
            } else {
              //for empty
              source = {
                infected: 0,
                treated: 0,
                recovered: 0,
                deceased: 0,
                lastUpdatedAtSource: json.lastUpdatedAtSource,
              };
            }
          }
          that.buildSummaryChart(source);
          that.buildMapData(json.detail);
        })
        .fail(function (jqxhr, textStatus, error) {
          var err = textStatus + ", " + error;
          console.log("Request Failed: " + err);
        });
    }
  },
  initCityData: function () {
    if (apiConfig.cityEndpoint) {
      const that = this;
      $.getJSON(apiConfig.cityEndpoint)
        .done(function (json) {
          that.buildCityLst(json.key);
        })
        .fail(function (jqxhr, textStatus, error) {
          var err = textStatus + ", " + error;
          console.log("Request Failed: " + err);
        });
    }
  },
  buildCityLst: function (aCities) {
    let cityListElm = $("#cityLst");
    if (cityListElm[0]) {
      if (aCities) {
        aCities.forEach((city) => {
          let cityName = this.getCityFamilyName(city.name, "name");
          let cityId = "'" + city["hec-key"] + "'";
          let cityElm = $(
            '<li><a onClick="onCitySelected(' +
              cityId +
              ')">' +
              cityName +
              "</li>"
          );
          cityListElm.append(cityElm);
        });
      }
    }
  },
  getCityFamilyName: function (crawlName, key) {
    let cityName = crawlName;
    if (!aCityMaps) {
      return cityName;
    }
    let aCities = this.getExistItemsInArray(aCityMaps, key, crawlName);
    if (!aCities) {
      return cityName;
    }
    cityName = aCities[0].familyName;
    return cityName;
  },
  buildSummaryChart: function (source) {
    let latestUpdate = this._formatDate(source.lastUpdatedAtSource);
    this.updateMetadata(latestUpdate);
    const { infected, treated, recovered, deceased } = source;
    this.updateNumber(infected, treated, recovered, deceased);
    var oSumData = {
      labels: [
        "Số ca lây nhiễm",
        "Đang điều trị",
        "Đã hồi phục",
        "Số ca tử vong",
      ],
      datasets: [
        {
          label: "Số người",
          data: [infected, treated, recovered, deceased],
          backgroundColor: ["#ffc107", "#17a2b8", "#28a745", "#dc3545"],
        },
      ],
    };
    const sumCanvas = document.getElementById("summary");
    if (sumCanvas) {
      if (this.sumChart) {
        this.sumChart.destroy();
      }
      this.sumChart = new Chart(sumCanvas, {
        type: "bar",
        data: oSumData,
        responsive: true,
      });
    }
  },
  buildMapData: function (data) {
    // var data = [
    //   {
    //     socakhoi: 3069,
    //     socadangdieutri: 2689,
    //     socatuvong: 7,
    //     "hc-key": "24",
    //     value: 5765,
    //   },
    //   {
    //     socakhoi: 522,
    //     socadangdieutri: 4733,
    //     socatuvong: 13,
    //     "hc-key": "79",
    //     value: 5268,
    //   },
    //   {
    //     socakhoi: 962,
    //     socadangdieutri: 660,
    //     socatuvong: 9,
    //     "hc-key": "27",
    //     value: 1631,
    //   },
    //   {
    //     socakhoi: 801,
    //     socadangdieutri: 12,
    //     socatuvong: 0,
    //     "hc-key": "30",
    //     value: 813,
    //   },
    //   {
    //     socakhoi: 614,
    //     socadangdieutri: 99,
    //     socatuvong: 32,
    //     "hc-key": "48",
    //     value: 748,
    //   },
    //   {
    //     socakhoi: 512,
    //     socadangdieutri: 213,
    //     socatuvong: 18,
    //     "hc-key": "01",
    //     value: 744,
    //   },
    //   {
    //     socakhoi: 45,
    //     socadangdieutri: 511,
    //     socatuvong: 0,
    //     "hc-key": "74",
    //     value: 556,
    //   },
    //   {
    //     socakhoi: 28,
    //     socadangdieutri: 164,
    //     socatuvong: 0,
    //     "hc-key": "54",
    //     value: 192,
    //   },
    //   {
    //     socakhoi: 128,
    //     socadangdieutri: 40,
    //     socatuvong: 0,
    //     "hc-key": "56",
    //     value: 168,
    //   },
    //   {
    //     socakhoi: 67,
    //     socadangdieutri: 99,
    //     socatuvong: 0,
    //     "hc-key": "33",
    //     value: 166,
    //   },
    //   {
    //     socakhoi: 42,
    //     socadangdieutri: 102,
    //     socatuvong: 1,
    //     "hc-key": "72",
    //     value: 145,
    //   },
    //   {
    //     socakhoi: 123,
    //     socadangdieutri: 22,
    //     socatuvong: 0,
    //     "hc-key": "77",
    //     value: 145,
    //   },
    //   {
    //     socakhoi: 122,
    //     socadangdieutri: 11,
    //     socatuvong: 3,
    //     "hc-key": "49",
    //     value: 136,
    //   },
    //   {
    //     socakhoi: 5,
    //     socadangdieutri: 129,
    //     socatuvong: 1,
    //     "hc-key": "82",
    //     value: 135,
    //   },
    //   {
    //     socakhoi: 11,
    //     socadangdieutri: 121,
    //     socatuvong: 0,
    //     "hc-key": "80",
    //     value: 132,
    //   },
    //   {
    //     socakhoi: 8,
    //     socadangdieutri: 119,
    //     socatuvong: 0,
    //     "hc-key": "42",
    //     value: 127,
    //   },
    //   {
    //     socakhoi: 50,
    //     socadangdieutri: 63,
    //     socatuvong: 0,
    //     "hc-key": "26",
    //     value: 113,
    //   },
    //   {
    //     socakhoi: 4,
    //     socadangdieutri: 107,
    //     socatuvong: 0,
    //     "hc-key": "40",
    //     value: 111,
    //   },
    //   {
    //     socakhoi: 18,
    //     socadangdieutri: 91,
    //     socatuvong: 1,
    //     "hc-key": "20",
    //     value: 110,
    //   },
    //   {
    //     socakhoi: 7,
    //     socadangdieutri: 93,
    //     socatuvong: 0,
    //     "hc-key": "51",
    //     value: 100,
    //   },
    //   {
    //     socakhoi: 87,
    //     socadangdieutri: 12,
    //     socatuvong: 0,
    //     "hc-key": "22",
    //     value: 99,
    //   },
    //   {
    //     socakhoi: 24,
    //     socadangdieutri: 65,
    //     socatuvong: 0,
    //     "hc-key": "91",
    //     value: 89,
    //   },
    //   {
    //     socakhoi: 27,
    //     socadangdieutri: 47,
    //     socatuvong: 0,
    //     "hc-key": "87",
    //     value: 74,
    //   },
    //   {
    //     socakhoi: 55,
    //     socadangdieutri: 17,
    //     socatuvong: 0,
    //     "hc-key": "34",
    //     value: 72,
    //   },
    //   {
    //     socakhoi: 31,
    //     socadangdieutri: 33,
    //     socatuvong: 0,
    //     "hc-key": "75",
    //     value: 64,
    //   },
    //   {
    //     socakhoi: 44,
    //     socadangdieutri: 15,
    //     socatuvong: 0,
    //     "hc-key": "11",
    //     value: 59,
    //   },
    //   {
    //     socakhoi: 44,
    //     socadangdieutri: 12,
    //     socatuvong: 0,
    //     "hc-key": "35",
    //     value: 56,
    //   },
    //   {
    //     socakhoi: 53,
    //     socadangdieutri: 2,
    //     socatuvong: 0,
    //     "hc-key": "95",
    //     value: 55,
    //   },
    //   {
    //     socakhoi: 37,
    //     socadangdieutri: 14,
    //     socatuvong: 0,
    //     "hc-key": "37",
    //     value: 51,
    //   },
    //   {
    //     socakhoi: 9,
    //     socadangdieutri: 38,
    //     socatuvong: 0,
    //     "hc-key": "89",
    //     value: 47,
    //   },
    //   {
    //     socakhoi: 33,
    //     socadangdieutri: 6,
    //     socatuvong: 0,
    //     "hc-key": "17",
    //     value: 39,
    //   },
    //   {
    //     socakhoi: 34,
    //     socadangdieutri: 1,
    //     socatuvong: 0,
    //     "hc-key": "92",
    //     value: 35,
    //   },
    //   {
    //     socakhoi: 27,
    //     socadangdieutri: 4,
    //     socatuvong: 0,
    //     "hc-key": "64",
    //     value: 31,
    //   },
    //   {
    //     socakhoi: 26,
    //     socadangdieutri: 5,
    //     socatuvong: 0,
    //     "hc-key": "38",
    //     value: 31,
    //   },
    //   {
    //     socakhoi: 18,
    //     socadangdieutri: 8,
    //     socatuvong: 0,
    //     "hc-key": "36",
    //     value: 26,
    //   },
    //   {
    //     socakhoi: 11,
    //     socadangdieutri: 14,
    //     socatuvong: 0,
    //     "hc-key": "60",
    //     value: 25,
    //   },
    //   {
    //     socakhoi: 13,
    //     socadangdieutri: 11,
    //     socatuvong: 0,
    //     "hc-key": "86",
    //     value: 24,
    //   },
    //   {
    //     socakhoi: 12,
    //     socadangdieutri: 10,
    //     socatuvong: 0,
    //     "hc-key": "31",
    //     value: 22,
    //   },
    //   {
    //     socakhoi: 18,
    //     socadangdieutri: 2,
    //     socatuvong: 0,
    //     "hc-key": "83",
    //     value: 20,
    //   },
    //   {
    //     socakhoi: 0,
    //     socadangdieutri: 19,
    //     socatuvong: 0,
    //     "hc-key": "94",
    //     value: 19,
    //   },
    //   {
    //     socakhoi: 8,
    //     socadangdieutri: 10,
    //     socatuvong: 0,
    //     "hc-key": "84",
    //     value: 18,
    //   },
    //   {
    //     socakhoi: 12,
    //     socadangdieutri: 1,
    //     socatuvong: 1,
    //     "hc-key": "45",
    //     value: 14,
    //   },
    //   {
    //     socakhoi: 12,
    //     socadangdieutri: 0,
    //     socatuvong: 0,
    //     "hc-key": "58",
    //     value: 12,
    //   },
    //   {
    //     socakhoi: 8,
    //     socadangdieutri: 1,
    //     socatuvong: 0,
    //     "hc-key": "96",
    //     value: 9,
    //   },
    //   {
    //     socakhoi: 8,
    //     socadangdieutri: 1,
    //     socatuvong: 0,
    //     "hc-key": "19",
    //     value: 9,
    //   },
    //   {
    //     socakhoi: 5,
    //     socadangdieutri: 3,
    //     socatuvong: 0,
    //     "hc-key": "25",
    //     value: 8,
    //   },
    //   {
    //     socakhoi: 4,
    //     socadangdieutri: 4,
    //     socatuvong: 0,
    //     "hc-key": "66",
    //     value: 8,
    //   },
    //   {
    //     socakhoi: 2,
    //     socadangdieutri: 4,
    //     socatuvong: 0,
    //     "hc-key": "10",
    //     value: 6,
    //   },
    //   {
    //     socakhoi: 6,
    //     socadangdieutri: 0,
    //     socatuvong: 0,
    //     "hc-key": "46",
    //     value: 6,
    //   },
    //   {
    //     socakhoi: 0,
    //     socadangdieutri: 5,
    //     socatuvong: 0,
    //     "hc-key": "06",
    //     value: 5,
    //   },
    //   {
    //     socakhoi: 5,
    //     socadangdieutri: 0,
    //     socatuvong: 0,
    //     "hc-key": "15",
    //     value: 5,
    //   },
    //   {
    //     socakhoi: 1,
    //     socadangdieutri: 4,
    //     socatuvong: 0,
    //     "hc-key": "52",
    //     value: 5,
    //   },
    //   {
    //     socakhoi: 3,
    //     socadangdieutri: 1,
    //     socatuvong: 0,
    //     "hc-key": "02",
    //     value: 4,
    //   },
    //   {
    //     socakhoi: 0,
    //     socadangdieutri: 2,
    //     socatuvong: 0,
    //     "hc-key": "70",
    //     value: 2,
    //   },
    //   {
    //     socakhoi: 0,
    //     socadangdieutri: 1,
    //     socatuvong: 0,
    //     "hc-key": "68",
    //     value: 1,
    //   },
    //   {
    //     socakhoi: 1,
    //     socadangdieutri: 0,
    //     socatuvong: 0,
    //     "hc-key": "12",
    //     value: 1,
    //   },
    //   {
    //     socakhoi: 0,
    //     socadangdieutri: 1,
    //     socatuvong: 0,
    //     "hc-key": "14",
    //     value: 1,
    //   },
    //   {
    //     socakhoi: 1,
    //     socadangdieutri: 0,
    //     socatuvong: 0,
    //     "hc-key": "08",
    //     value: 1,
    //   },
    // ];
    // Create the chart
    Highcharts.mapChart("map-vn", {
      chart: {
        map: "countries/vn/vn-all",
      },
      exporting: {
        enabled: false,
      },

      title: {
        text: "",
      },
      credits: {
        enabled: false,
      },
      subtitle: {
        text: "",
      },

      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: "bottom",
        },
      },

      legend: {
        title: {
          text: "",
        },
        align: "center",
        verticalAlign: "bottom",
        floating: false,
        layout: "horizontal",
        valueDecimals: 0,
        backgroundColor: "rgba(255,255,255,0.9)",
        symbolRadius: 0,
        symbolHeight: 14,
      },
      colors: [
        "#f8f9fa",
        "#c5c573",
        "#ff9c07",
        "#ff7907",
        "#e01c1c",
        "#f70202",
      ],
      colorAxis: {
        dataClassColor: "category",
        dataClasses: [
          {
            name: "0",
          },
          {
            from: 1,
            to: 5,
          },
          {
            from: 6,
            to: 10,
          },
          {
            from: 11,
            to: 20,
          },
          {
            from: 21,
            to: 50,
          },
          {
            from: 50,
          },
        ],
      },

      tooltip: {
        useHTML: true,
        backgroundColor: "#9c9c9c",
        borderColor: "#aaa",
        headerFormat: "",
        pointFormat:
          '<div style="text-align: center;text-transform: uppercase;color:white">' +
          '<span style="text-align: center;"><b>{point.name}</b></span></div>' +
          ' <div style="color:white"> <b>Nhiễm bệnh: <span class="badge badge-pill badge-danger">{point.value}</span></b> <br/>' +
          '  <b>Phục hồi: <span class="badge badge-pill badge-info">{point.socakhoi}</span> </b><br/> ' +
          '<b>Tử vong: <span class="badge badge-pill badge-dark">{point.socatuvong}</span></b>	</div>',
      },

      series: [
        {
          data: data,
          name: "Random data",

          states: {
            hover: {
              color: "#2A3477",
            },
          },
          dataLabels: {
            enabled: false,
            format: "",
          },
        },
      ],
    });
  },
  showBusy: function () {
    $("#overlay").show();
  },
  hideBusy: function () {
    $("#overlay").hide();
  },
  updateNumber: function (infected, treated, recovered, deceased) {
    infected = this.numberWithCommas(infected);
    treated = this.numberWithCommas(treated);
    recovered = this.numberWithCommas(recovered);
    deceased = this.numberWithCommas(deceased);
    $("#num-infected").text(infected);
    $("#num-treated").text(treated);
    $("#num-recovered").text(recovered);
    $("#num-deceased").text(deceased);
    if (Chart.defaults) {
      Chart.defaults.font.size = 18;
    }
    oT2DSCoreFunc.hideBusy();
  },
  _formatDate: function (input) {
    let date = new Date(input);
    let dformat =
      ("00" + date.getDate()).slice(-2) +
      "/" +
      ("00" + (date.getMonth() + 1)).slice(-2) +
      "/" +
      date.getFullYear() +
      " lúc " +
      ("00" + date.getHours()).slice(-2) +
      ":" +
      ("00" + date.getMinutes()).slice(-2) +
      ":" +
      ("00" + date.getSeconds()).slice(-2);

    return dformat;
  },
  getToday: function () {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;
    return today;
  },
  numberWithCommas: function (value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  getExistItemsInArray: function (aSArray, sColumn, sKeyVal) {
    let aItems = aSArray.filter(function (obj) {
      return obj[sColumn] === sKeyVal;
    });
    return aItems;
  }, //end
};
//#endregion
$(document).ready(function () {
  oT2DSCoreFunc.showBusy();
  oT2DSCoreFunc.initCore();
});
function filterCity() {
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("ctyInput");
  filter = input.value.toUpperCase();
  ul = document.getElementById("cityLst");
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
function onCitySelected(inputCity) {
  oT2DSCoreFunc.showBusy();
  oT2DSCoreFunc.getLatestDataAndBuildChart(inputCity.toString());
  let currentCity = "Toàn quốc";
  if (inputCity !== "") {
    currentCity = oT2DSCoreFunc.getCityFamilyName(
      inputCity.toString(),
      "cityId"
    );
  }

  $("#head-sum").text("Thống kê COVID-19: " + currentCity);
}
