<template>
    <v-menu
      bottom
      left
    >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            color="white"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list-item-group>
        <v-list>
          <router-link  to="/">
            <v-list-item
              v-if="!isActive"
            > 
              <v-list-item-icon>
                <v-icon>
                  mdi-login
                </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                Login
              </v-list-item-title>
            </v-list-item>
          </router-link>

          <router-link  to="/signup">
            <v-list-item
              v-if="!isActive"
            > 
              <v-list-item-icon>
                <v-icon>
                  mdi-account-plus
                </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                Register
              </v-list-item-title>
            </v-list-item>
          </router-link>

            <v-list-item
              v-if="isActive"
              @click="closeSesion()"
            > 
              <v-list-item-icon>
                <v-icon>
                  mdi-exit-run
                </v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                Exit
              </v-list-item-title>
            </v-list-item>
        </v-list>
        </v-list-item-group>
      </v-menu>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
  export default {
    name: 'RigthSideToolbar',
    data (){ 
      return {
      }
    },
    computed: {
      // ...mapState(['userDB, token']),
      ...mapGetters(['isActive'])
    },
    methods: {
      ...mapActions(['closeSesion']),
    }
  }
</script>