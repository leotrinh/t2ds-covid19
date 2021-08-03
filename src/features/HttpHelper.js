const httpHelperFunc = {
  errorHandler: function (oError) {
    console.log("Errror", oError);
    let errorMsg = "";
    if (oError.message) {
        errorMsg = oError.message;
    } else {
        if (oError.responseJSON.message) {
            errorMsg = oError.responseJSON.message;
        } else {
            errorMsg = oError.statusText;
        }
    }
    errorDialog(errorMsg);
},
  /**
   * Send GET type HTTP request using jquery ajax (expect json data type response by default)
   * @param {string} url - url to which the request is sent
   * @param {function} fnSuccess - callback function called when the request succeeds
   * @param {function} fnError - callback function called when the request fails
   * @param {Object} oSettings - Custom settings for ajax function in key-value format (currently support: headers, async, cache, dataType)
   */
  getData: function (url, fnSuccess, fnError, oSettings = {}) {
    let {
      headers = {},
      async = true,
      cache = true,
      dataType = "json",
    } = oSettings;
    return $.ajax({
      url: url, // url
      type: "GET", // Request type - Get
      dataType: dataType, // Return datatype,
      cache: cache,
      headers: {
        ...headers,
      },
      success: (data) => {
        if (fnSuccess) {
          fnSuccess(data);
        }
      },
      error: (error) => {
        if (fnError) {
          fnError(error);
          return;
        }
      },
      async: async,
    });
  },
  /**
   * Send POST type HTTP request using jquery ajax (expect json data type response by default)
   * @param {string} url - url to which the request is sent
   * @param {Object} oPayload - input data to be submit with the request
   * @param {function} fnSuccess - callback function called when the request succeeds
   * @param {function} fnError - callback function called when the request fails
   * @param {Object} oSettings - Custom settings for ajax function in key-value format (currently support: headers, async, contentType, dataType)
   */
  postData: function (url, oPayload, fnSuccess, fnError, oSettings = {}) {
    var oDeferred = $.Deferred();

    let {
      headers = {},
      async = true,
      dataType = "json",
      contentType = "application/json; charset=utf-8",
    } = oSettings;
    //post backdata
    $.ajax({
      url: url, // url
      type: "POST", // Request type - Post
      dataType: dataType, // Return datatype,
      contentType: contentType,
      data: JSON.stringify(oPayload),
      headers: {
        ...headers,
      },
      success: (response) => {
        if (fnSuccess) {
          fnSuccess(response);
        }
        oDeferred.resolve(response);
      },
      error: (error) => {
        if (fnError) {
          fnError(error);
          return;
        }
        oDeferred.reject(error);
      },
      async: async,
    });

    return oDeferred;
  },
};

/*HOW TO USE
//Sample Get Data

    //callback ifget data success
    var fnGetDataSuccess = function (response) {
        if (response) {
          
          console.log("Data ",response);
        }
      }.bind(this);
  
      //call back if get Error
      var fnGetDataError =  function(oError){
        if(oError){
          console.log("Errror",oError);
        }
      }.bind(this);
      httpHelperFunc.getData(apiConfig.dataEndpoint,fnGetDataSuccess,fnGetDataError);
  
      //Sample Post Data
      var oPayload = {
        username:"abc",
        password:"123456"
      };
      
      //call back if post sucess
      var fnPostDataSuccess = function (response) {
        if (response) {
        
          console.log("Data ",response);
        }
      }.bind(this);
  
      //callback if post error
      var fnPostDataError =  function(oError){
        
        if(oError){
          console.log("Errror",oError);
        }
      }.bind(this);
      httpHelperFunc.postData(apiConfig.dataEndpoint,oPayload,fnPostDataSuccess,fnPostDataError);
      */