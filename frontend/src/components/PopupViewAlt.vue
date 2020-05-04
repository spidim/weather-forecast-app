<!--
  Copyright (c) 2019

  Pop-up view

  @author Spiros Dimopoulos <sdimopoulos@irisweb.gr>
  @version 1.0
 -->

<template>
<div class="popup">
    <b-card no-body>
        <b-tabs pills>
            <b-tab no-body v-for="(forecastValue, forecastName, index) in forecast_vars" :title="$t(forecastName)">
                <b-container style="overflow: auto;">
                    <b-row>
                        <b-button-group size="sm" style="z-index: 1; position: fixed; top: 55px; left: 30px;" class="smooth slow"
                            v-bind:style="{opacity: showbuttons}"
                            @mouseenter="showbuttons = 1;"
                            @mouseleave="showbuttons = 0;"
                        >
                            <b-button variant="light" @click="zoom(0.2, index);"><strong>+</strong></b-button>
                            <b-button variant="light" @click="zoom(-0.2, index);"><strong>-</strong></b-button>
                            <b-button variant="light" @click="reset([index]);"><strong>&#8635;</strong></b-button>
                        </b-button-group>
                        <b-container class="p-0" style="overflow: auto;" v-bind:id="'container' + index">
                            <div class="zoomable smooth" v-bind:style="{transform: 'scale(' + zoomscale[index] + ')'}"
                                @wheel.prevent="$emit('wheel', $event, index)"
                            >
                                <b-card no-body class="border-0" v-bind:style="{cursor: dragging ? 'grab' : 'auto'}"
                                    :img-src="getImageUrl(forecastValue.hourlyGraphUrl)"
                                    @dragstart.prevent
                                    v-on:mousedown = "dragStart($event)"
                                    v-on:mouseup = "dragStop($event)"
                                    v-on:mousemove = "dragOn($event, index)"
                                >
                                </b-card>
                            </div>
                        </b-container>
                    </b-row>
                    <b-row>
                        <b-col md="3"/>
                        <b-col md="6" align="center">{{ name }}</b-col>
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

export default {
    props: ["forecast","name"],
    data: function() {
        return {
            zoomscale: [1.0, 1.0, 1.0], /* zoom scale for each tab container */
            dragcoord: [0, 0, 0, 0], /* start and end coordinations for dragging */
            dragging: false /* dragging state */,
            showbuttons: 0 /* zoom buttons opacity */
        }
    },

    methods: {
        zoom: function(amount, index) {
            /* increase zoomscale[index] by given amount */
            var val = this.zoomscale[index] + ((this.zoomscale[index] + amount >= 1.0) ? amount : 0);
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
        },
        getImageUrl(forecastV) {
            if (forecastV && forecastV !== "")
                return forecastV;
            else
                return require("../assets/no_data_plot.jpeg");

        }
    },
    computed:
    {
        forecast_vars: function() {
            let data_new = JSON.parse(JSON.stringify(this.forecast));
            delete data_new.overall;
            return data_new;
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
