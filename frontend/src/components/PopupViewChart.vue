<template>
<div class="popup">
    <b-card no-body>
        <b-tabs pills>
        	<b-tab no-body v-for="(variable, index) in forecastVariables" :title="$t(variable)" :key="index">
        		<b-container style="overflow: auto;">
        			<b-row class="p-0">
                        <!--b-container class="p-0"-->
                        <b-col md="12" class="p-0 m-0 b-0"
                            align="center" style="height: 275px; width: 275px; overflow: auto;"
                        >
                            <LineChart
                                :styles="{height: '100%', width: '100%'}"
                                :chart-data="chartData[index]"    
                            >        
                            </LineChart>
                        </b-col>
                        <!--/b-container-->
                    </b-row>
                    <b-row>
                        <b-col md="3"/>
                        <b-col md="6" align="center">{{ $t(cityData.name.toLowerCase()) }}</b-col>
                        <b-col md="3"/>
                    </b-row>
        		</b-container>
        	</b-tab>
        </b-tabs>
    </b-card>
</div>
</template>

<script type = "text/javascript">
import Vue from 'vue'
import LineChart from './LineChart.vue'

export default {
    props: ["cityData"],

    components: {
        LineChart
    },

    data: function() {
        return {
            chartData: []
        }
    },

    methods: {
        prepareDataset: function (endHours, variable) {
        /* prepares dataset for plot */
            if (this.cityData) {
                let labels = [];
                let data = [];
                let dt = Date.now();

                this.cityData.forecastInfo[variable].hourlyForecast.filter((entry, index) => {
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
                                ? this.$t(this.cityData.name.toLowerCase())
                                : this.cityData.name,
                            data: data
                        }
                    ]
                }
            }
            else {
                return {}
            }
        }
    },
    computed:
    {
        forecastVariables: function() {
            let variables = this.cityData.forecastInfo
            delete variables.overall
            return Object.keys(variables)
        }
    },
    created() {
        this.forecastVariables.forEach((variable, index) => {
            this.chartData = [...this.chartData, this.prepareDataset(48, variable)]
        })
    }
};
</script>

<style>
.popup {
    width: 345px;
}
</style>