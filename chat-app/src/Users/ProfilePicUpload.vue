<template>
  <div>
      <b-container>

        <b-form-file
          v-model="file"
          :state="Boolean(file)"
          placeholder="Choose a file..."
          accept="image/jpeg, image/png"
        ></b-form-file>

        <b-button class="mt-2"
                  variant="primary"
                  @click="upload"
                  :disabled="file ? file.size > 20 * mbToByteFactor : false"
        > Upload </b-button>

        <div class="text-danger" v-if="file ? file.size > 20 * mbToByteFactor : false">
          File is more than 20mb big
        </div>
      </b-container>
  </div>
</template>

<script>
  import authUtils from '../utils/authUtils';

  export default {
    name: "ProfilePicUpload",

    data() {
      return {
        showModal: false,
        file: null,
        mbToByteFactor: 1000000
      }
    },

    methods: {
      upload() {
        const baseUrl = this.$baseUrl;
        const userId = this.$route.params.userId;

        if (this.file !== null) {
          const fileType = this.file.type;

          return this.axios({
            method: 'put',
            url: `${baseUrl}/users/${userId}/photo`,
            data: this.file,
            headers: {
              'Content-Type': fileType,
              'X-Authorization': authUtils.getCookie(this)
            }
          })

            .then(() => {
              this.$emit('upload');
            })
            .catch((error) => {
              //handle error
              console.log(error);
            });
        }

      }
    }
  }
</script>

<style scoped>

</style>
