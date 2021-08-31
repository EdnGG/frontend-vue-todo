<template>
  <v-container>
    <v-row class="mb-8 pa-8" justify="center">
      <v-col lg="8">
        <v-container justify="center" class="d-flex justify-center">
          <h1>Reset Password</h1>
        </v-container>
        <v-form ref="form" v-model="valid" lazy-validation>

          <!-- <v-text-field
            v-model="user.email"
            :rules="emailRules"
            label="E-mail"
            required
          >
          </v-text-field> -->


          <v-text-field
            v-model="user.pass"
            :append-icon="show4 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]"
            name="input-10-2"
            label="New Password"
            hint="At least 8 characters"
            required
          ></v-text-field>

          <!-- <div class="d-flex align-end flex-column" style="margin-top: -5px">
            <router-link :to="{ name: 'Login' }"> Back to login </router-link>
          </div> -->

          <!-- <div class="d-flex align-end flex-column" style="margin-top: -20px">
            <v-btn icon href="/"> Back </v-btn>
          </div> -->

          <v-container justify="center" class="d-flex justify-center my-12">
            <v-btn
              :disabled="!valid"
              color="success"
              class="mr-4"
              @click="resetpassword(user.pass)"
            >
              New Password
            </v-btn>
            <v-btn color="warning" @click="resetValidation">
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
      name: "",
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
      ],
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],

      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
      },

      show4: false,
      password: "",

      dismissSecs: 5,
      dismissCountDown: 0,
      message: {
        color: "",
        text: "",
      },
      user: {
        name: "",
        email: "",
        pass: "",
        resetLink: ""
      },
    };
  },
  methods: {
    validate() {
      this.$refs.form.validate();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },

    // countDownChanged(dismissCountDown) {
    //   this.dismissCountDown = dismissCountDown;
    // },
    // showAlert() {
    //   this.dismissCountDown = this.dismissSecs;
    // },
    resetpassword() {
      if (this.validate) {
        console.log("peticion PUT/reset-password");
        console.log("email: " + this.user.email);
        this.axios
          .put("/reset-password", { email : this.user.pass})
          .then((res) => {
            // this.$store.commit(
            //   "showSnackbar",
            //   `Please check your email: ${this.user.email} and follow the instructions`
            // );
            // this.$router.push({ name: "Login" });
            console.log('res.data: ', res.data)
          })
          .catch((e) => {
            console.log("error", e);
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