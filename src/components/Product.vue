<template>
  <v-card class="mx-auto" max-width="400">
    <v-img class="white--text align-end" height="200px" :src="cover"> </v-img>
    <v-card-title><slot></slot></v-card-title>
    <v-card-subtitle class="pb-0">ราคา {{ price }} บาท</v-card-subtitle>

    <v-card-actions>
      <v-btn @click="addProduct(info)" color="success" block>
        หยิบใส่ตระกร้า
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ["info", "cover", "price"],
  data() {
    return {
      cart: [],
    };
  },
  methods: {
    addProduct(info) {
      info.qty = 1;
      if (this.$ls.get("mycart")) {
        if (
          JSON.parse(this.$ls.get("mycart")).find((el) => el.id === info.id)
        ) {
          let thisProduct = JSON.parse(this.$ls.get("mycart")).find(
            (el) => el.id === info.id
          );
          let mycart = JSON.parse(this.$ls.get("mycart"));
          for (var i = 0; i < mycart.length; i++) {
            if (mycart[i].id === thisProduct.id) {
              mycart[i].qty++;
              break;
            }
          }
          this.$ls.set("mycart", JSON.stringify(mycart));
        } else {
          this.cart = JSON.parse(this.$ls.get("mycart"));
          this.cart.push(info);
          this.$ls.set("mycart", JSON.stringify(this.cart));
        }
      } else {
        this.cart.push(info);
        this.$ls.set("mycart", JSON.stringify(this.cart));
      }
    },
  },
};
</script>
