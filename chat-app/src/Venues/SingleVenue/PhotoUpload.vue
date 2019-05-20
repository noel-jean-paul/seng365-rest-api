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



        <b-button class="mt-2" variant="primary" @click="upload"> Upload </b-button>

      </b-container>
    </b-modal>
  </div>
</template>

<script>
  export default {
    name: "PhotoUpload",

    data() {
      return {
        showModal: false,
        file: null,
        makePrimary: false
      }
    },

    props: {
      hasPhotos: Boolean
    },

    methods: {
      upload() {
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
              'X-Authorization': this.$cookies.get('token')
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
