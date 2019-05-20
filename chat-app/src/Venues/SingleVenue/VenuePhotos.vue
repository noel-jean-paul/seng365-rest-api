<template>
  <div id="venuePhotos" v-if="venue">
    <div v-if="venue.photos.length > 0">

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

        <PhotoUpload class="mt-2" @upload="$emit('upload')"/>

      </v-flex>
    </v-layout>

  </div>
  <div v-else>
    <h3> This venue has no photos </h3>
  </div>

  </div>
</template>

<script>
  import PhotoUpload from './PhotoUpload';

  export default {
    name: "VenuePhotos",

    props: {
      venue: Object
    },

    components: {
      PhotoUpload
    },

    methods: {
      go() {
        console.log("emitting");
        this.$emit('upload');
      }
    }
  }
</script>

<style scoped>

</style>
