<template>
  <div id='venue'>

  <b-card>

    <b-card-body>
      <b-card-title>{{ venue.venueName }}</b-card-title>
      <b-card-sub-title class="mb-4">{{ venue.category.categoryName }}</b-card-sub-title>
      <b-card-text>
        {{ venue.shortDescription}}
        <div v-if="venue.longDescription !== ''">
        <b-link @click="showCollapse = !showCollapse">{{ showCollapse ? 'show less' : 'show more' }}</b-link>
        <b-collapse v-model="showCollapse" class="mt-2">
          <b-card-text>{{ venue.longDescription }}</b-card-text>
        </b-collapse>
        </div>
      </b-card-text>
    </b-card-body>

    <b-list-group flush>
      <b-list-group-item><InfoRow title="Admin:"> {{ venue.admin.username }}</InfoRow></b-list-group-item>
      <b-list-group-item><InfoRow title="City:"> {{ venue.city }}</InfoRow></b-list-group-item>
      <b-list-group-item><InfoRow title="Adress:"> {{ venue.address }}</InfoRow></b-list-group-item>
      <b-list-group-item><InfoRow title="Added:"> {{ venue.dateAdded }}</InfoRow></b-list-group-item>
    </b-list-group>

    <b-card-body>
      <a href="#" class="card-link">Card link</a>
      <a href="#" class="card-link">Another link</a>
    </b-card-body>

    <b-card-footer>This is a footer</b-card-footer>

    <b-card-img src="https://placekitten.com/480/210" alt="Image" bottom></b-card-img>
  </b-card>

  </div>

</template>

<script>
  import InfoRow from '../display/InfoRow.vue'

  export default {
    name: "Venue",

    components: {
      InfoRow
    },

    data() {
      return {
        venue: null,
        showCollapse: false
      }
    },

    mounted() {
      this.getVenue()
        .then(() => {
          console.log(this.venue);
        })
    },

    methods: {
      getVenue() {
        return this.axios.get(this.$baseUrl + '/venues/' + this.$route.params.venueId)
          .then((res) => {
            this.venue = res.data;
        });
      }
    }
  }
</script>

<style scoped>

</style>
