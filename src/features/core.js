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
    if(location){
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
    $("#head-title").attr("href",appUrl);
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
            }else{
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
    this.updateNumber(
      source.infected,
      source.treated,
      source.recovered,
      source.deceased
    );
    var oSumData = {
      labels: ["Số ca lây nhiễm", "Đang điều trị", "Đã hồi phục", "Số ca tử vong"],
      datasets: [
        {
          label: "Số người",
          data: [
            source.infected,
            source.treated,
            source.recovered,
            source.deceased,
          ],
          backgroundColor: ["#ffc107", "#17a2b8", "#28a745", "#dc3545"]
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
  showBusy: function() {
    $("#overlay").show();
  },
  hideBusy: function() {
    $("#overlay").hide();
  },
  updateNumber: function (infected,treated,recovered,deceased) {
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
