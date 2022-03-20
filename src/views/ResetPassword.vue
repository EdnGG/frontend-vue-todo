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
              @click="resetpassword()"
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
      // nameRules: [
      //   (v) => !!v || "Name is required",
      //   (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
      // ],
      // email: "",
      // emailRules: [
      //   (v) => !!v || "E-mail is required",
      //   (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      // ],

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
        resetLink: "",
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
    resetpassword() {
      if (this.validate) {
        // Cleaning token for URL
        const resetLink = this.$route.params.resetLink.replace(/["_"]+/g, ".");
        console.log("ResetLink from frontend: ", resetLink);
        this.axios
          .put(`/reset-password/${this.$route.params.resetLink}`, {
            pass: this.user.pass,
            // sending token already cleaned to the backend
            resetLink: resetLink,
          })
          .then((res) => {
            const data = res.data;
            this.$store.commit("showSnackbar", `Password changed correctly`);
            this.$router.push({ name: "Login" });
            console.log("res.data: ", res.data);
          })
          .catch((e) => {
            console.log("error", e);
          });
      }
    },
  },
};
</script>

<style>
</style>