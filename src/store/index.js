import Vue from 'vue'
import Vuex from 'vuex'
import Localbase from 'localbase'
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate' 

import router from '../router'


let db = new Localbase('db')

db.config.debug = false

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userDB: {},
    search: null,
    tasks: [ ],
    allTasks: [],
    sorting: false,
    appTitle: process.env.VUE_APP_TITLE,
    snackbar: {
      show: false,
      text: '',
    },
  },
  
  mutations: {
    actualizarImagenUsuario(state, payload) {
      console.log('Payload de actualizarImagenUsuario: ', payload)
      state.userDB = payload
    },
    obtenerUsuario(state, payload) {
      state.token = payload.token
      state.userDB = payload.userDB
    },
    getTasks(state, payload) {
      state.token = payload.token
      state.tasks = payload.tasks
    },
    setSearch(state, payload) {
      state.search = payload
      console.log(payload)
    },   
    hideSnackbar(state){
      state.snackbar.show = false
    },
    updateTaskDueDate(state, payload) {
      console.log(payload)
      let task = state.tasks.filter( task => task.id === payload.id )[0]
      task.dueDate = payload.dueDate
    },
    updateTaskTitle(state, payload) {
      console.log(payload)
      let task = state.tasks.filter( task => task.id === payload.id )[0]
      task.title = payload.title
    },
    deleteTask(state, id){
      state.tasks =  state.tasks.filter( task => task.id !== id )
    },
    
    doneTask(state, id){
      // agregamos [0] para que pueda agarrar el primer elemnto del arreglo de objetos
      /**
       * Primero return an array of objects, not a single object
       */
      let task = state.tasks.filter( task => task.id === id )[0]
      task.done = !task.done
    },
    setTasks(state, tasks) {
      state.tasks = tasks 
    },
    showSnackbar(state, payload) {
      let timeout = 0
      if(state.snackbar.show) {
        state.snackbar.show = false
        timeout = 300
      }
      setTimeout( () => {
        state.snackbar.show = true,
        state.snackbar.text = payload.text
      }, timeout)
    },
    toogleSorting(state) {
      state.sorting = !state.sorting
    },
    addTask(state, payload) {
      console.log(payload)
      state.tasks.push( payload.data )
      console.log('array tasks: ', state.tasks)
      // state.token = payload.token
    },
    getUserTasks(state, payload){
      console.log('payload from mutations', payload)
      state.allTasks = payload 
    }
  },
  actions: {
    addTask({ state, commit }, newTaskTitle) {
      let newTask = {
        id: this.state.userDB._id,
        title : newTaskTitle,
        done: false,
        dueDate:  null
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
    getUserTasks( {state, commit} ){
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
          commit('getUserTasks', res.data)
        })
        .catch((e) => {
          console.log(e.response);
        });
    },
    updateImageUsuario({ commit }, payload) {
      commit('actualizarImagenUsuario', payload)
    },
    // Esta accion no necesita el payload porque va a remover el token y el commit va a ser nulo
    closeSesion({ commit }) {
      localStorage.removeItem('token')
      router.push({name: 'Login'})
      commit('obtenerUsuario', '')
    },
    guardarUsuario({ commit }, payload) {
      localStorage.setItem('token', payload.token)
      commit('obtenerUsuario', payload)
    },
    
    // getTasks({commit}) {
    //   db.collection('tasks').get().then((task)=> {
    //     commit('setTasks', task)
    //   })
    // },
    setTasks({ commit }, tasks){
      db.collection('tasks').set(tasks)
      commit('setTasks', tasks)
    },
    updateTaskDueDate({commit}, payload){
      db.collection('tasks').doc({id: payload.id}).update({
        dueDate: payload.dueDate
      }).then(()=> {
        commit('updateTaskDueDate',  payload)
        commit('showSnackbar', {text: 'Due Date updated!'})
      })
     
    },
    updateTaskTitle({commit}, payload){
      db.collection('tasks').doc({id: payload.id}).update({
        title: payload.title
      }).then(()=> {
        commit('updateTaskTitle' , payload)
        commit('showSnackbar', {text: 'Task updated!'})
      })
    },
    
    doneTask({ state, commit }, id){
      let task = state.tasks.filter( (task) => task.id === id)[0]
      db.collection('tasks').doc({ id: id}).update({
        done: !task.done
      }).then(()=> {
        commit('doneTask', id)
      })
    },
    deleteTask({ commit }, id){
      db.collection('tasks').doc({ id: id }).delete().then(()=> {
        commit('deleteTask', id)
        commit('showSnackbar', { text: 'Task Deleted'} )
      })
    }
  }, 
  getters: {
    // Comprueba si en State existe el token, devuelve un boolean
    isActive: state => !!state.token,
    tasksFiltered(state) {
      if(!state.search){
        return state.tasks
      }
      return state.tasks.filter( task => 
        task.title.toLowerCase().includes(state.search.toLowerCase())
      )
    }
  },
  plugins: [createPersistedState()]
})
