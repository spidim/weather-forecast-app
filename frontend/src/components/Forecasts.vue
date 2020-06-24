<!--
  Copyright (c) 2019

  Detailed forecast table component

  @author Spiros Dimopoulos <sdimopoulos@irisweb.gr>
  @version 1.0
 -->


<template>
    <div>
        <b-alert show variant="dark" dismissible>
          {{ $t('forecast prompt') }}
        </b-alert>
        <b-container>
            <br/>
            <b-row>
                <b-col xl="12">
                    <Controls
                        v-on:selected_var="selectedVar = $event;"
                        :infoModalId="infoModalId"
                    />
                    <Modal :modalId="infoModalId" :text="$t('info prompt')"/>
                </b-col>
            </b-row>
            <b-row>
                <b-col class="p-3">{{ getTableTitle }}</b-col>
            </b-row>
            <b-row md="12" class="mt-4">
                <b-col class="">
                    <!-- table renders only if allCityData is populated -->
                    <b-table v-if="allCityData && allCityData.length"
                        striped hover borderless sticky-header
                        :style="{height: (selectedCity !== -1 ? '25vh' : '70vh')}"
                        small head-variant="light"
                        :items="forecast_items"
                        :fields="forecast_fields"
                    >
                        <!-- if selectedCity is set to an entry in allCityData -->
                        <template v-if="selectedCity !== -1" v-slot:[translateTableKey()]="data">
                            <!-- click city name to load plot -->
                            <a href="" v-on:click="toggleShowPlot($event, data.value)">
                                <!-- make selected city name bold, else regular -->
                                <strong v-if="data.value === allCityData[selectedCity].name ||
                                          ElToEnCityName(data.value) === allCityData[selectedCity].name"
                                >
                                    {{ data.value }}
                                </strong>
                                <span v-else>
                                    {{ data.value }}
                                </span>
                            </a>
                        </template>
                        <!-- otherwise render city name without formatting -->
                        <template v-else v-slot:[translateTableKey()]="data">
                            <!-- click city name to load plot -->
                            <a href="" v-on:click="toggleShowPlot($event, data.value)">
                                {{ data.value }}
                            </a>
                        </template>
                        
                    </b-table>
                    <h3 v-else>{{ $t('no forecasts') }}</h3>
                </b-col>
            </b-row>
            <b-container v-if="allCityData && allCityData.length && selectedCity !== -1">
                <b-row class="text-center">
                  <b-col>
                      <b-form-spinbutton id="endHours" :value="endHours" min="1" max="48" size="sm" inline @change="endHours = $event">
                      </b-form-spinbutton>
                      <span>{{ $t('hours') }}</span>
                  </b-col>
                  <b-col cols="8">
                      <h4>
                        {{ $t('plot for') }} {{ $t( allCityData[selectedCity].name.toLowerCase() ) }}
                    </h4>
                  </b-col>
                  <b-col>
                      <b-button-close @click="selectedCity = -1"></b-button-close>
                  </b-col>
                </b-row>
                <LineChart :chart-data="prepareDataset(endHours, selectedVar)"></LineChart>
            </b-container>
        </b-container>
</div>
</template>

<script>
    import data from '../../data2.json' // saved api responses [remove this import, only for development!!!]
    import {LIcon} from 'vue2-leaflet'
    import 'leaflet/dist/leaflet.css'
    import BackendApiHandler from '../utils/BackendApiHandler.js'
    import Controls from './Controls.vue'
    import Modal from './Modal.vue'
    import LineChart from './LineChart.vue'
    import { ElToEnCityName } from '../lang/cityName' // used to translate greek city names back to english

    export default {
      name: 'Forecasts',
      mixins: [
          {
              methods: { ElToEnCityName }
          }
      ],
      data() {
          return {
              infoModalId: "infoModal1",
              selectedVar: 'temperature',
              allCityData: [],
              selectedCity: -1, // index of city in allCityData
              endHours: 48 // timeline duration in hours for plot
          }
      },
      components: {
          Controls,
          LIcon,
          Modal,
          LineChart
      },
      methods: {
          parseAllCityInfo(error, data, response) {
              if (error) {
                  console.error(error);
              } else {
                  console.log('API called successfully. Returned data: ' + JSON.stringify(data));
                  this.allCityData = data;
              }
          },
          initDataOnTable() {
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
          toggleShowPlot (event, cityName) {
          /* load plot for cityName */
              event.preventDefault();

              this.selectedCity = this.allCityData.findIndex(city =>
                  (
                      city.name === (this.$i18n.locale === 'el'
                          ? this.ElToEnCityName(cityName) // translate city name back to English, otherwise no match (because allCityData does not get translated!)
                          : cityName
                      )
                  )
              )
          },
          prepareDataset: function (endHours, variable) {
          /* prepares dataset for plot */
              if (this.allCityData && this.allCityData.length) {
                  let labels = [];
                  let data = [];
                  let dt = Date.now();

                  this.allCityData[this.selectedCity].forecastInfo[variable].hourlyForecast.filter((entry, index) => {
                      if (index < endHours) { // pick datetime and selected variable measurements
                          labels.push(dt + (index*3600000)); // where to get dt from?
                          data.push(entry);
                      }
                  })

                  return {
                      locale: this.$i18n.locale,
                      variable: this.$t(variable), // pass selected variable name
                      labels: labels,
                      datasets: [
                          {
                              fill: false,
                              tension: 0,
                              borderColor: "#80b6f4", // if more than one datasets, color should be set randomly or left to chart.js to decide
                              label: this.$i18n.locale === 'el' // translate city name on label
                                  ? this.$t(this.allCityData[this.selectedCity].name.toLowerCase())
                                  : this.allCityData[this.selectedCity].name,
                              data: data
                          }
                      ]
                  }
              }
              else {
                  return {}
              }
        },
        translateTableKey() { // to overcome dynamic argument expression constraints (https://vuejs.org/v2/guide/syntax.html#Dynamic-Argument-Expression-Constraints)
            // tried passing an argument to the function too, it works but gives a warning
            return `cell(${this.$t('city')})`;
        }
    },
    computed: {
        forecast_items: function () {
            let data_for_table = [];
            this.allCityData.forEach(city => {
                var curr_data = {
                    [this.$t('city')] : this.$t(city.name.toLowerCase()) // translate key according to locale
                }
                for (var counter=0;counter<8;counter++)
                {
                    curr_data[String(counter)] =
                        city.forecastInfo[this.selectedVar].hourlyForecast[counter*6];
                }
                data_for_table.push(curr_data);
            });
            return data_for_table;
        },
        forecast_fields: function () {
            var currentDate = new Date(); // correct if we have fresh data, otherwise we should read start date from allCityData
            var options = { weekday: 'short', hour: '2-digit'};
            var fields = [
              {
                key: this.$t('city'), // key name according to locale
                sortable: true
              }
            ];
            for (var counter=0;counter<7;counter++)
            {
                currentDate.setHours(currentDate.getHours() + 6)
                var new_label = {
                  key: String(counter+1),
                  sortable: false,
                  label: this.$i18n.locale === 'en' // dates according to locale
                    ? currentDate.toLocaleDateString("en-US",options)
                    : currentDate.toLocaleDateString("el-GR",options)
                }
                fields.push(new_label);
            }
          return fields;
        },
        getTableTitle: function () {
            let unit_map = {
                "temperature" : "\u2103",
                "pressure" : "hPa",
                "humidity" : "%",
            };
            return `${this.$t(this.selectedVar)} ${this.$t('in')} ${unit_map[this.selectedVar]}`;
        }
    },
    created() {
        console.log('Load our data first');
        if (process.env.NODE_ENV === 'development') {
            this.allCityData = data;
        }
        else {
            this.initDataOnTable();
        }
    },
  }
</script>
