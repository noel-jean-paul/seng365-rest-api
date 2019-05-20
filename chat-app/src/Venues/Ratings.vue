<template>
  <b-container>
    <b-row>
      <b-col class="center-vert" xs="2">
        Quality:
      </b-col>
      <b-col  xs="10">
        <star-rating v-model="venue.meanStarRating"
                     read-only
                     :increment="0.01"
                     class="pt-3"
                     :star-size="30"

        >
        </star-rating>
      </b-col>
    </b-row>

    <b-row>
      <b-col class="center-vert text-right" xs="2">
        Cost:
      </b-col>
      <b-col class="float-left" xs="10">
        <star-rating v-model="venue.modeCostRating"
                     read-only
                     :increment="0.01"
                     class="pt-3"
                     :star-size="30"
                     active-color="orange"
                     :max-rating="4"
        >
        </star-rating>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import StarRating from 'vue-star-rating';

  export default {
    name: "Ratings",

    components: {
      StarRating
    },

    props: {
      venue: Object
    }
  }
</script>

<style scoped>
  .center-vert {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
</style>
