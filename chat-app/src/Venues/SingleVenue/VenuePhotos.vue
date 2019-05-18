<template>
  <div id="venuePhotos" v-if="venue != null && venue.venueId !== undefined">
    <v-layout>
      <v-flex offset-sm3>
        <v-card>
          <v-container grid-list-sm fluid>
            <v-layout row wrap>
              <v-flex
                v-for="(photo, index) of venue.photos"
                :key="index"
                xs4
                d-flex
              >
                <v-card flat tile class="d-flex">
                  <v-img
                    :src="$baseUrl + '/venues/' + venue.venueId + '/photos/' +
              photo.photoFilename"
                    :alt="photo.photoDescription"
                    aspect-ratio="1"
                    class="grey lighten-2"
                  >
                    <template v-slot:placeholder>
                      <v-layout
                        fill-height
                        align-center
                        justify-center
                        ma-0
                      >
                        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                      </v-layout>
                    </template>
                  </v-img>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>

  </div>
</template>

<script>
  export default {
    name: "VenuePhotos",

    props: {
      venue: Object
    }
  }
</script>

<style scoped>

</style>
