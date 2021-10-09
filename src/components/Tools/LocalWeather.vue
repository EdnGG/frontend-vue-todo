<template>
  <div class="text-subtitle-1 ml-4">
  {{weather.name}} - {{weather.sys.country}} - {{weather.weather[0].main}} - {{Math.round(weather.main.temp)}}°F
  
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
    data(){
        return {
        }
    },
    methods: {
        dateBuilder(){
            let d = new Date()
            let months = [
                "January", "February", "March", "April",
                "May", "June", "July", "August",
                "September", "Octuber", "November", "December",
            ]
            let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            let day = days[d.getDay()]
            let date = d.getDate()
            let month = months[d.getMonth()]
            let year = d.getFullYear()

            return `${day} ${date} ${month} ${year} `
        }
        
    },
    computed: {
        // ...mapState({
        //     getLocalWeather: state => state.weather.localWeather,
        // }),
        ...mapState(['weather']),
        
    },
    mounted() {
    },
    created(){
    this.$store.dispatch('getLocalWeather')
    // console.log('Weather: ', this.weather);
  },
}
</script>

<style>

</style>