<template>
  <div>
    <v-list-item
      @click="doneTask(task._id)"
      :class="{ 'blue lighten-5': task.done }"
      :ripple="false"
      class="white"
    >
      <template v-slot:default>
        <v-list-item-action>
          <v-checkbox :input-value="task.done" color="primary"></v-checkbox>
        </v-list-item-action>

        <v-list-item-content>
          <!-- condicionando classes -->
          <v-list-item-title
            :class="{ 'text-decoration-line-through': task.done }"
          >
            <!-- <v-list-item-title :class="{'text-decoration-line-through' : $store.state.task}"> -->
            {{ task.title }}
          </v-list-item-title>
        </v-list-item-content>

        <v-list-item-action v-if="task.dueDate">
          <v-list-item-action-text>
            <v-icon small> mdi-calendar </v-icon>
            {{ task.dueDate | niceDate }}
          </v-list-item-action-text>
        </v-list-item-action>

        <v-list-item-action>
          <!-- @click.stop="deleteTask(task.id)" detiene la propagacion del evento
          que se ejecuta en el elemento padre"\ -->
          <!-- {{task}} -->
          <task-menu :task="task" />
        </v-list-item-action>

        <v-list-item-action v-if="$store.state.sorting">
          <v-btn color="primary" class="handle" icon>
            <v-icon>mdi-drag-horizontal-variant</v-icon>
          </v-btn>
        </v-list-item-action>
      </template>
    </v-list-item>
    <v-divider></v-divider>
  </div>
</template>

<script>
import { format } from "date-fns";
export default {
  props: ["task"],
  components: {
    "task-menu": require("@/components/Todo/TaskMenu.vue").default,
  },
  filters: {
    niceDate(value) {
      // let newValue = value + 1
      return format(
        new Date(value.replaceAll("-", "/").substring(0, 10)),
        "MMM d"
      );
    },
  },
  methods: {
    doneTask(id) {
      // console.log(` Task.id from mongo: ${id}`);
      try {
        this.task.done = !this.task.done;
        this.axios
          .put(`/todos/done/${id}`, { done: this.task.done })
          .then((response) => {
            // no se porque regresa object [ object Object ]
            // console.log(`Respuesta de axios: ${response}`);
            this.$store.dispatch("getUserTasks");
          });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="sass">
.sortable-ghost
  opacity: 0
  .sortable-drag
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3)
</style>
