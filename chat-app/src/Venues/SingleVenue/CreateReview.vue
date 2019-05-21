<template>
  <div>

    <b-container>

      <b-form @submit.stop.prevent="onSubmit">
        <b-form-group label="Review body">
          <b-form-textarea v-model="reviewBody"
                           trim
                           placeholder="Review"
                           rows="5"
                           required
          ></b-form-textarea>
        </b-form-group>

        <b-form-group label="Star rating">
          <b-form-input v-model="starRating"
                        type="range"
                        min=1
                        max=5
          ></b-form-input>
          <div class="mt-2">Star Rating: {{ starRating }}</div>
          <div >0 = poor quality, 5 = amazing</div>
        </b-form-group>

        <b-form-group label="Cost rating">
          <b-form-input v-model="costRating"
                        type="range"
                        min=0
                        max=4
          ></b-form-input>
          <div class="mt-2">Cost Rating: {{ costRating }}</div>
          <div>0 = free, 4 = expensive</div>
        </b-form-group>

        <b-button type="submit" variant="primary">Add review</b-button>
      </b-form>
    </b-container>
  </div>

</template>

<script>
  import authUtils from '../../utils/authUtils';

  export default {
    name: "CreateReview",

    data() {
      return {
        reviewBody: '',
        starRating: 1,
        costRating: 0,
      }
    },

    props: {
      venueId: String
    },

    methods: {
      onSubmit() {
        const url = `${this.$baseUrl}/venues/${this.venueId}/reviews`;

        const body = {
          reviewBody: this.reviewBody,
          starRating: parseInt(this.starRating),
          costRating: parseInt(this.costRating)
        };

        this.axios({
          method:'post',
          url: url,
          data: body,
          headers: {
            'X-Authorization': authUtils.getCookie(this)
          }
        })
          .then(() => {
            this.$emit('close-reload');
          });
      }
    }
  }
</script>

<style scoped>

</style>
