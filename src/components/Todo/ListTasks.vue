<template>
  <v-list class="pt-0" flat>
    <!-- :list="$store.getters.tasksFiltered" -->
    <draggable v-model="myList" handle=".handle">
      {{ tasksFiltered[0]._id }} - {{ tasksFiltered.length }}
      <task v-for="task in myList" :key="task._id" :task="task" />
      <!-- {{task}} -->
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
        // this.taskFiltered.forEach((element) => {
        //   return element;
        // });

        return this.tasksFiltered;
      },
      set(value) {
        console.log("Value on set: ", value);
        // Limpio el array value de valores undefined
        const newArray = value.filter((val) => typeof val === "object");
        // this.taskFiltered = newArray;
        console.log("New array: ", newArray);
        // dispatch para actualizar DB
        // commit para actualizar vista
        this.$store.commit("updateList", newArray);
        this.$store.taskFiltered = newArray;
      },
    },
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
