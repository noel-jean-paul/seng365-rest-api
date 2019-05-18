<template>
  <b-card no-body class="overflow-hidden custom-horizontal-card">
    <b-row no-gutters>

      <b-col md="7">
        <b-card-body :title="venue.venueName">
          <b-card-text>
            {{ venue.categoryName }}
          </b-card-text>

          <b-container>
            <Ratings :venue="venue"></Ratings>

            <b-row>
              <b-button variant="info" v-on:click="onDetailsClick"> Details </b-button>
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
  import Ratings from './Ratings.vue';

  export default {
    name: "VenueCard",

    components: {
      Ratings
    },

    props: {
      venue: Object,
    },

    methods: {
      getPhotoUrl: function(venue) {
        if (venue.primaryPhoto !== null) {
          return this.$baseUrl + '/venues/' + venue.venueId + '/photos/' + venue.primaryPhoto;
        } else {
          return require('../assets/default.png');
        }
      },

      onDetailsClick: function() {
        this.$router.push({ name: 'venue', params: { venueId: this.venue.venueId } });
      }
    }
  }
</script>

<style scoped>
  .custom-horizontal-card {
    max-width: 650px;
  }
</style>
