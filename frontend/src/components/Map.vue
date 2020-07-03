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
                    :options="{attributionControl: false, preferCanvas: true}"
                    style="height: 80vh; width: 100%; margin-left: auto; margin-right: auto;"
                    :zoom="zoom"
                    :center="center"
                    @update:zoom="zoomUpdated"
                    @update:center="centerUpdated"
                    @update:bounds="boundsUpdated">

                    <l-tile-layer :url="mapUrl"></l-tile-layer>

                    <l-control-attribution
                        position="bottomright"
                        prefix="<a href='https://www.openstreetmap.org/copyright'>© OpenStreetMap contributors</a>"
                    ></l-control-attribution>
                    
                    <l-marker v-for="(city, index) in allCityData" :key="`${city.coords.lat},${city.coords.lon}`"
                        :lat-lng="[city.coords.lat,city.coords.lon]"
                        :icon="l_icon(city.currWeatherIconId)"
                    >
                        <l-popup :options="{'maxWidth': 'auto'}">
                            <PopupViewChart
                                :name="city.name"
                                :ref="city.name"
                                :cityData="allCityData[index]"
                            >
                            </PopupViewChart>
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
                <span style="font-family: 'Roboto Mono', courier; font-size: 90%">{{ centerSimple }}</span>
            </b-col>

            <b-col cols=2>
                <span style="font-family: 'Roboto Mono', courier; font-size: 90%">{{ zoom }}</span>
            </b-col>

            <b-col cols=6>
                <span style="font-family: 'Roboto Mono', courier; font-size: 90%">{{ boundsSimple }}</span>
            </b-col>

            <b-col>
            </b-col>
        </b-row>

    </b-container>
</template>

<script>
import {LMap, LTileLayer, LMarker, LIcon, LPopup, LControlAttribution} from 'vue2-leaflet'
import { Icon }  from 'leaflet'
import 'leaflet/dist/leaflet.css'
//import PopupView from './PopupView.vue'
import PopupViewChart from './PopupViewChart.vue'
import BackendApiHandler from '../utils/BackendApiHandler.js'
import data from '../../data2.json' // saved api responses [remove this import, only for development!!!]

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
        LControlAttribution,
        //PopupView,
        PopupViewChart
    },
    data () {
        return {
          mapUrl: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
          zoom: 6,
          center: {lat: 38.436111, lng: 26.112442},
          bounds: null,
          allCityData: []
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
    /*resetZoom(cityName) {
        this.$refs[cityName][0].reset([0, 1, 2]);
    }*/
  },
  created() {
    console.log('Load our data first');
    if (process.env.NODE_ENV === 'development') {
        this.allCityData = data;
    }
    else {
        this.initDataOnMap();
    }

    this.refer = this.allCityData.map(city => city.name);
  },
  computed: {
    centerSimple() {
    /* formats center as "(lat, lng)" */
        return `(${this.center.lat.toFixed(6)}, ${this.center.lng.toFixed(6)})`;
    },

    boundsSimple() {
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
  }
}
</script>
