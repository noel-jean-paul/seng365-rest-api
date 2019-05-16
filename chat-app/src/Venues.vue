<template>
  <div>
    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>

    <b-container>
      <b-row v-for="venue of venues" class="mt-3">

        <b-card no-body class="overflow-hidden custom-horizontal-card">
          <b-row no-gutters>

            <b-col md="6">
              <b-card-body :title="venue.venueName">
                <b-card-text>
                  {{ venue.categoryName }}
                </b-card-text>

                <star-rating v-model="venue.meanStarRating"
                             read-only
                             :increment="0.01"
                             class="pt-3"
                             :star-size="30">

                </star-rating>
              </b-card-body>
            </b-col>

            <b-col md="6">
              <b-card-img :src="getPhotoUrl(venue)"
                          class="rounded-0"
                          style="max-height: 200px;"
                          :alt="venue.venueName"
              >
              </b-card-img>
            </b-col>

          </b-row>
        </b-card>

      </b-row>
    </b-container>
  </div>
</template>

<script>
  import StarRating from 'vue-star-rating';

  export default {
    name: "Venues",

    components: {
      StarRating
    },

    data() {
      return {
        error: "",
        errorFlag: false,
        venues: []
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

      getPhotoUrl: function(venue) {
        if (venue.primaryPhoto !== null) {
          return this.$baseUrl + '/venues/' + venue.venueId + '/photos/' + venue.primaryPhoto;
        } else {
          return require('./assets/default.png');
        }


      }
    }
  }
</script>

<style scoped>
  .custom-horizontal-card {
    max-width: 540px;
  }
</style>
