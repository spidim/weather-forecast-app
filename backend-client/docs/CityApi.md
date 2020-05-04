# WeatherForecastApi.CityApi

All URIs are relative to *https://forecast-api.irisweb.gr/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getAllCityInfo**](CityApi.md#getAllCityInfo) | **GET** /city | Get a list of all cities
[**getCityInfo**](CityApi.md#getCityInfo) | **GET** /city/{cityId} | Find city by ID


<a name="getAllCityInfo"></a>
# **getAllCityInfo**
> [City] getAllCityInfo()

Get a list of all cities

Returns all available city forecasts

### Example
```javascript
var WeatherForecastApi = require('weather_forecast_api');
var defaultClient = WeatherForecastApi.ApiClient.instance;

// Configure API key authorization: api_key
var api_key = defaultClient.authentications['api_key'];
api_key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//api_key.apiKeyPrefix = 'Token';

var apiInstance = new WeatherForecastApi.CityApi();

var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getAllCityInfo(callback);
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**[City]**](City.md)

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getCityInfo"></a>
# **getCityInfo**
> City getCityInfo(cityId)

Find city by ID

Returns a city's weather info

### Example
```javascript
var WeatherForecastApi = require('weather_forecast_api');
var defaultClient = WeatherForecastApi.ApiClient.instance;

// Configure API key authorization: api_key
var api_key = defaultClient.authentications['api_key'];
api_key.apiKey = 'YOUR API KEY';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//api_key.apiKeyPrefix = 'Token';

var apiInstance = new WeatherForecastApi.CityApi();

var cityId = 56; // Number | ID of city to return


var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.getCityInfo(cityId, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **cityId** | **Number**| ID of city to return | 

### Return type

[**City**](City.md)

### Authorization

[api_key](../README.md#api_key)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

