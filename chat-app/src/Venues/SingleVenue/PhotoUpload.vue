<template>
  <div>
    <b-button @click="showModal = !showModal">Upload Photo</b-button>

    <b-modal v-model="showModal"
             title="Upload Photo"
             hide-footer
    >
      <b-container>

        <b-form-file
          v-model="file"
          :state="Boolean(file)"
          placeholder="Choose a file..."
          drop-placeholder="Drop file here..."
        ></b-form-file>

        <b-form-checkbox v-if="hasPhotos"
          v-model="makePrimary"
        >
          Make primary photo
        </b-form-checkbox>



        <b-button class="mt-2"
                  variant="primary"
                  @click="upload"
                  :disabled="file ? file.size > 20 * mbToByteFactor : false"
        > Upload </b-button>

        <div class="text-danger" v-if="file ? file.size > 20 * mbToByteFactor : false">
          File is more than 20mb big
        </div>

      </b-container>
    </b-modal>
  </div>
</template>

<script>
  import authUtils from '../../utils/authUtils';

  export default {
    name: "PhotoUpload",

    data() {
      return {
        showModal: false,
        file: null,
        makePrimary: false,
        mbToByteFactor: 1000000
      }
    },

    props: {
      hasPhotos: Boolean
    },

    methods: {
      upload() {
        console.log('file size: ', this.file);

        const bodyFormData = new FormData();
        bodyFormData.set('description', '');
        bodyFormData.set('makePrimary', this.makePrimary);
        bodyFormData.append('photo', this.file);

        const baseUrl = this.$baseUrl;
        const venueId = this.$route.params.venueId;

        if (this.file !== null) {
          return this.axios({
            method: 'post',
            url: `${baseUrl}/venues/${venueId}/photos`,
            data: bodyFormData,
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-Authorization': authUtils.getCookie(this)
            }
          })

            .then(() => {
              this.$emit('upload');
              this.showModal = false;
              this.file = null;
            })
            .catch((response) => {
              //handle error
              console.log(response);
            });
        }

      }
    }
  }
</script>

<style scoped>

</style>
