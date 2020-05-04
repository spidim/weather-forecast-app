/*
 * Weather Forecast API
 * This is the swagger definition of the weather forecast API. For more info contact sdimopoulos@irisweb.gr
 *
 * OpenAPI spec version: 1.0.0
 * Contact: sdimopoulos@irisweb.gr
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.4.13
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.WeatherForecastApi) {
      root.WeatherForecastApi = {};
    }
    root.WeatherForecastApi.ForecastInfoHumidity = factory(root.WeatherForecastApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';

  /**
   * The ForecastInfoHumidity model module.
   * @module model/ForecastInfoHumidity
   * @version 1.0.0
   */

  /**
   * Constructs a new <code>ForecastInfoHumidity</code>.
   * @alias module:model/ForecastInfoHumidity
   * @class
   */
  var exports = function() {
  };

  /**
   * Constructs a <code>ForecastInfoHumidity</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ForecastInfoHumidity} obj Optional instance to populate.
   * @return {module:model/ForecastInfoHumidity} The populated <code>ForecastInfoHumidity</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();
      if (data.hasOwnProperty('hourly_graph_url'))
        obj.hourlyGraphUrl = ApiClient.convertToType(data['hourly_graph_url'], 'String');
      if (data.hasOwnProperty('hourly_forecast'))
        obj.hourlyForecast = ApiClient.convertToType(data['hourly_forecast'], ['Number']);
    }
    return obj;
  }

  /**
   * Url of humidity forecast graph
   * @member {String} hourlyGraphUrl
   */
  exports.prototype.hourlyGraphUrl = undefined;

  /**
   * @member {Array.<Number>} hourlyForecast
   */
  exports.prototype.hourlyForecast = undefined;

  return exports;

}));
