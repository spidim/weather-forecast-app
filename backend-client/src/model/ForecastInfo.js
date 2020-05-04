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
    define(['ApiClient', 'model/ForecastInfoHumidity', 'model/ForecastInfoPressure', 'model/ForecastInfoTemperature'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./ForecastInfoHumidity'), require('./ForecastInfoPressure'), require('./ForecastInfoTemperature'));
  } else {
    // Browser globals (root is window)
    if (!root.WeatherForecastApi) {
      root.WeatherForecastApi = {};
    }
    root.WeatherForecastApi.ForecastInfo = factory(root.WeatherForecastApi.ApiClient, root.WeatherForecastApi.ForecastInfoHumidity, root.WeatherForecastApi.ForecastInfoPressure, root.WeatherForecastApi.ForecastInfoTemperature);
  }
}(this, function(ApiClient, ForecastInfoHumidity, ForecastInfoPressure, ForecastInfoTemperature) {
  'use strict';

  /**
   * The ForecastInfo model module.
   * @module model/ForecastInfo
   * @version 1.0.0
   */

  /**
   * Constructs a new <code>ForecastInfo</code>.
   * @alias module:model/ForecastInfo
   * @class
   */
  var exports = function() {
  };

  /**
   * Constructs a <code>ForecastInfo</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ForecastInfo} obj Optional instance to populate.
   * @return {module:model/ForecastInfo} The populated <code>ForecastInfo</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();
      if (data.hasOwnProperty('overall'))
        obj.overall = ApiClient.convertToType(data['overall'], ['String']);
      if (data.hasOwnProperty('temperature'))
        obj.temperature = ForecastInfoTemperature.constructFromObject(data['temperature']);
      if (data.hasOwnProperty('humidity'))
        obj.humidity = ForecastInfoHumidity.constructFromObject(data['humidity']);
      if (data.hasOwnProperty('pressure'))
        obj.pressure = ForecastInfoPressure.constructFromObject(data['pressure']);
    }
    return obj;
  }

  /**
   * Hourly overall forecast condition icon Id
   * @member {Array.<String>} overall
   */
  exports.prototype.overall = undefined;

  /**
   * @member {module:model/ForecastInfoTemperature} temperature
   */
  exports.prototype.temperature = undefined;

  /**
   * @member {module:model/ForecastInfoHumidity} humidity
   */
  exports.prototype.humidity = undefined;

  /**
   * @member {module:model/ForecastInfoPressure} pressure
   */
  exports.prototype.pressure = undefined;

  return exports;

}));
