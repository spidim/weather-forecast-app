<script>
import { Line, mixins } from 'vue-chartjs' // We specify what type of chart we want from vue-chartjs and the mixins module
const { reactiveProp } = mixins
import moment from 'moment'
import elLocale from 'moment/locale/el'

/*
  Inside the chartData prop, we may pass the following properties:

    Name        Type      Action 
    ---------------------------------------------------------------------
    title       string    sets the plot title
    variable    string    sets the plot y-axis label
    locale      string    converts x-axis dates according to given locale
*/

export default {
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
                            /*ticks: { // better left to be calculated automatically
                                //beginAtZero: true,
                                //stepSize: 1
                            },*/
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
                              unit: 'day',
                              parser: dt => { // change date locale
                                  moment.locale(this.chartData.locale)
                                  return dt
                              }
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
                title: {
                    display: this.chartData.title ? true : false,
                    text: this.chartData.title ? this.chartData.title : null,
                    fontSize: 14,
                    padding: 2
                },
                legend: {
                    display: false
                },
                responsive: true,
                maintainAspectRatio: false,
            }
        }
    },

    watch: {
        chartData () { // options are not reactive, so we use a watcher
            let newOptions = { ...this.options }
            newOptions.scales.yAxes[0].scaleLabel.labelString = this.chartData.variable // update y-axis variable label
            newOptions.title.text = this.chartData.title // update plot title
            this.renderChart(this.chartData, newOptions) // render anew
        }
    },

    mounted () {
        this.renderChart(this.chartData, this.options)
    }
}
</script>