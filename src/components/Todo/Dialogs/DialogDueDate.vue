<template>
  <v-dialog
    ref="dialog"
    :value="true"
    :return-value.sync="date"
    persistent
    width="290px"
  >

    <v-date-picker
      v-model="date"
      scrollable
    >
      <v-spacer></v-spacer>
      <v-btn
        @click="$emit('close')"
        text
        color="primary"
      >
        Cancel
      </v-btn>
      <v-btn
        @click="saveTask"
        text
        color="primary"
      >
        OK
      </v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script>
export default {
  props: ['task'],
  data () {
    return {
      date: null
    }
  },
  mounted () {
    if (this.task.dueDate) {
      this.date = this.task.dueDate
    }
  },
  methods: {
    saveTask () {
      let payload = {
        id: this.task._id,
        dueDate: this.date,
      }
      this.$store.dispatch('updateTaskDueDate', payload)
      this.$emit('close')
    }
  }

}
</script>

<style>
</style>