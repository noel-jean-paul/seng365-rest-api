<template>
  <div>
    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>

    <b-button @click="showModal = !showModal" variant="primary">Add New Venue</b-button>

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

          <b-form-group label="City"
                        :invalid-feedback="invalidCityFeedback"
                        :state="cityState"
          >
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
                          type="number"
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
                          type="number"
            ></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary">Submit</b-button>
        </b-form>

        <div class="text-danger" v-if="formError">
          Form contains errors
        </div>

      </b-container>
    </b-modal>
  </div>
</template>

<script>
  import authUtils from '../utils/authUtils';

  export default {
    name: "CreateVenue",

    data() {
      return {
        showModal: false,
        name: '',
        category: '',
        categories: [],
        catOptions: [],
        sDesc: '',
        lDesc: '',
        city: '',
        address: '',
        lat: '',
        long: '',
        error: '',
        errorFlag: false,
        formError: false
      }
    },

    mounted() {
      this.getCategories()
        .then(() => {
          console.log('cats: ', this.categories);
          const catOptions = [];
          for (const category of this.categories) {
            const option = {
              value: category.categoryId,
              text: category.categoryName
            };
            catOptions.push(option);
          }
          this.catOptions = catOptions;
          console.log('opts: ', this.catOptions);
        });
    },

    methods: {
      onSubmit() {
        this.formError = false;
        if (this.submissionValid()) {
          const url = `${this.$baseUrl}/venues`;
          const data = {
            venueName: this.name,
            categoryId: this.category,
            city: this.city,
            shortDescription: this.sDesc,
            longDescription: this.lDesc,
            address: this.address,
            latitude: parseInt(this.lat),
            longitude: parseInt(this.long)
          };

          this.axios({
            method: 'post',
            url: url,
            data: data,
            headers: {
              'X-Authorization': authUtils.getCookie(this)
            }
          })
            .then(() => {
              console.log('req completed');
              this.$emit('reload-required');
              this.showModal = false;
            })
        } else {
          this.formError = true;
        }
      },

      submissionValid() {
        const validationResults = [
          this.cityState
        ];

        for (const result of validationResults) {
          if (!result) {
            return false;
          }
        }

        return true;
      },

      getCategories() {
        return this.axios.get(this.$baseUrl + '/categories')
          .then((res) => {
            this.categories = res.data;
            return res.data;
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      }
    },

    computed: {
      invalidLatFeedback() {
        if (this.lat < -90 || this.lat > 90) {
          return 'Latitude must be between -90 and +90'
        } else {
          return '';
        }
      },

      latState() {
        return this.lat >= -90 && this.lat <= 90;
      },

      invalidLongFeedback() {
       if (this.long < -180 || this.long > 180) {
          return 'Longitude must be between -180 and +180'
        } else {
          return '';
        }
      },

      longState() {
        return this.long >= -180 && this.long <= 180;
      },

      invalidCityFeedback() {
        if (!isNaN(this.city)) {  // if number = false so !
          return 'City must be a string';
        } else {
          return '';
        }
      },

      cityState() {
        // returns false if a number, true if string
        return isNaN(this.city);
      }
    }

  }
</script>

<style scoped>

</style>
