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
      <v-card-title> Price: {{ getPrice(product.id) }} </v-card-title>

      <v-card-text>
        <div class="my-4 text-subtitle-1"></div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-actions>
        <v-btn
          v-model="selected"
          value=""
          color="deep-purple lighten-2"
          text
          @click="submit(product.id)"
        >
          Donate
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_KEY_STRIPE_SECRET_KEY}`,
        },
      },

      selected: [],
      products: [],
      prices: [],

      // price: '',
      quantity: 1,

      loading: false,
      selection: 1,
    };
  },
  computed: {
    getPrice3(id) {
      let res = 0;
      this.prices.find((el) => {
        if (el.product === id) {
          res += el.unit_amount;
        }
      });
      return res;
    },
  },
  methods: {
    currencyFormat(res) {
      return `$${res.slice(1, -2)}.${res.slice(-2)}`;
    },
    getPrice(id) {
      let res = 0;
      let currency = "";

      this.prices.find((el) => {
        if (el.product === id) {
          res += el.unit_amount_decimal;
          currency = el.currency;
        }
      });

      return `${this.currencyFormat(res)} ${currency}`;
    },
    getProducts() {
      Promise.all([
        fetch("https://api.stripe.com/v1/products", this.fetchOptions),
        fetch("https://api.stripe.com/v1/prices", this.fetchOptions),
      ])
        .then((responses) => Promise.all(responses.map((res) => res.json())))
        .then((json) => {
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
    submit(id) {
      let productPriceId = "";
      this.prices.find((el) => {
        if (el.product === id) {
          productPriceId += el.id;
        }
      });
      // You will be redirected to Stripe's secure checkout page
      Stripe(process.env.VUE_APP_KEY_STRIPE_PUBLIC_KEY).redirectToCheckout({
        lineItems: [{ price: productPriceId, quantity: 1 }],
        mode: "subscription",
        successUrl: "https://vue-vuetify-todo.herokuapp.com",
        // successUrl: "http://localhost:8080",
        cancelUrl: "https://vue-vuetify-todo.herokuapp.com",
      });
    },
  },
  mounted() {
    this.getProducts();
  },
};
</script>

