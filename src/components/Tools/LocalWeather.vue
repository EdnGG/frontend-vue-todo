<template>
  <div class="text-subtitle-1 ml-4">
  {{weather.sys.country}} - {{weather.name}} - {{weather.weather[0].main}} - {{ Math.round(weather.main.temp) }}°C
  
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

import { format } from 'date-fns'
export default {
    data(){
        return {
            date: '',
        }
    },
    methods: {
        getDate() {
            this.date = format(new Date(), 'MMMM d, H:mm:ss')
            setTimeout(this.getDate, 1000)
        }
    },
    computed: {
        // ...mapState({
        //     getLocalWeather: state => state.weather.localWeather,
        // }),
        ...mapState([
            'weather',
        ]),
        ...mapGetters({
            getWeather: 'getWeather',
        }),
    },
    mounted() {
        this.getDate()
    },
    created(){
    this.$store.dispatch('getLocalWeather')
    // console.log('Weather: ', this.weather);
  },
}
</script>

<style>

</style>