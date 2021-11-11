<template>
  <div class="d-flex flex-wrap">
    <v-card
      v-for="(product, index) in products"
      :key="index"
      :loading="loading"
      class="mx-auto my-12"
      max-width="374"
    >
      <template slot="progress">
        <v-progress-linear
          color="deep-purple"
          height="10"
          indeterminate
        ></v-progress-linear>
      </template>
      <v-img height="250" :src="product.images[0]"></v-img>

      <v-card-title> {{ product.name }} </v-card-title>

      <v-card-text>
        <!-- <div class="my-4 text-subtitle-1">$ • Italian, Cafe</div> -->

        <div>
          Small plates, salads & sandwiches - an intimate setting with 12 indoor
          seats plus patio seating.
        </div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-actions>

        <!-- <div>
          <stripe-checkout
            ref="checkoutRef"
            mode="subscription"
            :pk="publishableKey"
            :line-items="lineItems"
            :success-url="successURL"
            :cancel-url="cancelURL"
            @loading="(v) => (loading = v)"
          />
          <button @click="submit">Subscribe!</button>
        </div> -->

        <v-btn color="deep-purple lighten-2" text @click="submit">
          Donate
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { StripeCheckout } from "@vue-stripe/vue-stripe";

export default {
  components: {
    StripeCheckout,
  },
  data() {
    return {
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_KEY_STRIPE_SECRET_KEY}`,
        },
      },

      products: [],
      prices: [],

      // lineItems: [
      //   {
      //     price: 'some-price-id', // The id of the recurring price you created in your Stripe dashboard
      //     quantity: 1,
      //   },
      // ],

      loading: false,
      selection: 1,

      cancelURL: "http://localhost:8080",
    };
  },
  methods: {
    getProducts() {
      Promise.all([
        fetch("https://api.stripe.com/v1/products", this.fetchOptions),
        fetch("https://api.stripe.com/v1/prices", this.fetchOptions),
      ])
        .then((responses) => Promise.all(responses.map((res) => res.json())))
        .then((json) => {
          // console.log('respuesta de stripe: ', json)
          this.products = json[0].data;
          this.prices = json[1].data;
        //   console.log("products: ", this.products);
        //   console.log("prices: ", this.prices);
        })
        .catch((err) => console.log(err));
    },
    reserve() {
      this.loading = true;

      setTimeout(() => (this.loading = false), 2000);
    },
    // submit () {
    //   // You will be redirected to Stripe's secure checkout page
    //   this.$refs.checkoutRef.redirectToCheckout();
    // },
    submit() {
      // You will be redirected to Stripe's secure checkout page
      Stripe(process.env.VUE_APP_KEY_STRIPE_PUBLIC_KEY).redirectToCheckout({
        lineItems: [{ price, quantity: 1 }],
        mode: "subscription",
        successUrl: "https://vue-vuetify-todo.herokuapp.com",
        cancelUrl: "https://vue-vuetify-todo.herokuapp.com",
      });
    },
  },
  created() {
    this.getProducts();
  },
};
</script>

