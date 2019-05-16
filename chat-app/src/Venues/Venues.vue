<template>
  <div>
    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>

    <b-container>
      <b-row>
        <b-col cols="2">

          <div class="mt-4">
          <b-form-group label="City">
            <b-form-radio v-for="city of cities" v-model="selectedCity" :value="city">{{ city }}</b-form-radio>
          </b-form-group>

          <div class="mt-3">Selected: <strong>city1</strong></div>
          </div>

        </b-col>

        <b-col cols="10">
          <b-row v-for="venue of venues" class="mt-3">
            <VenueCard :venue="venue"> </VenueCard>
          </b-row>
        </b-col>

      </b-row>
    </b-container>
  </div>
</template>

<script>
  import VenueCard from './VenueCard';

  export default {
    name: "Venues",

    components: {
      VenueCard
    },

    data() {
      return {
        error: '',
        errorFlag: false,
        venues: [],
        cities: new Set(),
        selectedCity: ''
      }
    },

    mounted: function() {
      this.getVenueData();
    },

    methods: {
      getVenueData: function() {
        return Promise.all([
          this.getVenues(),
          this.getCategories()
        ])
          .then((result) => {
            let venues = result[0];
            const categories = result[1];

            // setup data
            for (const venue of venues) {
              this.cities.add(venue.city);
              for (const category of categories) {
                if (venue.categoryId === category.categoryId) {
                  venue.categoryName = category.categoryName;
                }
              }
            }

            this.venues = venues;   // replace array to trigger dom update
          });
      },

      getVenues: function() {
        return this.axios.get(this.$baseUrl + '/venues')
          .then((res) => {
            return res.data;
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },

      getCategories: function() {
        return this.axios.get(this.$baseUrl + '/categories')
          .then((res) => {
            return res.data;
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },
    }
  }
</script>

<style scoped>

</style>
