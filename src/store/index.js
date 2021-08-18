import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate'

import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userDB: {},
    search: null,
    tasks: [],
    allTasks: [],
    sorting: false,
    appTitle: process.env.VUE_APP_TITLE,
    snackbar: {
      show: false,
      text: '',
    },
  },

  mutations: {
    actualizarImagenUsuario (state, payload) {
      console.log('Payload de actualizarImagenUsuario: ', payload)
      state.userDB = payload
    },
    obtenerUsuario (state, payload) {
      state.token = payload.token
      state.userDB = payload.userDB
    },
    setSearch (state, payload) {
      state.search = payload
      console.log(payload)
    },
    hideSnackbar (state) {
      state.snackbar.show = false
    },
    updateTaskDueDate (state, payload) {
      console.log(payload)
      let task = state.tasks.filter(task => task.id === payload.id)[0]
      task.dueDate = payload.dueDate
    },
    updateTaskTitle (state, payload) {
      console.log(payload)
      let task = state.tasks.filter(task => task.id === payload.id)[0]
      task.title = payload.title
    },
    deleteTask (state, id) {
      state.tasks = state.tasks.filter(task => task.id !== id)
    },
    doneTask (state, id) {
      // agregamos [0] para que pueda agarrar el primer elemnto del arreglo de objetos
      /**
       * Primero return an array of objects, not a single object
       */
      let task = state.tasks.filter(task => task.id === id)[0]
      task.done = !task.done
    },
    setTasks (state, tasks) {
      state.tasks = tasks
    },
    showSnackbar (state, payload) {
      let timeout = 0
      if (state.snackbar.show) {
        state.snackbar.show = false
        timeout = 300
      }
      setTimeout(() => {
        state.snackbar.show = true,
          state.snackbar.text = payload
      }, timeout)
    },
    toggleSorting (state) {
      state.sorting = !state.sorting
    },
    updateList (state, payload) {
      state.allTasks = payload
    },
    addTask (state, payload) { 
      console.log(payload)
      state.tasks.push(payload.data)
      console.log('array tasks: ', state.tasks)
      // state.token = payload.token
    },
    SET_USERTASK (state, payload) {
      console.log('payload from mutations', payload)
      state.allTasks = payload
    }
  },
  actions: {
    addTask ({ state, commit }, newTaskTitle) {
      let newTask = {
        id: this.state.userDB._id,
        title: newTaskTitle,
        done: false,
        dueDate: null
      }

      let config = {
        headers: {
          token: state.token,
        },
      };
      // 1 ruta, 2 body, 3 headers(config)
      axios
        .post("/new-todo", newTask, config)
        .then((res) => {
          console.log('res.data: ', res.data)
          commit('addTask', res.data)

        })
        .catch((e) => {
          console.log('Error from frontend', e)
        });
    },
    getUserTasks ({ state, commit }) {
      let config = {
        headers: {
          // El token lo sacamos de 'store'
          token: state.token,
        },
      };
      axios
        .get("/todos", config)
        .then((res) => {
          console.log("Get all notes:", res.data);
          commit('SET_USERTASK', res.data)
        })
        .catch((e) => {
          console.log(e.response);
        });
    },
    deleteTask ({ commit, dispatch }, idTask) {
      axios
        .delete(`/nota/${idTask}`)
        .then((res) => {
          commit('showSnackbar', 'Task deleted correctly')
          dispatch('getUserTasks')
        })
        .catch((e) => {
          commit('showSnackbar', 'ERROR: ' + e.response)
          console.log(e.response);
        });
    },
    updateTask ({ commit, dispatch }, task) {
      axios
        .put(`/nota/${task.id}`, { title: task.title })
        .then((res) => {
          commit('showSnackbar', 'Task updated correctly')
          dispatch('getUserTasks')
        })
        .catch((e) => {
          commit('showSnackbar', 'ERROR: ' + e.response)
          console.log(e.response);
        });
    },
    updateTaskDueDate ({ commit, dispatch }, task) {
      axios
        .put(`/nota/duedate/${task.id}`, { dueDate: task.dueDate })
        .then((res) => {
          commit('showSnackbar', 'Set due date correctly')
          dispatch('getUserTasks')
        })
        .catch((e) => {
          commit('showSnackbar', 'ERROR: ' + e.response)
          console.log(e.response);
        });

    },
    updateImageUsuario ({ commit }, payload) {
      commit('actualizarImagenUsuario', payload)
    },
    // Esta accion no necesita el payload porque va a remover el token y el commit va a ser nulo
    closeSesion ({ commit }) {
      localStorage.removeItem('token')
      router.push({ name: 'Login' })
      commit('obtenerUsuario', '')
    },
    guardarUsuario ({ commit }, payload) {
      localStorage.setItem('token', payload.token)
      commit('obtenerUsuario', payload)
    },

  },
  getters: {
    // Comprueba si en State existe el token, devuelve un boolean
    isActive: state => !!state.token,
    tasksFiltered (state) {
      if (!state.search) {
        return state.allTasks
      }
      return state.allTasks.filter(task =>
        task.title.toLowerCase().includes(state.search.toLowerCase())
      )
    }
  },
  plugins: [createPersistedState()]
})
