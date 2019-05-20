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
                    <div style="cursor: pointer" @click="onPhotoClick(photo)">
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

                </v-flex>
              </v-layout>

            </v-container>

          </v-card>

          <PhotoUpload v-if="isAdmin"
                       class="mt-2"
                       @upload="$emit('reload-required')"
                       :hasPhotos="venue.photos.length > 0"
          />

        </v-flex>
      </v-layout>

    </div>
    <div v-else>
      <h3> This venue has no photos </h3>
      <PhotoUpload v-if="isAdmin"
                   class="mt-2"
                   @upload="$emit('reload-required')"
                   :hasPhotos="venue.photos.length > 0"
      />
    </div>

    <b-modal v-model="showPhotoModal" v-if="showPhotoModal">
      <b-container>
        <v-img :src="$baseUrl + '/venues/' + venue.venueId + '/photos/' +
              modalPhoto.photoFilename"
               :alt="modalPhoto.photoDescription"/>

      </b-container>

      <div slot="modal-footer">
        <div v-if="isAdmin">
          <b-button variant="primary"
                    @click="makePrimary"
                    :disabled="modalPhoto.isPrimary"
          > Make primary </b-button>
          <b-button variant="danger"
                    @click="deletePhoto"
          > Delete </b-button>
        </div>
      </div>
    </b-modal>

  </div>


</template>

<script>
  import PhotoUpload from './PhotoUpload';
  import authUtils from '../../utils/authUtils.js';

  export default {
    name: "VenuePhotos",

    data() {
      return {
        showPhotoModal: false,
        modalPhoto: null
      }
    },

    props: {
      venue: Object,
      isAdmin: Boolean
    },

    components: {
      PhotoUpload
    },

    methods: {
      onPhotoClick(photo) {
        this.showPhotoModal = true;
        this.modalPhoto = photo;
      },

      makePrimary() {
        const url = `${this.$baseUrl}/venues/${this.venue.venueId}/photos/` +
          `${this.modalPhoto.photoFilename}/setPrimary`;

        this.axios({
          method:'post',
          url: url,
          headers: {
            'X-Authorization': authUtils.getCookie(this)
          }
        })
          .then(() => {
            // Reload data from venues
            this.$emit('reload-required');
          })
          .catch((error) => {
            console.log(error);
          })
      },

      deletePhoto() {
        this.$bvModal.msgBoxConfirm('Delete photo?', {
          size: 'md',
          buttonSize: 'md',
          okVariant: 'danger',
          okTitle: 'Delete',
          cancelTitle: 'Cancel',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
          .then(value => {
            if (value) {
              const url = `${this.$baseUrl}/venues/${this.venue.venueId}/photos/` +
                `${this.modalPhoto.photoFilename}`;

              return this.axios({
                method: 'delete',
                url: url,
                headers: {
                  'X-Authorization': authUtils.getCookie(this)
                }
              })
                .then(() => {
                  this.$emit('reload-required');
                  this.showPhotoModal = false;
                  this.modalPhoto = null;
                })
            }
          })

      }
    }
  }
</script>

<style scoped>
  .border-3 {
    border-width:5px !important;
  }

</style>
