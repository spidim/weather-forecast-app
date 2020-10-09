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
            <b-col class="p-3">{{ tableTitle }}</b-col>
        </b-row>
        <b-row md="12" class="mt-4">
            <b-col>
                <!-- forecasts table renders only if allCityData is populated -->
                <b-table v-if="allCityData && allCityData.length"
                    striped hover borderless sticky-header
                    :style="{height: (selectedCity !== -1 ? '25vh' : '70vh')}"
                    small head-variant="light"
                    :items="forecastItems"
                    :fields="forecastFields"
                    id="table"
                >
                    <template v-slot:[translateTableKey()]="data">
                        <!-- clickable city name to load plot -->
                        <a href="" v-on:click.prevent="selectedCity === -1 && scrollToRow(data.index); toggleShowPlot(data.value);">
                            <!-- no city selected, render all without formatting -->
                            <span v-if="selectedCity === -1">
                                {{data.value}}
                            </span>
                            <!-- city selected, make selected city name bold -->
                            <strong v-else-if="data.value === allCityData[selectedCity].name ||
                                ElToEnCityName(data.value) === allCityData[selectedCity].name"
                            >
                                {{ data.value }}
                            </strong>
                            <!-- city selected, render not selected city names without formatting -->
                            <span v-else>
                                {{data.value}}
                            </span>
                        </a>
                    </template>
                </b-table>
                <!-- otherwise display no forecasts message -->
                <h3 v-else>{{ $t('no forecasts') }}</h3>
            </b-col>
        </b-row>
        <!-- plot renders only if a city is selected -->
        <b-container v-if="selectedCity !== -1">
            <b-row class="text-center">
                <b-col>
                    <!-- plot timeline duration control -->
                    <b-form-spinbutton id="endHours" :value="endHours" min="1" max="48" size="sm" inline @change="endHours = $event"
                    />
                    <span>{{ $t('hours') }}</span>
                </b-col>
                <b-col cols="8">
                    <h4>
                        {{ $t('plot for') }} {{ $t( allCityData[selectedCity].name.toLowerCase() ) }}
                    </h4>
                </b-col>
                <b-col>
                    <!-- container close button -->
                    <b-button-close @click="selectedCity = -1; scrollToRow(0);" />
                </b-col>
            </b-row>
            <LineChart :chart-data="prepareDataset(endHours, selectedVar)" />
        </b-container>
    </b-container>
</div>
</template>

<script>
import Controls from './Controls.vue'
import Modal from './Modal.vue'
import LineChart from './LineChart.vue'
import { ElToEnCityName } from '../lang/cityName' // used to translate greek city names back to english
import { mapGetters } from 'vuex'

export default {
  name: 'Forecasts',
  
  mixins: [{
      methods: { ElToEnCityName }
  }],

  data() {
      return {
          infoModalId: "infoModal1",
          selectedVar: 'temperature',
          selectedCity: -1, // index of city in allCityData
          endHours: 48 // timeline duration in hours for plot
      }
  },

  components: {
      Controls,
      Modal,
      LineChart
  },

  methods: {
      toggleShowPlot (cityName) {
      /* load plot for cityName */
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
          let chartdata = this.chartData[this.selectedCity].variables[this.selectedVar] // get selected variable measurements
          delete chartdata.title // remove plot title
          chartdata = {...chartdata, labels: chartdata.labels.slice(0, endHours)} // x-axis points for endHours hours

          return chartdata
      },
      translateTableKey() { // to overcome dynamic argument expression constraints (https://vuejs.org/v2/guide/syntax.html#Dynamic-Argument-Expression-Constraints)
          // tried passing an argument to the function too, it works but gives a warning
          return `cell(${this.$t('city')})`;
      },
      scrollToRow(index) {
          let table = this.$el.querySelector("#table");
          table.parentElement.style.height = this.selectedCity === -1 ? '25vh' : '70vh'; // must find way to get updated height
          table.parentElement.scrollTop = table.rows[0].clientHeight * index + table.tHead.clientHeight < table.parentElement.clientHeight ? 0 : table.rows[0].clientHeight * index;
      }
  },

  computed: {
      forecastItems: function () {
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
      forecastFields: function () {
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
      tableTitle: function () {
          let unit_map = {
              "temperature" : "\u2103",
              "pressure" : "hPa",
              "humidity" : "%",
          };
          return `${this.$t(this.selectedVar)} ${this.$t('in')} ${unit_map[this.selectedVar]}`;
      },
      ...mapGetters({
          allCityData: 'allCityData/getAllCityData'
      }),
      ...mapGetters({
          chartData: 'chartData/getChartData'
      })
  },
  
  created() {
      console.log('Load our data first');
      this.$store.dispatch('allCityData/setAllCityDataAsync');
  }
}
</script>