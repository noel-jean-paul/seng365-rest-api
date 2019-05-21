<template>
  <div v-if="user !== null">
    <b-container>
      <b-card
        no-body
        style="max-width: 540px"
        img-src="https://placekitten.com/380/200"
        img-alt="Image"
        img-top
      >
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
        </b-card-footer>
      </b-card>

    </b-container>

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

  export default {
    name: "User",

    components: {
      InfoRow,
      EditProfile
    },

    data() {
      return {
        user: null,
        isAdmin: false,
        showEditModal: false
      }
    },

    mounted() {
      if (parseInt(this.$route.params.userId) === authUtils.getAuthedUserId(this)) {
        this.isAdmin = true;
      }
      this.getUser();
    },

    computed: {

    },

    methods: {
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
