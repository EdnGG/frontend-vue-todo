<template>
  <v-list
    class="pt-0"
    flat
  >
    <draggable
      v-model="myList"
      handle=".handle"
    >
      <task
        v-for="task in tasksFiltered"
        :key="task._id"
        :task="task"
      />
    </draggable>
  </v-list>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import draggable from "vuedraggable";
export default {
  computed: {
    ...mapState(["allTasks"]),
    ...mapGetters(["tasksFiltered"]),
    myList: {
      get() {
        return this.tasksFiltered;
      },
      set(value) {
        this.$store.commit("updateList", value);
      },
    },
    // logTasks() {
    //   let array = this.allTasks.map(
    //     (task) => {
    //       return task;
    //       //   console.log('allTasks: ', this.allTasks)
    //     }
    //     // tasks: {
    //     //     get(){
    //     //         return this.$store.getters.tasksFiltered
    //     //     },
    //     //     set(value) {
    //     //         this.$store.dispatch('setTasks', value)
    //     //     }
    //     // }
    //     //    tasks(){
    //     //     //    return this.$store.getters.tasksFiltered
    //     //     return this.$store.state.tasks

    //     //    }

    //     // getTasks(){
    //     //     return getUserTasks()
    //     // }
    //   );
    // },
  },
  mounted() {
    // this.getUserTasks();
    // console.log("created hook");
  },
  methods: {
    // ...mapActions(["getUserTasks"]),
  },
  components: {
    task: require("@/components/Todo/Task.vue").default,
    draggable,
  },
};
</script>