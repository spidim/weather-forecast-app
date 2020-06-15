<!--
  Copyright (c) 2019

  Mapping component

  @author Spiros Dimopoulos <sdimopoulos@irisweb.gr>
  @version 1.0
 -->

<template>
    <b-container fluid>
        <b-alert show variant="dark" dismissible>
          {{$t('map prompt')}}
        </b-alert>

        <b-row class="topinfo">
            <b-col>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
            </b-col>
            <b-col cols=10>
                <l-map
                    style="height: 80vh; width: 100%; margin-left: auto; margin-right: auto;"
                    :zoom="zoom"
                    :center="center"
                    @update:zoom="zoomUpdated"
                    @update:center="centerUpdated"
                    @update:bounds="boundsUpdated">

                    <l-tile-layer :url="mapUrl"></l-tile-layer>
                    <l-tile-layer v-for="(url, index) in owGenerateUrls"
                        :key="url"
                        :url="url"
                        :opacity="owLayersOpacity[index]"
                    ></l-tile-layer>
                    
                    <l-marker v-for="city in allCityData" :key="`${city.coords.lat},${city.coords.lon}`"
                        :lat-lng="[city.coords.lat,city.coords.lon]"
                        :icon="l_icon(city.currWeatherIconId)">
                        <l-popup :options="{'maxWidth': 'auto'}">
                            <PopupViewAlt :forecast="city.forecastInfo"
                                :name="city.name">
                            </PopupViewAlt>
                        </l-popup>
                    </l-marker>
                </l-map>
            </b-col>

            <b-col>
            </b-col>
        </b-row>

        <b-row class="pt-1">
            <b-col>
            </b-col>
        </b-row>

        <b-row align-v="end" class="pb-0 mb-0">
            <b-col>
            </b-col>

            <b-col cols=2>
                <span><strong>{{$t('center')}}</strong></span>
            </b-col>

            <b-col cols=2>
                <span><strong>{{$t('zoom')}}</strong></span>
            </b-col>

            <b-col cols=6>
                <span><strong>{{$t('bounds')}}</strong></span>
            </b-col>

            <b-col>
            </b-col>
        </b-row>

        <b-row align-v="start" class="pt-0 mt-0">
            <b-col>
            </b-col>

            <b-col cols=2>
                <span style="font-family: 'Roboto Mono', courier; font-size: 90%">{{ center_simple }}</span>
            </b-col>

            <b-col cols=2>
                <span style="font-family: 'Roboto Mono', courier; font-size: 90%">{{ zoom }}</span>
            </b-col>

            <b-col cols=6>
                <span style="font-family: 'Roboto Mono', courier; font-size: 90%">{{ bounds_simple }}</span>
            </b-col>

            <b-col>
            </b-col>
        </b-row>

    </b-container>
</template>

<script>
import {LMap, LTileLayer, LMarker, LIcon, LPopup} from 'vue2-leaflet'
import { Icon }  from 'leaflet'
import 'leaflet/dist/leaflet.css'
import PopupViewAlt from './PopupViewAlt.vue'
import BackendApiHandler from '../utils/BackendApiHandler.js'
import GlobalMercator from '../utils/globalmaptiles.js'

// this part resolve an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
export default {
    name: 'Map',
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LIcon,
        LPopup,
        PopupViewAlt
    },
    data () {
        return {
          mapUrl: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
          zoom: 6,
          center: {lat: 38.436111, lng: 26.112442},
          bounds: null,
          allCityData: [],
          owLayers: ['temp_new', 'clouds_new', 'precipitation_new', 'pressure_new', 'wind_new'], // openweather tile layers,
          owLayersOpacity: [0.6, 0.6, 0.6, 0.6, 0.6] // have not figured best values yet
        };
    },
    methods: {
    zoomUpdated (zoom) {
      this.zoom = zoom;
    },
    centerUpdated (center) {
      this.center = center;
    },
    boundsUpdated (bounds) {
      this.bounds = bounds;
    },
    parseAllCityInfo(error, data, response) {
        if (error) {
            console.error(error);
        } else {
            console.log('API called successfully. Returned data: ' + JSON.stringify(data));
            this.allCityData = data;
        }
    },
    initDataOnMap() {
        const backendapi = new BackendApiHandler();
        backendapi.getAllCityInfo(this.parseAllCityInfo);
    },
    l_icon(icon) {
        return L.icon({
            iconUrl: icon,
            iconSize:     [64, 64], // size of the icon
            shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [16, 32], // point of the icon which will correspond to marker's location
        })
    },
  },
  created() {
    console.log('Load our data first');
    this.initDataOnMap();
  },
  computed: {
    center_simple() {
    /* formats center as "(lat, lng)" */
        return `(${this.center.lat.toFixed(6)}, ${this.center.lng.toFixed(6)})`;
    },

    bounds_simple() {
    /* formats bounds as "SW: (lat, lng) NE: (lat, lng)" */
        var out = "";
        if (this.bounds) {
            Object.keys(this.bounds).forEach(
                (el) => {
                    // add values for each property
                    out += el + ": (" + Object.values(this.bounds[el]).join(", ") + ") ";
                }
            )
        }

        out = out.replace("_southWest", "SW");
        out = out.replace("_northEast", "NE");
        return out;
    },
    owGenerateUrls() {
        /* creates urls for OpenWeather map layers */
        return this.owLayers.map(layer => `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${process.env.OW_USER_TOKEN}`)
    },
  }
}
</script>
