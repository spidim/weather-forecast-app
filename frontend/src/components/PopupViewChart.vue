<template>
<div class="popup">
    <b-card no-body>
        <b-tabs pills>
            <b-tab no-body v-for="(variable, index) in forecastVariables" :title="$t(variable)" :key="index">
                <b-container style="overflow: auto;">
                    <b-row class="p-0">
                        <b-col md="12" class="p-0 m-0 b-0"
                            align="center"
                            style="height: 275px; overflow: auto;"
                            v-bind:id="'container' + index"
                            @wheel.prevent="$emit('wheel', $event, index)"
                            @dragstart.prevent
                            v-on:mousedown = "dragStart($event)"
                            v-on:mouseup = "dragStop($event)"
                            v-on:mousemove = "dragOn($event, index)"
                        >
                            <b-button-group size="sm" style="z-index: 1; position: fixed; top: 55px; left: 30px;" class="smooth slow"
                                v-bind:style="{opacity: showbuttons}"
                                @mouseenter="showbuttons = 1;"
                                @mouseleave="showbuttons = 0;"
                            >
                                <b-button variant="light" @click="zoom(0.2, index);"><strong>+</strong></b-button>
                                <b-button variant="light" @click="zoom(-0.2, index);"><strong>-</strong></b-button>
                                <b-button variant="light" @click="reset([index]);"><strong>&#8635;</strong></b-button>
                            </b-button-group>
                            <!-- render plot only if popup is active -->
                            <LineChart
                                v-if="active"
                                :styles="{height: '100%', width: '100%'}"
                                :chart-data="chartData.variables[variable]"
                                :scale="zoomscale[index]"
                                class="zoomable smooth"
                                v-bind:style="{
                                    transform: 'scale(' + zoomscale[index] + ')',
                                    cursor: dragging ? 'grab' : 'auto'
                                }"    
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

    data: function() {
        return {
            zoomscale: [1.0, 1.0, 1.0], /* zoom scale for each tab container */
            dragcoord: [0, 0, 0, 0], /* start and end coordinations for dragging */
            dragging: false, /* dragging state */
            showbuttons: 0, /* zoom buttons opacity */
        }
    },

    computed: {
        forecastVariables: function() {
        /* returns a list of plot variables */
            return Object.keys(this.chartData.variables)
        }
    },

    methods: {
        zoom: function(amount, index) {
            /* increase zoomscale[index] by given amount */
            let val = Math.round((this.zoomscale[index] + amount + Number.EPSILON) * 100) / 100; // https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
            val = val >= 1.0 ? val : 1.0;
            Vue.set(this.zoomscale, index, val);
        },

        reset: function(index) {
            /* set zoom scale to 1.0 for given indices */
            index.forEach(i => Vue.set(this.zoomscale, i, 1.0));
            this.dragging = false;
        },

        dragStart: function(event) {
            /* set dragging on and save initial mouse coordinations */
            if(event.which == 1){ /* only on left click */
                this.dragging = true;
                Vue.set(this.dragcoord, 0, event.layerX);
                Vue.set(this.dragcoord, 1, event.layerY);
            }
        },

        dragOn: function(event, index) {
            /* update coordinations while dragging and scroll image */
            if(this.dragging && event.buttons && event.which == 1) { /* check left click and within element bounds */
                Vue.set(this.dragcoord, 2, event.layerX);
                Vue.set(this.dragcoord, 3, event.layerY);
                var container = this.$el.querySelector("#container" + index);
                container.scrollLeft -= this.dragcoord[2] - this.dragcoord[0];
                container.scrollTop -= this.dragcoord[3] - this.dragcoord[1];
            }
        },

        dragStop:function(event) {
            /* stops dragging action */
            if(event.which == 1)
                this.dragging = false;
        }
    },

    mounted() {
        /* listen to wheel events for zooming */
        this.$on('wheel', (event, index) => { this.zoom(Math.sign(-event.deltaY)*0.2, index); });
    }
};
</script>

<style>
.popup {
    width: 345px;
}

.zoomable {
    position: static;
    transform-origin: 0 0;
}

.smooth {
    transition: all;
    transition-duration: 0.05s;
    transition-timing-function: ease-in;
}

.smooth.slow {
    transition-duration: 0.3s;
}
</style>