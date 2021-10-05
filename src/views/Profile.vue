<template>

<v-container
  justify="center"
  class="justify-center py-12 my-12 text-center"
>
<v-card
    class="text-center mx-auto"
    max-width="500"
  >
    <v-img
      :src="userDB.image ? userDB.image : imageDefault"
      height="400px"
      width="500px"
    ></v-img>

    <v-container>

    <v-card-title
      class="justify-center"
    >
      <h1>
        {{userDB.name}}
      </h1> 
    </v-card-title>

    </v-container>
   

    <v-card-subtitle>
      {{userDB.email}}
    </v-card-subtitle>

    <v-card-actions>
      <v-btn
        color="orange lighten-2"
        text
      >
        More
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
        icon
        @click="show = !show"
      >
        <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text
          
          class="text-subtitle-2 text-center"
        >
          <h2>
            {{ userDB.google ? 'Google user': 'User from email' }}
          </h2>
          <br>
          <h2>
            {{userDB.active ? 'User Active' : 'User Inactive' }}
          </h2>
           <h2>
            {{userDB }}
          </h2>
          
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>

<v-container class="py-12 my-12">
  <div >
    <h2>
      Member since: {{ userDB.date | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}
    </h2>
  </div>
</v-container>


  <v-container
    justify="center"
    class=" justify-center text-center"
    style="width: 50%"
  >
  
    <v-file-input
      v-model="image"
      :rules="rules"
      accept="image/*"
      placeholder="Pick an avatar"
      prepend-icon="mdi-camera"
      label="Profile Image"
      truncate-length="10"
    >
  </v-file-input
   
  >
  <v-btn
    elevation="5"
    color="orange lighten-2"
    text
    @click="upload"

  >
    Upload Image
  </v-btn>
  
</v-container>

</v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  data() {
    return {
      show: false,
      imageDefault: 'https://lenguajejs.com/javascript/logo.svg',
      image: null,
      message: null,
      rules: [
        value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
      ], 
    }
  },
  computed: {
    ...mapState(["userDB"]),
    
  },
  created(){
    this.gettingCommmits()
  },
  methods: {
    async gettingCommmits (){
      const res = await fetch('https://api.github.com/repos/EdnGG/vue-technical-test/commits')
      const data = await res.json()
      this.showCommitsData = data
    },
    
    showCommitsListElement(){
      this.showCommitsHistory  ? this.showCommitsHistory = false : this.showCommitsHistory = true
    },
    ...mapActions(["guardarUsuario", "updateImageUsuario"]),
    
    upload() {
      console.log(this.image)
      let formData = new FormData();
      formData.append("image", this.image);

      this.axios
        .put(`/upload/${this.userDB._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          this.updateImageUsuario(res.data.userDB);
          this.$store.commit('showSnackbar', `Hey ${res.data.userDB.name} image was updated successfully`)
        })
        .catch((e) => {
          // console.log("Error: ", e.response.data.err.message);
          this.message = e.response.data.err.message;
        });

    }
  },
};
</script>

<style scoped>
.home__date--member {
  display: flex;
  margin-left: 20px;
  padding-top: 7%;
  font-weight: bold;
}

p,
table,
form,
button {
color: hsl(246, 4%, 53%);  
font-weight: 800;
}
ul{
  list-style:none
}

.form-group .formdata--div {
  background-color: #76949f;
  color: hsl(249, 92%, 64%);
  font-weight: 800;
}
</style>