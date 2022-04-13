<template>
  <v-container>
    <v-row class="mb-8 pa-8" justify="center">
      <v-col lg="8">
        <v-container justify="center" class="d-flex justify-center">
          <h1>Login</h1>
        </v-container>
        <v-form ref="form" v-model="valid" lazy-validation>
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
            @keyup.enter="login"
            name="input-10-2"
            label="Password"
            hint="At least 8 characters"
            required
          ></v-text-field>

          <div class="d-flex align-end flex-column" style="margin-top: -5px">
            <router-link :to="{ name: 'ForgotPassword' }">
              Forgot Password?
            </router-link>
          </div>

          <v-container justify="center" class="d-flex justify-center my-12">
            <v-btn
              :disabled="!valid"
              color="success"
              class="mr-4"
              @click="login"
            >
              Login
            </v-btn>
            <v-btn color="warning" @click="resetValidation">
              Reset Validation
            </v-btn>
          </v-container>
        </v-form>

        <v-container justify="center" class="d-flex justify-center my-12">
          <GoogleLogin
            :params="params"
            :renderParams="renderParams"
            :onSuccess="onSuccess"
            :onFailure="onFailure"
          ></GoogleLogin>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import GoogleLogin from "vue-google-login";

export default {
  components: {
    GoogleLogin,
  },
  data() {
    return {
      valid: true,
      name: "",
      show4: false,
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
      },
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
      ],
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],

      params: {
        client_id: process.env.VUE_APP_KEY_GOOGLE_CLIENT_ID,
      },

      message: {
        color: "",
        text: "",
      },
      renderParams: {
        width: 250,
        height: 50,
        longtitle: true,
      },
      id_token: "",
      user: {
        email: "",
        pass: "",
      },
    };
  },

  methods: {
    validate() {
      return this.$refs.form.validate();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    ...mapActions(["guardarUsuario"]),

    onFailure(onFailure) {
      console.log("Autentication failure", onFailure);
    },
    onSuccess(googleUser) {
      // This only gets the user information: id, name, imageUrl and email

      this.id_token = googleUser.getAuthResponse().id_token;
      this.axios
        .post("/google", { id_token: this.id_token })
        .then((res) => {
          const data = res.data;
          this.user = data;
          this.guardarUsuario(data);
          this.$router.push({ name: "Todo" });
        })
        .catch((e) => {
          this.message.text = e.response.data.msg;
          this.message.color = "danger";
          this.showAlert();
        });
    },
    login() {
      try {
        if (this.validate()) {
          this.axios
            .post("/login", this.user)
            .then((res) => {
              const data = res.data;
              this.guardarUsuario(data);
              this.$store.dispatch("getUserTasks");
              this.$router.push({ name: "Todo" });
            })
            .catch((e) => {
              this.$store.commit("showSnackbar", `${e.response.data.message}`);
            });
        } else {
          throw new Error("Form is not valid");
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style></style>
