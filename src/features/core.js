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
    let date = moment(input).format("DD/MM/YYYY");
    return date;
  },
  getToday: function () {
    let today = moment().format("DD/MM/YYYY");
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
