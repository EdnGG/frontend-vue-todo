<template>

<v-container>


  <v-row
    class="mb-8 pa-8"
    justify="center"
  >
  
    <v-col
      lg=8
    >  
    <v-container
      justify="center"
      class="d-flex justify-center"
    >
      <h1>Register</h1>
    </v-container>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
      <v-text-field
        v-model="user.name"
        :counter="10"
        :rules="nameRules"
        label="Name"
        required
      >
      </v-text-field>

      <v-text-field
        v-model="user.email"
        :rules="emailRules"
        label="E-mail"
        required
      >
      </v-text-field>
      <v-text-field
        v-model="user.pass"
        :append-icon="show4 ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="[rules.required, rules.min]"
        
        name="input-10-2"
        label="Password"
        hint="At least 8 characters"
        required
        
      ></v-text-field>

      <v-container 
        justify="center"
        class="d-flex justify-center my-12"
      >
      <v-btn
        :disabled="!valid"
        color="success"
        class="mr-4"
        @click="signUp"
      >
        Sign up
      </v-btn>
      <v-btn
        color="warning"
        @click="resetValidation"
      >
        Reset Validation
      </v-btn>
      </v-container>

    </v-form>

    
  </v-col>
  
</v-row>
  
</v-container>
 
</template>

<script>
export default {
  data() {
    return {

      valid: true,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
      },

      show4: false,
      password: '',

      dismissSecs: 5,
      dismissCountDown: 0,
      message: {
        color: "",
        text: "",
      },
      user: {
        name: '',
        email: '',
        pass: '',
      },
    };
  },
  methods: {

    validate () {
      this.$refs.form.validate()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    },

    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
    signUp() {
      if(this.validate){
        console.log('pase por aqui')
        this.axios
          .post('/signup', this.user)
          .then((res) => {
            this.$store.commit('showSnackbar', `Welcome ${this.user.name} Please type email and password to login`)
            this.$router.push({ name: "Login" });
        })
        .catch((e) => {
        console.log('error', e)
          // this.message.text = e.response.data.message
          // this.message.color = 'danger'
          // this.showAlert()
        });
      }
      
    },
  }, 
};
</script>

<style>
</style>