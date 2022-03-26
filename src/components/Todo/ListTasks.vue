<template>
  <v-list class="pt-0" flat>

    <draggable v-model="myList" handle=".handle">
      <task v-for="task in myList" :key="task._id" :task="task" />
    </draggable>

  </v-list>
</template>

<script>
// dispatch para actualizar DB
// commit para actualizar vista
import { mapActions, mapGetters, mapState } from "vuex";
import draggable from "vuedraggable";
export default {
  components: {
    task: require("@/components/Todo/Task.vue").default,
    draggable,
  },
  data() {
    return {
      myList: this.tasksFiltered,
    };
  },
  watch: {
    myList: {
      handler: function (newVal, oldVal) {
        console.log("newVal: ", newVal);
        console.log("oldVal: ", oldVal);
        //watch debe escuchar myList
        // this.$store.taskFiltered = newVal;
        this.$store.commit("updateList", newVal);
      },
    },
  },
  created() {
    this.myList = this.tasksFiltered;
  },
  computed: {
    ...mapState(["allTasks"]),
    ...mapGetters(["tasksFiltered"]),
    // myList: {
    //   get() {
    //     return this.tasksFiltered;
    //   },
    //   set(value) {
    //     // Limpio el array value de valores undefined
    //     const newArray = value.filter((val) => typeof val === "object");
    //     // this.taskFiltered = newArray;

    //     // //watch debe escuchar myList
    //     this.$store.taskFiltered = newArray;
    //     this.$store.commit("updateList", newArray);
    //   },
    // },
  },

  methods: {
    // ...mapActions(["getUserTasks"]),
  },
};
</script>
