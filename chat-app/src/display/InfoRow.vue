<template>
    <b-row>
      <b-col :cols="labelWidth"
             class="InfoRow text-right"> {{ title }} </b-col>
      <b-col> <slot></slot> </b-col>
    </b-row>

</template>

<script>
  export default {
    name: "InfoRow",

    props: {
      labelWidth: {
        type: Number,
        default: 2
      },
      title: String
    }
  }
</script>

<style scoped>

</style>
