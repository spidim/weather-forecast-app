<template>
<div class="popup">
    <b-card no-body>
        <b-tabs pills>
        	<b-tab no-body v-for="(variable, index) in forecastVariables" :title="$t(variable)" :key="index">
        		<b-container style="overflow: auto;">
        			<b-row class="p-0">
                        <b-col md="12" class="p-0 m-0 b-0"
                            align="center" style="height: 275px; overflow: auto;"
                        >
                            <!-- render plot only if popup is active -->
                            <LineChart
                                v-if="active"
                                :styles="{height: '100%', width: '100%'}"
                                :chart-data="chartData.variables[variable]"
                            >        
                            </LineChart>
                        </b-col>
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
    props: [
        "chartData", // city forecast data
        "active"    // popup active flag
    ],

    components: {
        LineChart
    },

    computed: {
        forecastVariables: function() {
        /* returns a list of plot variables */
            return Object.keys(this.chartData.variables)
        }
    }
};
</script>

<style>
.popup {
    width: 345px;
}
</style>