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
              <b-form-radio v-for="city of cities"
                            v-model="selectedCity"
                            :value="city"
                            :key="city"
                            v-on:change="onCityChange"
                            >
                {{ city }}
                </b-form-radio>
            </b-form-group>

            <b-form-checkbox v-model="adminOnly"
                             v-on:change="onAdminChange"
                             v-if="$cookies.isKey('token')"
            >
              Show only my venues
            </b-form-checkbox>
          </div>

          <CreateVenue class="mt-4"/>

        </b-col>

        <b-col cols="10">
          <b-row v-for="venue of venues" class="mt-3" :key="venue.venue_id">
            <VenueCard :venue="venue"> </VenueCard>
          </b-row>
        </b-col>

      </b-row>
    </b-container>
  </div>
</template>

<script>
  import VenueCard from './VenueCard';
  import CreateVenue from './CreateVenue';
  import authUtils from '../utils/authUtils';

  export default {
    name: "Venues",

    components: {
      VenueCard,
      CreateVenue
    },

    data() {
      return {
        error: '',
        errorFlag: false,
        venues: [],
        cities: ['All cities'],
        selectedCity: 'All cities',
        adminOnly: false
      }
    },

    mounted: function() {
      Promise.all([
        this.getVenueData(),
        this.getCities()
      ]);
    },

    methods: {
      getVenueData: function(city) {
        return Promise.all([
          this.getVenues(city),
          this.getCategories()
        ])
          .then((result) => {
            let venues = result[0];
            const categories = result[1];

            // setup data
            for (const venue of venues) {
              for (const category of categories) {
                if (venue.categoryId === category.categoryId) {
                  venue.categoryName = category.categoryName;
                }
              }
            }

            this.venues = venues;   // replace array to trigger dom update
          });
      },

      getVenues: function(city) {
        let params = '?';
        if (city !== undefined && city !== "All cities") {
          params += `city=${city}&`;
        }

        if (this.adminOnly) {
          params += `adminId=${authUtils.getAuthedUserId(this)}`;
        }

        return this.axios.get(`${this.$baseUrl}/venues${params}`)
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

      getCities: function() {
        // how to deeep copy JSON.parse(JSON.stringify(this.cities))

        return this.getVenues()
          .then((venues) => {
            let tmpCities = [].concat(this.cities);

            for (const venue of venues) {
              if (!tmpCities.includes(venue.city)) {
                tmpCities.push(venue.city);
              }
            }

            this.cities = tmpCities;
          })
      },

      onCityChange: function(selected) {
        this.getVenueData(selected)
          .then(() => {
            this.selectedCity = selected;
          });
      },

      onAdminChange: function(checked) {
        this.adminOnly = checked;
        this.getVenueData(this.selectedCity)
      }
    }
  }
</script>

<style scoped>

</style>
