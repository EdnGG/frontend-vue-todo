<template>
  <div class="home">
    <list-tasks 
      v-if="$store.state.tasks.length"
    />

    <no-tasks v-else />

    <button-done-sorting
      v-if="$store.state.sorting"
    /> 

  </div>
</template>

<script>
import { mapState } from "vuex";

/* Convencional way to import child components
  import FieldAddTask from '@/components/Todo/FieldAddTask.vue'
*/

  export default {
    name: 'Home',
    components: {
      /*  convencional way to import child components
        FieldAddTask,
        'field-add-task' : FieldAddTask
      */
    //  'field-add-task' : require('@/components/Todo/FieldAddTask.vue').default,
     'list-tasks' : require('@/components/Todo/ListTasks.vue').default,
     'no-tasks' : require('@/components/Todo/NoTasks.vue').default,
     'button-done-sorting' : require('@/components/Todo/ButtonDoneSorting.vue').default
    },
    data () {
      return {
        newTaskTitle: '',
      }
    },
    computed:{
      ...mapState(["token"]),
    },    
    methods: {
      agregarNota() {
      let config = {
        headers: {
          // El token lo sacamos de 'store'
          token: this.token,
        },
      };
      console.log(this.nota);
      this.axios
        // 1 ruta, 2 body, 3 headers(config)
        .post("/new-todo", this.newTaskTitle, config)
        .then((res) => {
          this.newTaskTitle.push(res.data);
          this.newTaskTitle = "";
          // this.nota.description = "";
          // this.mensaje.color = "success";
          // this.mensaje.texto = "New note was added";
          // this.showAlert();
        })
        .catch((e) => {
          if (e.response.data.error.errors.nombre.message) {
            this.mensaje.texto = e.response.data.error.errors.nombre.message;
          } else {
            this.mensaje.texto = "Something was wrong adding note";
          }
          this.mensaje.color = "danger";
          this.showAlert();
          console.log(e.response);
        });
    },
    addTask() {
        this.$store.commit('addTask', this.newTaskTitle)
        this.newTaskTitle = ''
      },
      
    }
  }
</script>


