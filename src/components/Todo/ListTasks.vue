<template>
  <v-list class="pt-0" flat>
    <Draggable
      v-model="myList"
      @start="drag = true"
      @end="drag = false"
      :move="move"
    >
      <task-item v-for="task in myList" :key="task._id" :task="task" />
    </Draggable>
  </v-list>
</template>

<script>
// dispatch para actualizar DB
// commit para actualizar vista
import { mapActions, mapGetters, mapState } from "vuex";
import Draggable from "vuedraggable";

import TaskItem from "@/components/Todo/TaskItem.vue";

export default {
  components: {
    // task: require("@/components/Todo/Task.vue").default,
    TaskItem,
    Draggable,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["allTasks"]),
    ...mapGetters(["tasksFiltered"]),
    myList: {
      get() {
        return this.tasksFiltered;
      },
      set(newOrderList) {
        console.log("set: ", newOrderList);
        // actualiza la vista
        this.$store.commit("setUpdateList", newOrderList);
      },
    },
  },
  watch: {
    myList: {
      async handler(newList) {
        //  Actualiza la DB
        await this.$store.dispatch("updateList", newList);
      },
    },
  },
  methods: {
    move: ({ draggedContext }) => {
      console.log("move", draggedContext);
    },
  },
};
</script>
