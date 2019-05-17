<template>
  <b-card no-body class="overflow-hidden custom-horizontal-card">
    <b-row no-gutters>

      <b-col md="7">
        <b-card-body :title="venue.venueName">
          <b-card-text>
            {{ venue.categoryName }}
          </b-card-text>

          <b-container>
            <b-row>
              <b-col class="center-vert" xs="2">
                Quality:
              </b-col>
              <b-col  xs="10">
                <star-rating v-model="venue.meanStarRating"
                             read-only
                             :increment="0.01"
                             class="pt-3"
                             :star-size="30"

                >
                </star-rating>
              </b-col>
            </b-row>

            <b-row>
              <b-col class="center-vert" xs="2">
                Cost:
              </b-col>
              <b-col  xs="10">
                <star-rating v-model="venue.modeCostRating"
                             read-only
                             :increment="0.01"
                             class="pt-3"
                             :star-size="30"
                             active-color="orange"
                >
                </star-rating>
              </b-col>
            </b-row>
          </b-container>
        </b-card-body>
      </b-col>

      <b-col md="5">
        <b-card-img :src="getPhotoUrl(venue)"
                    class="rounded-0"
                    style="max-height: 200px;"
                    :alt="venue.venueName"
        >
        </b-card-img>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
  import StarRating from 'vue-star-rating';

	export default {
		name: "VenueCard",

    components: {
		  StarRating
    },

    props: [
      'venue',
    ],

    methods: {
      getPhotoUrl: function (venue) {
        if (venue.primaryPhoto !== null) {
          return this.$baseUrl + '/venues/' + venue.venueId + '/photos/' + venue.primaryPhoto;
        } else {
          return require('../assets/default.png');
        }
      }
    }
	}
</script>

<style scoped>
  .custom-horizontal-card {
    max-width: 650px;
  }

  .center-vert {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
</style>
