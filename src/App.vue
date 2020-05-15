<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        Shiba Book Shop
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <v-row>
          <v-col md="8">
            <v-row>
              <v-col  md="3" v-for="product in products">
                <products
                  :info="product"
                  :cover="product.cover"
                  :price="product.price"
                  >{{ product.title }}</products
                >
              </v-col>
            </v-row>
          </v-col>
          <v-col md="4" class="shiba-calculate">
            <calculate></calculate>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<style scoped>
.shiba-calculate {
  height: 850px;
}
</style>

<script>
import axios from "axios";
export default {
  mounted() {
    this.getProductLists();
  },
  data() {
    return {
      products: {},
    };
  },
  methods: {
    getProductLists() {
      axios
        .get(
          "https://api.jsonbin.io/b/5e69b564d2622e7011565547?fbclid=IwAR0xt2UcHn2cqtZZ6Rt7-4SA3gtbp-OTglbMbX88mF1Fd9aepDtKb787URo"
        )
        .then((response) => {
          this.products = response.data.books;
        });
    },
  },
};
</script>
