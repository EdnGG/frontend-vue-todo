<template>
  <v-list class="pt-0" flat>
    <!-- <Draggable
      v-model="myList"
      @start="drag = true"
      @end="drag = false"
      :move="move"
      v-if="!sorting"
    > -->
    <Draggable
      v-model="myList"
      :move="move"
      v-if="sorting"
    >
      <task-item v-for="task in myList" :key="task._id" :task="task" />
    </Draggable>
    <task-item 
      v-else
      v-for="task in myList" 
      :key="task._id" 
      :task="task" 
    />
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
    TaskItem,
    Draggable,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["allTasks", "sorting"]),
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
        if (this.sorting) {
          console.log("sorting true");
          return await this.$store.dispatch("updateList", newList);
        }
        console.log("Sorting is disabled");
        //  checar si button sorting es true or false
        //  Actualiza la DB
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
