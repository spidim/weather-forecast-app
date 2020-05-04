import requests
import os
import sys
from datetime import datetime

class OpenWClient:

    def __init__(self,cities):
        try:
            self.USER_TOKEN = os.environ['OW_USER_TOKEN']
        except KeyError as e:
            print("The OW_USER_TOKEN environment variable is not set."+
                    " Please set it in the environment and try again", file=sys.stderr)
            raise RuntimeError('The OW_USER_TOKEN environment variable is required')
        self.DEFAULT_URL = "https://api.openweathermap.org/data/2.5/onecall"
        self.cities = cities
        self.all_city_data = []
        self.weather_icons_base_url = "http://openweathermap.org/img/wn/{}@2x.png"

    def get_all_city_data(self):
        return self.all_city_data

    def get_city_data_by_id(self,city_id):
        return self.all_city_data[city_id]

    def fetch_all_city_data_from_remote_api(self):
        """
        Connects to OpenWeather API and fetches current forecasts.
        """
        all_city_data = []
        for city in self.cities:
            parameters = {'lat': city['lat'], 'lon': city['lon'],
                          'units': 'metric', 'appid': self.USER_TOKEN}
            try:
                r = requests.get(self.DEFAULT_URL, params=parameters)
                r.raise_for_status()
                city_data = r.json()
                city_data.update([('name', city['name']), ('id', city['id']),
                                  ('lat', city['lat']), ('lon', city['lon'])])
                all_city_data.append(city_data)
            except Exception as e:
                print('Something went wrong while fetching city data from remote API')
                print(e)
        self.all_city_data = all_city_data

    def get_weather_icon_url(self, icon_id):
        return self.weather_icons_base_url.format(icon_id)

    def get_hourly_forecast(self, hourly_data):
        """
        Extracts the hourly forecast from the original payload
        """
        forecast_variable_map = {'temperature': 'temp',
                                 'pressure': 'pressure',
                                 'humidity': 'humidity'}
        forecast_weather = "weather"
        hourly_forecast = {}

        for key in forecast_variable_map.keys():
            hourly_forecast[key] = []
        hourly_forecast['hour24'] = []
        hourly_forecast[forecast_weather] = []

        for curr_hour_data in hourly_data:
            dts=datetime.fromtimestamp(curr_hour_data['dt'])
            hourly_forecast['hour24'].append(dts.hour)
            for key in forecast_variable_map.keys():
                hourly_forecast[key].append(curr_hour_data[forecast_variable_map[key]])
            hourly_forecast[forecast_weather].append(self.get_weather_icon_url(
                curr_hour_data[forecast_weather][0]['icon']))
        return hourly_forecast


    def parse_city_remote_data_to_weather_info(self, remote_data):
        """
        Parse the weather data and create compatible output to our Data Model
        """
        print("Got city data to parse ",remote_data)
        weather_info = {
            'currWeatherIconId': self.get_weather_icon_url(remote_data['current']['weather'][0]['icon']),
            'forecast_hourly': self.get_hourly_forecast(remote_data['hourly'])
        }
        return weather_info
