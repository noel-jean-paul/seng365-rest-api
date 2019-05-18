<template>
  <div id='venue'>

    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>

  <b-card>

    <b-card-body>
      <b-card-title>{{ venue.venueName }}</b-card-title>
      <b-card-sub-title class="mb-4">{{ venue.category.categoryName }}</b-card-sub-title>
    </b-card-body>

    <b-list-group flush>
      <b-list-group-item><InfoRow title="Admin:"> {{ venue.admin.username }}</InfoRow></b-list-group-item>
      <b-list-group-item><InfoRow title="City:"> {{ venue.city }}</InfoRow></b-list-group-item>
      <b-list-group-item><InfoRow title="Adress:"> {{ venue.address }}</InfoRow></b-list-group-item>
      <b-list-group-item><InfoRow title="Added:"> {{ venue.dateAdded }}</InfoRow></b-list-group-item>
    </b-list-group>

    <b-card-body>
      <b-card-text>
        {{ venue.shortDescription}}
        <div v-if="venue.longDescription !== ''">
          <b-link @click="showCollapse = !showCollapse">{{ showCollapse ? 'show less' : 'show more' }}</b-link>
          <b-collapse v-model="showCollapse" class="mt-2">
            <b-card-text>{{ venue.longDescription }}</b-card-text>
          </b-collapse>
        </div>
      </b-card-text>

      <Ratings :venue="venue"/>

    </b-card-body>

  </b-card>

  </div>

</template>

<script>
  import InfoRow from '../display/InfoRow.vue'
  import Ratings from './Ratings.vue';

  export default {
    name: "Venue",

    components: {
      InfoRow,
      Ratings
    },

    data() {
      return {
        venue: null,
        showCollapse: false,
        error: '',
        errorFlag: false
      }
    },

    mounted() {
      this.getVenueData()
        .then(() => {
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

            console.log('venues', venues);
            console.log('venue', singleVenue);

            for (const venue of venues) {
              const id = venue.venueId.toString();
              const routeId = this.$route.params.venueId;
              if (id === routeId) {
                singleVenue = { ...venue, ...singleVenue};
                break;
              }
            }

            this.venue = singleVenue;
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
