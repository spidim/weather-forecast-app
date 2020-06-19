<!--
  Copyright (c) 2019

  Detailed forecast table component

  @author Spiros Dimopoulos <sdimopoulos@irisweb.gr>
  @version 1.0
 -->


<template>
    <div>
        <b-alert show variant="dark" dismissible>
          {{$t('forecast prompt')}}
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
                    <b-table striped hover borderless
                        small head-variant="light"
                        :items="forecast_items"
                        :fields="forecast_fields"
                    >
                        <template v-slot:[translateTableKey()]="data">
                            <!-- click city name to load plot -->
                            <a href="" v-on:click="toggleShowPlot($event, data.value)">{{ data.value }}</a>
                        </template>
                        
                    </b-table>
                </b-col>
            </b-row>
            <h4>{{ $t('plot for') }} {{ $t( allCityData[selectedCity].name.toLowerCase() ) }}</h4>
            <LineChart :chart-data="prepareDataset(endHours, selectedVar)"></LineChart>
        </b-container>
</div>
</template>

<script>
    import data from '../../data.json' // saved api responses [remove this import, only for development!!!]
    import {LIcon} from 'vue2-leaflet'
    import 'leaflet/dist/leaflet.css'
    import BackendApiHandler from '../utils/BackendApiHandler.js'
    import Controls from './Controls.vue'
    import Modal from './Modal.vue'
    import LineChart from './LineChart.vue'
    import { ElToEnCityName } from '../lang/cityName' // used to translate greek city names to english

    export default {
      name: 'Forecasts',
      data() {
          return {
              infoModalId: "infoModal1",
              selectedVar: 'temperature',
              allCityData: [],
              selectedCity: 0, // index of city in allCityData
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

              // translate city name back to English, otherwise no match (because allCityData does not get translated!)
              if (this.$i18n.locale === 'el') {
                  this.selectedCity = this.allCityData.findIndex(city => city.name === ElToEnCityName(cityName));
              }
              else {
                this.selectedCity = this.allCityData.findIndex(city => city.name === cityName);
              }
          },
          prepareDataset: function (endHours, variable) {
          /* prepares dataset for plot */
              let labels = []
              let data = []

              this.allCityData[this.selectedCity].hourly.filter((entry, index) => {
                  if (index < endHours) { // pick time and selected variable measurements
                      //labels.push(new Date(entry.dt*1000))
                      labels.push(entry.dt*1000)
                      data.push(entry[variable])
                  }
              })

              return {
                  locale: this.$i18n.locale === 'en' ? 'en-US' : 'el-GR',
                  variable: this.$t(variable), // pass selected variable name
                  labels: labels,
                  datasets: [
                      {
                          fill: false,
                          tension: 0,
                          borderColor: "#80b6f4", // if more than one datasets, color should be set randomly or left to chart.js to decide
                          label: this.allCityData[this.selectedCity].name,
                          data: data
                      }
                  ]
              }
        },
        translateTableKey() { // to overcome dynamic argument expression constraints (https://vuejs.org/v2/guide/syntax.html#Dynamic-Argument-Expression-Constraints)
            // tried passing an argument to the function too, it works but we get a warning
            return `cell(${this.$t('city')})`
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
                    if (process.env.NODE_ENV === 'development') {
                        curr_data[String(counter)] = city.hourly[counter*6][this.selectedVar];
                    }
                    else {
                      curr_data[String(counter)] =
                          city.forecastInfo[this.selectedVar].hourlyForecast[counter*6];
                    }
                }
                data_for_table.push(curr_data);
            });
            return data_for_table;
        },
        forecast_fields: function () {
            var currentDate = new Date();
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
            return `${this.$t(this.selectedVar)} ${this.$t('in')} ${unit_map[this.selectedVar]}`
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
