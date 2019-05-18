<template>
  <div id='venue' v-if="venue != null">

    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>

    <b-container>
      <b-row>
        <b-col cols="6">
          <VenueDetails :venue="venue" class="mt-4"/>
        </b-col>

        <b-col cols="6">
          <VenuePhotos :venue="venue" class="mt-4"/>
        </b-col>
      </b-row>
    </b-container>

  </div>

</template>

<script>
  import VenueDetails from './VenueDetails';
  import VenuePhotos from './VenuePhotos';

  export default {
    name: "Venue",

    components: {
      VenueDetails,
      VenuePhotos
    },

    data() {
      return {
        venue: null,
        error: '',
        errorFlag: false
      }
    },

    mounted() {
      return this.getVenueData()
        .then((venue) => {
          this.venue = venue;
        })
    },

    methods: {
      getVenueData() {
        return Promise.all([
          this.getAllVenues(),
          this.getVenue()
        ])
          .then((result) =>{
            const venues = result[0];
            let singleVenue = result[1];

            for (const venue of venues) {
              const id = venue.venueId.toString();
              const routeId = this.$route.params.venueId;
              if (id === routeId) {
                singleVenue = { ...venue, ...singleVenue};
                break;
              }
            }

            return singleVenue;
          });
      },

      getAllVenues() {
        return this.axios.get(`${this.$baseUrl}/venues`)
          .then((res) => {
            return res.data;
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },

      getVenue() {
        return this.axios.get(this.$baseUrl + '/venues/' + this.$route.params.venueId)
          .then((res) => {
            return res.data;
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      }
    }
  }
</script>

<style scoped>

</style>
