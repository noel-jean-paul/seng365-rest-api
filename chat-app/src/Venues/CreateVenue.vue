<template>
  <div>
    <b-button @click="showModal = !showModal">Add New Venue</b-button>

    <b-modal v-model="showModal"
             title="Create new venue"
             hide-footer
    >
      <b-container>
        <b-form @submit.stop.prevent="onSubmit">
          <b-form-group label="Venue Name">
            <b-form-input v-model="name"
                          trim
                          placeholder="Venue name"
                          required
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Category">
            <b-form-select v-model="category"
                           :options="catOptions"
                           required
            ></b-form-select>
          </b-form-group>

          <b-form-group label="Short Description">
            <b-form-input v-model="sDesc"
                          trim
                          placeholder="Short Description"
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Long Description">
            <b-form-textarea
              v-model="lDesc"
              placeholder="Longer description"
              rows="3"
            ></b-form-textarea>
          </b-form-group>

          <b-form-group label="City">
            <b-form-input v-model="city"
                          trim
                          placeholder="City"
                          required
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Address">
            <b-form-textarea
              v-model="address"
              placeholder="Address"
              rows="3"
              required
            ></b-form-textarea>
          </b-form-group>

          <b-form-group label="Latitude"
                        :invalid-feedback="invalidLatFeedback"
                        :state="latState"
          >
            <b-form-input v-model="lat"
                          trim
                          placeholder="Latitude"
                          required
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Longtidude"
                        :invalid-feedback="invalidLongFeedback"
                        :state="longState"
          >
            <b-form-input v-model="long"
                          trim
                          placeholder="Longitude"
                          required
            ></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary">Submit</b-button>
        </b-form>

      </b-container>
    </b-modal>
  </div>
</template>

<script>
  export default {
    name: "CreateVenue",

    data() {
      return {
        showModal: false,
        name: '',
        category: '',
        catOptions: [],
        sDesc: '',
        lDesc: '',
        city: '',
        address: '',
        lat: '',
        long: ''
      }
    },

    props: {
      categories: Array
    },

    mounted() {
      console.log(this.categories);
      for (const category of this.categories) {
        const option = {
          value: category.categoryId,
          text: category.categoryName
        };
        this.catOptions.push(option);
      }

      console.log(this.catOptions);
    },

    methods: {
      onSubmit() {
        console.log('submitted');
      },
    },

    computed: {
      invalidLatFeedback() {
        const lat = parseInt(this.lat);
        if (isNaN(lat)) {
          return 'Latitude must be a number';
        } else if (lat < -90 || lat > 90) {
          return 'Latitude must be between -90 and +90'
        } else {
          return '';
        }
      },

      latState() {
        const lat = parseInt(this.lat);
        if (isNaN(lat)) {
          return false;
        } else {
          return lat >= -90 && lat <= 90;
        }
      },

      invalidLongFeedback() {
        const long = parseInt(this.long);
        if (isNaN(long)) {
          return 'Longitude must be a number';
        } else if (long < -180 || long > 180) {
          return 'Longitude must be between -180 and +180'
        } else {
          return '';
        }
      },

      longState() {
        const long = parseInt(this.long);
        if (isNaN(long)) {
          return false;
        } else {
          return long >= -180 && long <= 180;
        }
      }
    }

  }
</script>

<style scoped>

</style>
