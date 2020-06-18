<script>
import { Line, mixins } from 'vue-chartjs' // We specify what type of chart we want from vue-chartjs and the mixins module
const { reactiveProp } = mixins

export default { //We are extending the base chart class as mentioned above
    extends: Line,
    mixins: [reactiveProp],

    data () {
        return {
            options: {
                scales: { // axes
                    yAxes: [
                        { // variable (temperature pressure etc.) axis
                            scaleLabel: {
                                display: true,
                                labelString: this.chartData.variable
                            },
                            ticks: { // better left to be calculated automatically
                                //beginAtZero: true,
                                //stepSize: (Math.max(...this.chartData.datasets.data) - Math.min(...this.chartData.datasets.data))/100
                            },
                            gridLines: {
                                display: true
                            }
                        }
                    ],
                    xAxes: [
                        { // hour axis
                            type: 'time',
                            time: {
                                unit: 'hour',
                                displayFormats: {
                                    hour: 'HH:mm'
                                }
                            },
                            gridLines: {
                                display: false
                            }
                      },
                      { // date axis
                          type: 'time',
                          time: {
                              unit: 'day'
                          },
                          ticks: {
                              fontStyle: 'bold'
                          },
                          gridLines: {
                              zeroLineColor: 'rgba(0, 0, 0, 0.1)'
                          }
                      }
                  ]
                },
                legend: {
                    display: false
                },
                responsive: true,
                maintainAspectRatio: false
            }
        }
    },

    watch: {
        chartData () { // options are not reactive, so we use a watcher
            let newOptions = { ...this.options }
            newOptions.scales.yAxes[0].scaleLabel.labelString = this.chartData.variable // update y-axis variable label
            this.renderChart(this.chartData, newOptions) // render anew
        }
    },

    mounted () {
        this.renderChart(this.chartData, this.options)
    }
}
</script>