<template>
  <b-card id="venue-details">

    <b-card-body>
      <b-card-title>{{ venue.venueName }}</b-card-title>
      <b-card-sub-title class="mb-4">{{ venue.category.categoryName }}</b-card-sub-title>
    </b-card-body>

    <b-list-group flush>
      <b-list-group-item><InfoRow title="Admin:">
        <router-link :to="{ name: 'user', params: { userId: venue.admin.userId } }">
          {{ venue.admin.username }}
        </router-link></InfoRow>
      </b-list-group-item>
      <b-list-group-item><InfoRow title="City:"> {{ venue.city }}</InfoRow></b-list-group-item>
      <b-list-group-item><InfoRow title="Adress:"> {{ venue.address }}</InfoRow></b-list-group-item>
      <b-list-group-item><InfoRow title="Added:"> {{ venue.dateAdded }}</InfoRow></b-list-group-item>
    </b-list-group>

    <b-card-body>
      <b-card-text>
        {{ venue.shortDescription}}
        <div v-if="venue.longDescription !== ''">
          <b-link @click="showCollapse = !showCollapse">{{ showCollapse ? 'show less' : 'show more' }}</b-link>
          <b-collapse v-model="showCollapse" class="mt-2">
            <b-card-text>{{ venue.shortDescription + ' ' + venue.longDescription }}</b-card-text>
          </b-collapse>
        </div>
      </b-card-text>

      <Ratings :venue="venue"/>

    </b-card-body>

  </b-card>
</template>

<script>
  import InfoRow from '../../display/InfoRow.vue'
  import Ratings from '../Ratings.vue';

  export default {
    name: "VenueDetails",

    components: {
      InfoRow,
      Ratings
    },

    props: {
      venue: Object
    },

    data() {
      return {
        showCollapse: false
      }
    }
  }
</script>

<style scoped>

</style>
