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
                    <div style="cursor: pointer" @click="() => onPhotoClick(photo)">
                      <v-img
                        :src="$baseUrl + '/venues/' + venue.venueId + '/photos/' +
              photo.photoFilename"
                        :alt="photo.photoDescription"
                        aspect-ratio="1"
                        :class="{'border border-primary': photo.isPrimary, 'border-3': true}"
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
                    </div>
                  </v-card>

                  <b-modal v-model="showPhotoModal">
                    <b-container>
                      <v-img :src="$baseUrl + '/venues/' + venue.venueId + '/photos/' +
              photo.photoFilename"
                             :alt="photo.photoDescription"/>

                    </b-container>
                  </b-modal>

                </v-flex>
              </v-layout>

            </v-container>

          </v-card>

          <PhotoUpload class="mt-2" @upload="$emit('upload')" :hasPhotos="venue.photos.length > 0"/>

        </v-flex>
      </v-layout>

    </div>
    <div v-else>
      <h3> This venue has no photos </h3>
      <PhotoUpload class="mt-2" @upload="$emit('upload')" :hasPhotos="venue.photos.length > 0"/>
    </div>

  </div>


</template>

<script>
  import PhotoUpload from './PhotoUpload';

  export default {
    name: "VenuePhotos",

    data() {
      return {
        showPhotoModal: false
      }
    },

    props: {
      venue: Object
    },

    components: {
      PhotoUpload
    },

    methods: {
      onPhotoClick(photo) {
        console.log('clicky click click');
        this.showPhotoModal = true;
      }
    }
  }
</script>

<style scoped>
  .border-3 {
    border-width:5px !important;
  }

</style>
