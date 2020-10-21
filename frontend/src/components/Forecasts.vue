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
                <ForecastsTable v-if="allCityData && allCityData.length"
                    :forecastData="allCityData"
                    :tableItems="forecastItems"
                    :tableFields="forecastFields"
                    :selectedRow="selectedCity"
                    :sortBy="tableSortBy"
                    :sortDesc="tableSorted"
                    :tableStyle="tableStyle"
                    @selectedRowUpdate="(index, value) => { $emit('selectedRowUpdate', index, value) }"
                    @sortingChanged="value => { $emit('sortingChanged', value) }"
                    ref="table"
                />
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
                    <b-button-close @click="selectedCity = -1;" />
                </b-col>
            </b-row>
            <LineChart :chart-data="preparePlotData(endHours, selectedVar)" />
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
import ForecastsTable from './ForecastsTable.vue'

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
          endHours: 48, // timeline duration in hours for plot
          tableSortBy: null, // field name to sort forecasts table by
          tableSorted: null, // forecasts table is sorted (null: no, true: desc, false: asc)
          tableStyle: { height: '70vh' } // table css styling
      }
  },

  components: {
      Controls,
      Modal,
      LineChart,
      ForecastsTable
  },

  methods: {
      findCityIndex (cityName) {
      /* find city index */
          return this.allCityData.findIndex(city =>
              (
                  city.translatedName === cityName
              )
          )
      },

      preparePlotData: function (endHours, variable) {
      /* prepares dataset for plot */
          let chartdata = this.chartData[this.selectedCity].variables[this.selectedVar] // get selected variable measurements
          delete chartdata.title // remove plot title
          chartdata = {...chartdata, labels: chartdata.labels.slice(0, endHours)} // x-axis points for endHours hours

          return chartdata
      },

      findSelectedCityIndexSorted() {
      /* return selected city index in sorted names table */
          return this.sortedCityNames.findIndex(name => name === this.allCityData[this.selectedCity].translatedName);
      }
  },

  computed: {
      forecastItems: function () {
      /* prepares table rows */
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
      /* prepares table fields (i.e. column names) */
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

      sortedCityNames() {
      /* sorted city names according to locale */
          return this.allCityData.map(row => row.translatedName).sort(
              (a, b) => {
                  if(this.tableSorted)
                      return b >= a;
                  else
                      return b < a;
              }
          );
      },

      ...mapGetters({
          allCityData: 'allCityData/getAllCityData'
      }),

      ...mapGetters({
          chartData: 'chartData/getChartData'
      }),

      ...mapGetters({
          locale: 'locale/getLocale'
      })
  },

  watch: {
      selectedCity(newValue, oldValue) {
          this.tableStyle.height = newValue === -1 ? '70vh' : '25vh';
          
          if (newValue === -1) { // plot is closed
              this.$refs.table.scrollToRow(0);
          }
          else if (oldValue === -1) { // plot is opened
              if (this.tableSorted === null) {
                  this.$refs.table.scrollToRow(newValue); // scroll to index directly
              }
              else {
                  this.$refs.table.scrollToRow(this.findSelectedCityIndexSorted());
              }
          }
      },

      tableSorted(newValue, oldValue) {
          if(this.selectedCity !== -1) { // scroll sorted table to follow selected city
              this.$refs.table.scrollToRow(this.findSelectedCityIndexSorted());
          }
          if(newValue === null) { // scroll unsorted table to follow selected city
              this.$refs.table.scrollToRow(this.selectedCity);
          }
      },

      locale() {
          if(this.tableSortBy) {
              this.tableSortBy = this.$t('city'); // translate sort key
              if(this.selectedCity !== -1) {
                  this.$refs.table.scrollToRow(this.findSelectedCityIndexSorted()); // scroll table to correct selected city row when table is sorted
              }
          }
      }
  },
  
  created() {
      console.log('Load our data first');
      this.$store.dispatch('allCityData/setAllCityDataAsync');
      this.$on('selectedRowUpdate', (index, value) => { this.selectedCity = this.findCityIndex(value); });
      this.$on('sortingChanged', ({ sortBy, sortDesc }) => {
          this.tableSortBy = sortBy;
          this.tableSorted = sortDesc;
      });
  }
}
</script>