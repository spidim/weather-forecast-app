# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO
import pytest
from unittest.mock import patch

from backend_server.models.city import City  # noqa: E501
from backend_server.test import BaseTestCase
from backend_server.test import mock_city_data
from backend_server.helpers.openw_client import OpenWClient

class TestCityController(BaseTestCase):
    """CityController integration test stubs"""

    def test_get_all_city_info(self):
        """Test case for get_all_city_info

        Get a list of all cities
        """
        with patch.object(OpenWClient, 'get_all_city_data', return_value=mock_city_data.city_list) as mock_method:
            response = self.client.open(
                '/v1/city',
                method='GET')
            self.assert200(response,
                           'Response body is : ' + response.data.decode('utf-8'))
            assert response.json == mock_city_data.city_list

    def test_get_city_info(self):
        """Test case for get_city_info

        Find city by ID
        """
        with patch.object(OpenWClient, 'get_city_data_by_id', return_value=mock_city_data.city_list[0]) as mock_method:
            response = self.client.open(
                '/v1/city',
                method='GET')
            response = self.client.open(
                '/v1/city/{cityId}'.format(cityId=1),
                method='GET')
            self.assert200(response,
                           'Response body is : ' + response.data.decode('utf-8'))
            assert response.json == mock_city_data.city_list[0]

    def test_get_city_info_swapped_id(self):
        """Test case for get_city_info when giving other id

        Find city by ID
        """
        with patch.object(OpenWClient, 'get_city_data_by_id', return_value=mock_city_data.city_list[1]) as mock_method:
            response = self.client.open(
                '/v1/city',
                method='GET')
            response = self.client.open(
                '/v1/city/{cityId}'.format(cityId=1),
                method='GET')
            self.assert200(response,
                           'Response body is : ' + response.data.decode('utf-8'))
            assert response.json != mock_city_data.city_list[0]

class TestHelpers():

    def test_ow_client_init(self):
        """Test case to init ow_client object

        Try to initialize ow_client with a dummy city list
        """
        cities_list = [ {"name" : i["name"],
                         "lon" : i["coords"]["lon"],
                         "lat" : i["coords"]["lat"]
                         } for i in mock_city_data.city_list ]
        ow_client = OpenWClient(cities_list)


if __name__ == '__main__':
    import unittest
    unittest.main()
