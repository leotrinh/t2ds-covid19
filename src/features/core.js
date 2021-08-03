//#region  T2DS Function
const oT2DSCoreFunc = {
  initCore: function () {
    console.log("T2DS Init Core Function");
    this.onRouteMatch();
    this.bindCityData("");
  },
  onRouteMatch: function () {
    let currUrlString = window.location.href;
    let url = new URL(currUrlString);
    let location = url.searchParams.get("location");
    if (location) {
      this.getLatestDataAndBuildChart(location);
      return;
    }
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
    if (apiConfig.totalDataEndpoint) {

      var fnPostDataSuccess = function (response) {
        if (response) {
          let data = response.data;
          let treated = data.Confirmed - (data.Recovered + data.Death);
          let source = {
            infected: data.Confirmed,
            treated: treated,
            recovered: data.Recovered,
            deceased: data.Death,
            lastUpdatedAtSource: data.ModifiedDate,
          };
          that.buildSummaryChart(source);
        }
      }.bind(this);
  
      //callback if post error
      var fnPostDataError =  function(oError){
        
        if(oError){
          console.log("Errror",oError);
        }
      }.bind(this);
      httpHelperFunc.postData(apiConfig.totalDataEndpoint,{},fnPostDataSuccess,fnPostDataError);
    }
  },
  sumDatabyKey: function(items,prop){
    const sum = items.reduce((a, b) => a + b[prop], 0);
    return sum;
  },
  bindCityData: function (cityId) {
    if (apiConfig.cityDataEndpoint) {
      const that = this;
      var fnPostDataSuccess = function (response) {
        if (response) {
          that.buildCityLst(response.list);
          that.transformDataToMap(response.list);
          let source = {
            infected: 0,
            treated: 0,
            recovered: 0,
            deceased: 0,
            lastUpdatedAtSource: new Date().toString(),
          };
          let vacv1 = this.sumDatabyKey(response.list,"onevaccine");
          let vacfull = this.sumDatabyKey(response.list,"donevaccine");
          let oVac = {
            vacv1: vacv1,
            vacfull:vacfull
          }; 
          let currentCity = "Toàn quốc";
          if(cityId!==""){
            
          let aCities = this.getExistItemsInArray(response.list, "id", cityId);
          let data =  aCities[0]; 
           source = {
              infected: data.confirmed,
              treated: data.confirmed - (data.recovered + data.deaths),
              recovered: data.recovered,
              deceased: data.deaths,  
              lastUpdatedAtSource: new Date().toString(),
            };
            oVac.vacv1=data.onevaccine;
            oVac.vacfull=data.donevaccine;
            if (data.title !== "") {
              currentCity = data.title;
            }
            that.buildSummaryChart(source);   
          }else{
            that.getLatestDataAndBuildChart();
          }
          
          $("#head-sum").text("Thống kê COVID-19: " + currentCity);
          that.updateVacNumber(oVac.vacv1,oVac.vacfull);
         
        }
      }.bind(this);
  
      //callback if post error
      var fnPostDataError =  function(oError){
        
        if(oError){
          console.log("Errror",oError);
        }
      }.bind(this);
      httpHelperFunc.postData(apiConfig.cityDataEndpoint,{},fnPostDataSuccess,fnPostDataError);
    }
  },
  buildCityLst: function (aCities) {
    let cityListElm = $("#cityLst");
    if (cityListElm[0]) {
      if (aCities) {
        aCities.forEach((city,idx) => {
          let displayDetail ='<div class="d-flex flex-column bd-highlight mb-3">'+
                              '<div class="p-2 bd-highlight t2ds-city"><span class="t2ds-city__name">'+city['title']+'</span></div>'+
                              '<div class="p-2 bd-highlight">'+
                              '<label class="alert alert-danger mr-3 mb-3">'+
                              '<div class="thong-ke-label-update-number">Tổng <span class="badge badge-danger ml-2">'+this.numberWithCommas(city.confirmed)+'%</span></div>'+
                               '</label>'+
                               '</div>'+
                               '<div class="p-2 bd-highlight">'+
                              '<label class="alert alert-warning mr-3 mb-3">'+
                              '<div class="thong-ke-label-update-number">Vaccine mũi 1 <span class="badge badge-warning ml-2">'+this.numberWithCommas(city.incconfirmed)+'%</span></div>'+
                               '</label>'+
                               '</div>'+
                              '<div class="p-2 bd-highlight">'+
                              '<label class="alert alert-primary mr-3 mb-3">'+
                              '<div class="thong-ke-label-update-number">Vaccine mũi 1 <span class="badge badge-info ml-2">'+city.onevaccinepercent+'%</span></div>'+
                               '</label>'+
                               '</div>'+
                               '<div class="p-2 bd-highlight">'+
                               '<label class="alert alert-success mr-3 mb-3">'+
                               '<div class="thong-ke-label-update-number">Vaccine đủ liều <span class="badge badge-success ml-2">'+city.donevaccinepercent+'%</span></div>'+
                                '</label>'+
                                '</div>'+
                              '</div>';
          let rowId = "city-"+idx;
          let cityElm = $(
            '<li><a class="city-item" onClick="onCitySelected('+idx+')" id="'+rowId+'" city-id="' + city["id"] +'">' +
            displayDetail+
              "</a></li>"
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
    this.updateNumberData(infected, treated, recovered, deceased);
    var oSumData = {
      labels: [
        "Số ca lây nhiễm",
        "Đang điều trị",
        "Đã hồi phục",
        "Số ca tử vong",
      ],
      datasets: [
        {
          label: "Số ca",
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
  transformDataToMap: function(aSource){
    let data = [];
    aSource.forEach(source=>{
      let city = {
        socakhoi: source.recovered,
        socadangdieutri: source.confirmed-(source.recovered+source.deaths),
        socatuvong: source.deaths,
        "iso_3166_2": source.id,
        value: source.confirmed,
      };
      data.push(city);
    });
    this.buildMapData(data);
  },
  buildMapData: function (data) {
    //  var datasample = [
    //   {
    //     socakhoi: 3069,
    //     socadangdieutri: 2689,
    //     socatuvong: 7,
    //     "iso_3166_2": "24",
    //     value: 5765,
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
  updateNumberData: function (infected, treated, recovered, deceased) {
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
  updateVacNumber: function(vacv1,vacfull){
    vacv1 = this.numberWithCommas(vacv1);
    vacfull = this.numberWithCommas(vacfull);
    $("#vac-1").text(vacv1);
    $("#vac-full").text(vacfull);
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
    if(typeof value===undefined || typeof value==="undefined"){
      return 0;
    }
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
function onCitySelected(idx) {
  oT2DSCoreFunc.showBusy();
  let cityElem = $("#city-"+idx);
  let inputCity = "";
  if(cityElem[0]){
    inputCity = cityElem.attr( "city-id" );
  }
  oT2DSCoreFunc.bindCityData(inputCity);

}
