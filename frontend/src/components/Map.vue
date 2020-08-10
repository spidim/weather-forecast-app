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
                    :options="{
                        attributionControl: false,
                        preferCanvas: true,
                        wheelPxPerZoomLevel: activeCityPopup !== -1 ? Number.MAX_VALUE : 60 // prevent wheel zooming when popup is displayed
                    }"
                    style="height: 80vh; width: 100%; margin-left: auto; margin-right: auto;"
                    :zoom="zoom"
                    :center="center"
                    @update:zoom="zoomUpdated"
                    @update:center="centerUpdated"
                    @update:bounds="boundsUpdated"
                >

                    <l-tile-layer :url="mapUrl"></l-tile-layer>

                    <l-control-attribution
                        position="bottomright"
                        prefix="<a href='https://www.openstreetmap.org/copyright'>© OpenStreetMap contributors</a>"
                    ></l-control-attribution>
                    
                    <l-marker v-for="(city, index) in allCityData" :key="`${city.coords.lat},${city.coords.lon}`"
                        :lat-lng="[city.coords.lat,city.coords.lon]"
                        :icon="l_icon(city.currWeatherIconId)"
                        @popupclose="activeCityPopup = -1; resetZoom(index);"
                        @popupopen="activeCityPopup = city.id"
                    >
                        <l-tooltip
                            :options="{
                                direction: 'bottom',
                                offset: [iconOptions.iconAnchor[0], iconOptions.iconAnchor[1]/2],
                                opacity: activeCityPopup !== city.id ? 0.9 : 0 // hide active city popup tooltip
                            }"
                        >
                            {{ $t(city.name.toLowerCase()) }}
                        </l-tooltip>
                        <l-popup
                            :options="{
                                'maxWidth': 'auto',
                                offset: [iconOptions.iconAnchor[0], 0]
                            }"
                        >
                            <PopupViewChart
                                :chartData="chartData[index]"
                                :active="activeCityPopup === city.id"
                                :ref="index"
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
import { LMap, LTileLayer, LMarker, LIcon, LPopup, LControlAttribution, LTooltip } from 'vue2-leaflet'
import { Icon }  from 'leaflet'
import 'leaflet/dist/leaflet.css'
//import PopupView from './PopupView.vue'
import PopupViewChart from './PopupViewChart.vue'
import BackendApiHandler from '../utils/BackendApiHandler.js'
import { mapGetters } from 'vuex'

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
        PopupViewChart,
        LTooltip
    },

    props: {
        iconScale: { // scale map icon size
            type: Number,
            required: false,
            default: 1.0
        }
    },

    data () {
        return {
            mapUrl: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            zoom: 6,
            center: {lat: 38.436111, lng: 26.112442},
            bounds: null,
            activeCityPopup: -1 // city id of displayed popup
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
        
        l_icon(icon) {
            //console.log(...this.calculateIconOptions().iconAnchor)
            return L.icon({
                iconUrl: icon,
                ...this.iconOptions
            })
        },
        
        resetZoom(cityIndex) {
            this.$refs[cityIndex][0].reset([0,1,2])
        },
        
        calculateIconOptions(scale = this.iconScale) {
            return {
                iconSize:     [Math.round(64/scale), Math.round(64/scale)], // size of the icon
                shadowSize:   [Math.round(50/scale), Math.round(64/scale)], // size of the shadow
                iconAnchor:   [Math.round(16/scale), Math.round(32/scale)], // point of the icon which will correspond to marker's location
            }
        }
    },

    created() {
        console.log('Load our data first');
        this.$store.dispatch('allCityData/setAllCityDataAsync')
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

            return out
                .replace("_southWest", "SW")
                .replace("_northEast", "NE");
        },

        iconOptions() {
            return this.calculateIconOptions()

        },

        // map store state to computed properties
        ...mapGetters('allCityData', {
            allCityData: 'getAllCityData'
        }),
        ...mapGetters('chartData', {
            chartData: 'getChartData'
        })
    }
}
</script>