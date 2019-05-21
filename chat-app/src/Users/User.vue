<template>
  <div v-if="user !== null">
    <b-container>
      <b-card
        no-body
        style="max-width: 540px"
      >
        <div v-if="hasPhoto">
        <b-card-img

            :src="`${$baseUrl}/users/${$route.params.userId}/photo?x=${photoQuery}`"
            alt="Profile Picture"
        >
        </b-card-img>
        </div>

        <b-card-body>
          <b-card-title>{{ user.username }}</b-card-title>
        </b-card-body>

        <b-list-group flush>
          <b-list-group-item><InfoRow title="Username:" :label-width=3> {{ user.username }}</InfoRow></b-list-group-item>
          <b-list-group-item v-if="isAdmin">
            <InfoRow title="Email:" :label-width=3> {{ user.email }}</InfoRow>
          </b-list-group-item>
          <b-list-group-item><InfoRow title="Given Name" :label-width=3> {{ user.givenName }}</InfoRow></b-list-group-item>
          <b-list-group-item><InfoRow title="Family Name" :label-width=3> {{ user.familyName }}</InfoRow></b-list-group-item>
        </b-list-group>

        <b-card-footer v-if="isAdmin">
          <b-button variant="primary" @click="onEditProfile">
            Edit Profile
          </b-button>

          <b-button @click="showUploadModal = !showUploadModal">Upload Profile Picture</b-button>

          <b-button @click="onDeletePhoto"
                    variant="danger"
                    v-if="hasPhoto"
          >
            Delete profile photo
          </b-button>
        </b-card-footer>
      </b-card>

    </b-container>

    <b-modal v-model="showUploadModal"
             title="Upload Profile Pic"
             hide-footer
    >
      <ProfilePicUpload @upload="onUpload"/>
    </b-modal>

    <b-modal v-model="showEditModal"
             title="Edit Profile"
             hide-footer
    >
      <EditProfile @close-reload="onSave"
                   :user="user"
                   :userId="$route.params.userId"
      />
    </b-modal>

  </div>
</template>

<script>
  import InfoRow from '../display/InfoRow';
  import authUtils from '../utils/authUtils';
  import EditProfile from './EditProfile';
  import ProfilePicUpload from './ProfilePicUpload';

  export default {
    name: "User",

    components: {
      InfoRow,
      EditProfile,
      ProfilePicUpload
    },

    data() {
      return {
        user: null,
        isAdmin: false,
        showEditModal: false,
        showUploadModal: false,
        photoQuery: true,
        hasPhoto: false
      }
    },

    mounted() {
      if (parseInt(this.$route.params.userId) === authUtils.getAuthedUserId(this)) {
        this.isAdmin = true;
      }
      Promise.all([
      this.getUser(),
      this.checkForPhoto()
    ])
        .then((result) => {
          this.hasPhoto = result[1]
        });
    },

    methods: {
      checkForPhoto() {
        return this.axios.get(`${this.$baseUrl}/users/${this.$route.params.userId}/photo`)
          .then((result) => {
            return true
          })
          .catch((error) => {
            // no photo exists
            return false
        });
      },

      onDeletePhoto() {
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
          .then((value) => {
            if (value) {
              const url = `${this.$baseUrl}/users/${this.$route.params.userId}/photo`;

              return this.axios({
                method: 'delete',
                url: url,
                headers: {
                  'X-Authorization': authUtils.getCookie(this)
                }
              })
                .then(() => {
                  this.checkForPhoto()
                    .then((result) => {
                      this.hasPhoto = result;
                    this.photoQuery = !this.photoQuery;
                    })
                })
            }
          })
      },

      onUpload() {
        console.log('onUpload');
        this.showUploadModal = false;
        this.checkForPhoto()
          .then((result) => {
            this.hasPhoto = result;
            this.photoQuery = !this.photoQuery;

          })
      },

      onSave() {
        this.showEditModal = false;
        this.getUser();
      },

      getUser() {
        this.axios({
          method: 'get',
          url: `${this.$baseUrl}/users/${this.$route.params.userId}`,
          headers: {
            'X-Authorization': authUtils.getCookie(this)
          }
        })
          .then((res) => {
            this.user = res.data;
          });
      },

      onEditProfile() {
        this.showEditModal = true;
      }
    }
  }
</script>

<style scoped>

</style>
