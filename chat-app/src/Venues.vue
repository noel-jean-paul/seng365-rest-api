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
                  {{ venue.category }}
                </b-card-text>
              </b-card-body>
            </b-col>

            <b-col md="6">
              <b-card-img :src="getPhotoUrl(venue)"
                          class="rounded-0"
                          style="max-height: 200px;">
              </b-card-img>
            </b-col>

          </b-row>
        </b-card>

      </b-row>
    </b-container>
  </div>
</template>

<script>
	export default {
		name: "Venues",

    data() {
      return {
        error: "",
        errorFlag: false,
        venues: []
      }
    },

    mounted: function() {
      this.getVenues();
    },

    methods: {
		  getVenues: function() {
		    return this.axios.get(this.$baseUrl + '/venues')
          .then((res) => {
            this.venues = res.data;
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      },

      getPhotoUrl: function(venue) {
		    let venueId = venue.venueId;
		    let photoName = venue.primaryPhoto;
		    if (photoName === null) {
          photoName = 'default.png';
          venueId = '1';
        }

		    return this.$baseUrl + '/venues/' + venueId + '/photos/' + photoName;
      }
    }
	}
</script>

<style scoped>
  .custom-horizontal-card {
    max-width: 540px;
  }
</style>
