<!--
  Copyright (c) 2019

  Mapping component

  @author Spiros Dimopoulos <sdimopoulos@irisweb.gr>
  @version 1.0
 -->

<template>
    <b-container fluid>
        <b-row class="topinfo">
            <b-col>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
            </b-col>
            <b-col cols=10>
                <l-map
                    :options="{attributionControl: false}"
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

                    <l-control-attribution
                        position="bottomright"
                        prefix="<a href='https://openweathermap.org/'>OpenWeather</a>"
                    ></l-control-attribution>

                    <l-control position="topright">
                        <b-dropdown right :text="$t('active layers')" class="m-0 p-0" size="sm">
                            <b-dropdown-form class="m-0 p-0">
                                <b-form-group>
                                    <b-form-checkbox-group
                                        class="text-left"
                                        size="xs"
                                        v-model="activeLayers"
                                        :options="options"
                                        switches
                                        stacked
                                    >
                                    </b-form-checkbox-group>
                                </b-form-group>
                            </b-dropdown-form>
                        </b-dropdown>
                    </l-control>
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
import { LMap, LTileLayer, LControl, LControlAttribution } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'

export default {
    name: 'MeteoMap',
    components: {
        LMap,
        LTileLayer,
        LControl,
        LControlAttribution
    },
    data () {
        return {
          mapUrl: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
          zoom: 6,
          center: {lat: 38.436111, lng: 26.112442},
          bounds: null,
          
          owLayers: ['temp_new', 'clouds_new', 'precipitation_new', 'pressure_new', 'wind_new'], // openweather tile layers
          owLayersOpacity: [1, 1, 1, 1, 1], // layers opacity (have not figured best values yet)
          
          options: [ // switch box options
            { text: this.$t('temperature'), value: 'temp_new'} ,
            { text: this.$t('clouds'), value: 'clouds_new' },
            { text: this.$t('precipitation'), value: 'precipitation_new' },
            { text: this.$t('pressure'), value: 'pressure_new' },
            { text: this.$t('wind'), value: 'wind_new' }
          ],
          activeLayers: ['temp_new', 'clouds_new', 'precipitation_new', 'pressure_new', 'wind_new'] // selected layers (all by default, also checks 'activeLayers' item in localStorage
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
  },
  created() {
    if(window.localStorage.getItem('activeLayers')) { // load control panel options from local storage
        this.activeLayers = JSON.parse(window.localStorage.getItem('activeLayers'))
    }
  },
  beforeUpdate() {
    // save control panel options
    window.localStorage.setItem('activeLayers', JSON.stringify(this.activeLayers));
    
    // update switch box labels on languange change
    this.options = [
            {text: this.$t('temperature'), value: 'temp_new'},
            {text: this.$t('clouds'), value: 'clouds_new'},
            {text: this.$t('precipitation'), value: 'precipitation_new'},
            {text: this.$t('pressure'), value: 'pressure_new'},
            {text: this.$t('wind'), value: 'wind_new'}
          ]
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
    owGenerateUrls() {
        /* creates urls for selected OpenWeather map layers */
        return this.activeLayers.map(layer => `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${process.env.OW_USER_TOKEN}`)
    },
  }
}
</script>
