<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      :mobile-breakpoint="768"
      app
    >
 
      <v-img
        class="pa-4 pt-7"
        height="190"
        src="space.jpg"
        gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"
      >
        <v-avatar
          size="70"
          class="mb-2"
        >
          <img
            v-if="userDB"
            :src="userDB.image ? userDB.image : defaultImage "
            alt="User Avatar"
          >
          <img
            v-if="!userDB"
            :src="defaultImage"
            alt="User Avatar"
          >
        </v-avatar>
        <div v-if="userDB">
          <div class="white--text text-subtitle-1 font-weight-bold">{{ userDB.name ? userDB.name : ''}}</div>
          <div class="white--text text-subtitle-2">{{ userDB.email ? userDB.email : ''}}</div>
        </div>
        <div v-if="!userDB">
          <div class="white--text text-subtitle-1 font-weight-bold"></div>
          <div class="white--text text-subtitle-2"></div>
        </div>
      </v-img>

      <v-list
        v-if="isActive"
        dense
        nav
      >
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.to"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="#primary"
      dark
      prominent
      src="space.jpg"
      :height="$route.path === '/todo' ? 220 : 190 "
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(19,84,122,.9), rgba(128,208,199,.9)"
        ></v-img>
      </template>

      <v-container class="header-container pa-0">

        
        <v-row>

          <v-app-bar-nav-icon 
            v-if="$route.path === '/todo' ||
            $route.path === '/profile' ||
            $route.path === '/about'  ||
            $route.path === '/stripe' "
            @click="drawer = !drawer"
          ></v-app-bar-nav-icon>
          <v-spacer></v-spacer>
          <search v-if="$route.path === '/todo'" />
          <rigth-side-toolbar />
        </v-row>


        <v-row>
          <v-app-bar-title class="ml-4 text-h4">
            <!-- {{ $store.state.appTitle || "TaskAmazing!!" }} -->
           Todos
          </v-app-bar-title>
        </v-row>
        <v-row id="row__tools">
          <live-date-time />
          <local-weather />
        </v-row>
      
        <v-row v-if="$route.path === '/todo' ">
          <field-add-task />
        </v-row>

      </v-container>

    </v-app-bar>

    <v-main>
      <router-view></router-view>
      <snackbar />
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  components: {
    "field-add-task": require("@/components/Todo/FieldAddTask.vue").default,
    snackbar: require("@/components/Shared/Snackbar.vue").default,
    search: require("@/components/Tools/Search.vue").default,
    "live-date-time": require("@/components/Tools/LiveDateTime.vue").default,
    "rigth-side-toolbar": require("@/components/Tools/RigthSideToolbar.vue")
      .default,
    "local-weather": require("@/components/Tools/LocalWeather.vue").default,
  },
  data: () => ({
    defaultImage: "https://lenguajejs.com/javascript/logo.svg",
    drawer: false,
    items: [
      { title: "Todo", icon: "mdi-format-list-checks", to: "/todo" },
      { title: "About", icon: "mdi-help-box", to: "/about" },
      { title: "Profile", icon: "mdi-emoticon-cool-outline", to: "/profile" },
      { title: "Stripe API", icon: "mdi-cart", to: "/stripe" },
    ],
  }),
  mounted() {
    if (this.isActive) {
      this.$store.dispatch("getUserTasks");
    }
  },
  computed: {
    ...mapState(["userDB", "weather"]),
    ...mapGetters(["isActive"]),
    // appTitle() {
    //   return process.env.VUE_APP_TITLE
    // }
  },
};
</script>

<style lang="sass">
.header-container
  max-width: none !important
#row__tools
  display: flex
  justify-content: space-between
  align-items: center
  margin-right: 20px
</style>
