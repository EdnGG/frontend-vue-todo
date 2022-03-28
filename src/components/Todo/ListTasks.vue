<template>
  <v-list class="pt-0" flat>

    <draggable v-model="myList" @start="true" @end="false">
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
      // no funciona
      // myList2: this.tasksFiltered,
    };
  },

  created() {
    // no funciona
    // this.myList2 = this.tasksFiltered;
  },
  computed: {
    ...mapState(["allTasks"]),
    ...mapGetters(["tasksFiltered"]),
    myList: {
      get() {
        return this.tasksFiltered;
        // return this.MyList2;
      },
      set(newOrderList) {
        // Limpio el array value de valores undefined
        // const newArray = value.filter((val) => typeof val === "object");
        // this.taskFiltered = newArray;

        // //watch debe escuchar myList
        // this.$store.commit("updateList", newArray);
        console.log("set: ", newOrderList);
        // actualiza la vista
        this.$store.commit("setUpdateList", newOrderList);
        // bd
        // this.$store.dispatch("updateList", newOrderList);
      },
    },
  },
  // watch: {
  //   myList: {
  //     async handler(newList, oldList) {
  //       console.log("watch newValue: ", newList);
  //       console.log("watch oldvalue: ", oldList);
  //       // Actualiza la DB, Value es el nuevo array
  //       // Aqui entra en un loop infinito
  //       await this.$store.dispatch("updateList", newList);
  //       // this.$store.taskFiltered = newArray;
  //     },
  //   },
  // },
  methods: {
    // ...mapActions(["getUserTasks"]),
  },
};
</script>
