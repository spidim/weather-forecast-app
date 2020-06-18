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
            <b-row>
                <b-col xl="12">
                    <Controls
                        v-on:selected_var="selectedVar = $event;"
                        :infoModalId="infoModalId"/>
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
                        <template v-slot:cell(city)="data">
                            <!-- click city name to load plot -->
                            <a href="" v-on:click="toggleShowPlot($event, data.value)">{{ data.value }}</a>
                        </template>
                    </b-table>
                </b-col>
            </b-row>
            <h4>Plot for {{ allCityData[selectedCity].name }}</h4>
            <LineChart v-if="showPlot" :chart-data="prepareDataset(endHours, selectedVar)"></LineChart>
        </b-container>
</div>
</template>

<script>
    import data from '../../data.json' // saved api responses [remove this import, only for development!!!]
    import {LIcon} from 'vue2-leaflet'
    import 'leaflet/dist/leaflet.css'
    import BackendApiHandler from '../utils/BackendApiHandler.js'
    import Controls from './Controls.vue';
    import Modal from './Modal.vue';
    import LineChart from './LineChart.vue';

    export default {
      name: 'Forecasts',
      data() {
        return {
          infoModalId: "infoModal1",
          selectedVar: 'temperature',
          allCityData: [],
          showPlot: true,
          selectedCity: 0,
          endHours: 48
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
              event.preventDefault();
              this.selectedCity = this.allCityData.findIndex(city => city.name === cityName);
              //this.showPlot = !this.showPlot;
          },
          prepareDataset: function (endHours, variable) {
          /* prepares dataset for plot */
              let labels = []
              let data = []

              this.allCityData[this.selectedCity].hourly.filter((entry, index) => {
                  if (index < endHours) { // pick time and selected variable measurements
                      labels.push(new Date(entry.dt*1000))
                      data.push(entry[variable])
                  }
              })

              return {
                  variable: variable, // pass selected variable with data
                  labels: labels,
                  datasets: [
                      {
                          fill: false,
                          tension: 0,
                          borderColor: "#80b6f4",
                          data: data
                      }
                  ]
              }
        }
    },
    computed: {
        forecast_items: function () {
            let data_for_table = [];
            this.allCityData.forEach(city => {
                var curr_data = {
                    "City" : city.name
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
            var fields= [
              {
                key: 'City',
                sortable: true
              }
            ];
            for (var counter=0;counter<7;counter++)
            {
                currentDate.setHours(currentDate.getHours() + 6)
                var new_label = {
                  key: String(counter+1),
                  sortable: false,
                  label: currentDate.toLocaleDateString("en-US",options)
                }
                fields.push(new_label);
            }
          return fields;
        },
        getTableTitle: function () {
            let unit_map = {
                "temperature" : "C",
                "pressure" : "hPa",
                "humidity" : "%",
            };
            return this.selectedVar+" in "+unit_map[this.selectedVar];
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
