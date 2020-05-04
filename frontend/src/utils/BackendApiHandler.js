/**
 * Copyright (c) 2019
 *
 * Coordinated the backend calls
 *
 * @author Spiros Dimopoulos <sdimopoulos@irisweb.gr>
 * @version 1.0
 */


export default class BackendApiHandler
{
    constructor() {

        var WeatherForecastApi = require('weather_forecast_api');

        var defaultClient = WeatherForecastApi.ApiClient.instance;
        defaultClient.basePath = process.env.VUE_APP_BACKEND_BASE_URL

        // Configure API key authorization: api_key
        var api_key = defaultClient.authentications['api_key'];
        api_key.apiKey = process.env.VUE_APP_API_KEY
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //api_key.apiKeyPrefix['token'] = "Token"
     }
     getAllCityInfo(callback)
     {
        var WeatherForecastApi = require('weather_forecast_api');

        var defaultClient = WeatherForecastApi.ApiClient.instance;
        defaultClient.basePath = process.env.VUE_APP_BACKEND_BASE_URL

        // Configure API key authorization: api_key
        var api_key = defaultClient.authentications['api_key'];
        api_key.apiKey = process.env.VUE_APP_API_KEY
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        //api_key.apiKeyPrefix['token'] = "Token"

        var api = new WeatherForecastApi.CityApi()


        api.getAllCityInfo(callback);
    }
}
