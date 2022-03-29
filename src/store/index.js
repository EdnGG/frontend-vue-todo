import Vue from 'vue'
// import Vuex from 'vuex/types/index.js'
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
    task: true, 
    allTasks: [],
    sorting: false,
    appTitle: process.env.VUE_APP_TITLE,
    weather: {},
    snackbar: {
      show: false,
      text: '',
    },
  },

  mutations: {
    actualizarImagenUsuario (state, payload) {
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
    SET_DONE_TASK (state, payload) {
      console.log('SET_DONE_TASK', payload)
      state.allTasks = payload
    },
    updateTaskTitle (state, payload) {
      console.log(payload)
      let task = state.tasks.filter(task => task.id === payload.id)[0]
      task.title = payload.title
    },
    deleteTask (state, id) {
      state.tasks = state.tasks.filter(task => task.id !== id)
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
    setUpdateList (state, payload) {
      // 
      state.allTasks = payload
    },
    addTask (state, payload) { 
      console.log('addtask: ',payload)
      // state.tasks.push(payload.data)
      state.allTasks.push(payload)
      // console.log('array tasks: ', state.tasks)
      // state.token = payload.token
    },
    SET_USERTASK (state, payload) {
      // console.log('payload from mutations', payload)
      state.allTasks = payload
    },
    SET_LOCAL_WEATHER(state, payload){
      // console.log('Payload from mutations: ', payload)
      state.weather = payload
    },
  },
  actions: {
    getLocalWeather({commit}){
      // console.log('object navigation: ', navigatior.geolocation)
     return navigator.geolocation.getCurrentPosition(position => {
      //  console.log('Position: ', position)
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        // need to find the client location 
        // const url = `https://api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid=${process.env.VUE_APP_WEATHER_API_KEY}&units=imperial`
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.VUE_APP_WEATHER_API_KEY}&units=imperial`
        fetch(url)
        .then(response => { return response.json() })
        .then(data => {
          commit('SET_LOCAL_WEATHER', data)})
          // console.log(data)
        .catch(error => {
          console.log(error)
        })
      })
    },
    doneTask({commit}, id){
      let newTask = state.allTasks.filter(tarea => tarea._id === id)[0]
      newTask.done = !newTask.done
      axios
        .put(`/nota/done/${newTask._id}`, { done: task.done })
        .then((res) => {
          console.log('res de doneTask action: ', res )
          commit('SET_DONE_TASK', id)
          commit('showSnackbar', ' correctly')
          dispatch('getUserTasks')
        })
        .catch((e) => {
          commit('showSnackbar', 'ERROR: ' + e.response)
          console.error('Error' + e.response);
        });
    },

    addTask ({ state, commit }, newTaskTitle) {
      let newTask = {
        id: this.state.userDB._id,
        title: newTaskTitle,
        done: false,
        dueDate: null,
        index: state.allTasks.length,
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
    // la funcion de abajo la hice asincrona
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
    // 
    updateList ({ commit, dispatch }, list) {
      // falata optimizar
      const payload = list.map((item, index) => ({ ...item, index: index + 1 }))
      axios
        .put('/nota' , payload )
        .then((res) => {
          // Solo actualizamos la base de datos. el computed debe actualizar la lista
          commit('showSnackbar', 'List updated correctly')
        })
        .catch((e) => {
          commit('showSnackbar', 'ERROR: ' + e)
          console.log(e.response);
        });
    },
    // 
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
          // commit showing info
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
      // commit('showSnackbar', `Hey ${this.userDB.name} successfully image updated`)
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
