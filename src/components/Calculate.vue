<template>
  <v-card class="mx-auto pa-5" height="100%">
    <h1>สินค้าในตระกร้า</h1>
    <v-divider></v-divider>
    <v-list>
      <v-list-item-group class="shiba-calculate-order">
        <v-list-item three-line v-for="item in carts" :key="item.id">
          <v-list-item-avatar>
            <v-img :src="item.cover"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
            <v-list-item-subtitle>
              จำนวน: {{ item.qty }} ราคาต่อชิ้น: {{ item.price }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              ราคารวม {{ item.qty * item.price }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-icon>
            <v-btn color="success" fab small>
              <v-icon @click="addQty(item.id)" color="light">mdi-plus</v-icon>
            </v-btn>
            <v-btn color="warning" fab small>
              <v-icon @click="minusQty(item.id)" color="light"
                >mdi-minus</v-icon
              >
            </v-btn>
            <v-btn color="error" fab small>
              <v-icon @click="removeProduct(item.id)" color="light"
                >mdi-delete</v-icon
              >
            </v-btn>
          </v-list-item-icon>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-divider></v-divider>
    <div>
      <h1>ราคารวมทั้งหมด</h1>
      <h3 class="text-right">{{ totalPrice }} -</h3>
      <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on }">
          <v-btn v-if="!carts" color="red lighten-2" v-on="on" block disabled>
            ยืนยันชำระเงิน
          </v-btn>
          <v-btn
            v-else-if="carts == ''"
            color="red lighten-2"
            v-on="on"
            block
            disabled
          >
            ยืนยันชำระเงิน
          </v-btn>
          <v-btn v-else color="red lighten-2" v-on="on" block dark>
            ยืนยันชำระเงิน
          </v-btn>
        </template>

        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            ยอดรวมทั้งหมด: {{ totalPrice }}
          </v-card-title>

          <v-card-text>
            <v-text-field
              v-model="totalPay"
              label="เงินที่ชำระ"
              type="number"
            ></v-text-field>
            <div v-if="totalPay >= totalPrice">
              <h3>เงินทอน {{ totalPay - totalPrice }}</h3>
              <v-btn
                @click="confirmPurchase()"
                class="mt-2"
                block
                color="primary"
              >
                ยืนยัน
              </v-btn>
            </div>
            <div v-else>
              <h3>กรุณาชำระเงินมากกว่า หรือ เท่ากับ {{ totalPrice }}</h3>
              <v-btn class="mt-2" block color="primary" disabled>
                ยืนยัน
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog2" width="500">
        <v-card>
          <v-card-title class="headline success lighten-2" primary-title>
            การชำระเงินสำเร็จ
          </v-card-title>
          <v-card-text class="pa-5">
            <h3>เงินทอน: {{ totalPay - totalPrice }} บาท</h3>
            <v-btn @click="success()" class="mt-2" block color="primary">
              ยืนยัน
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </v-card>
</template>

<style scoped>
.shiba-calculate-order {
  min-height: 620px;
}
</style>

<script>
export default {
  mounted() {
    this.carts = JSON.parse(this.$ls.get("mycart"));
    var _this = this;
    this.$ls.on("mycart", function(val) {
      _this.carts = JSON.parse(val);
    });
  },
  data() {
    return {
      carts: [],
      empty: [],
      diffArr: [],
      plusArr: [],
      eachDiscount: [],
      totalPay: 0,
      dialog: false,
      dialog2: false,
    };
  },
  methods: {
    confirmPurchase() {
      this.dialog = false;
      this.dialog2 = true;
    },
    success() {
      this.dialog2 = false;
      this.totalPay = 0;
      this.$ls.remove("mycart");
      this.carts = [];
      this.$ls.set("mycart", JSON.stringify(this.carts));
    },
    removeProduct(id) {
      let mycart = JSON.parse(this.$ls.get("mycart"));
      for (var i = 0; i < mycart.length; i++) {
        if (mycart[i].id === id) {
          mycart.splice(i, 1);
          break;
        }
      }
      this.$ls.set("mycart", JSON.stringify(mycart));
    },
    addQty(id) {
      let thisProduct = JSON.parse(this.$ls.get("mycart")).findIndex(
        (el) => el.id === id
      );
      this.carts.splice(thisProduct);
      let mycart = JSON.parse(this.$ls.get("mycart"));
      for (var i = 0; i < mycart.length; i++) {
        if (mycart[i].id === id) {
          mycart[i].qty++;
          break;
        }
      }
      this.$ls.set("mycart", JSON.stringify(mycart));
    },
    minusQty(id) {
      let thisProduct = JSON.parse(this.$ls.get("mycart")).findIndex(
        (el) => el.id === id
      );
      this.carts.splice(thisProduct);
      let mycart = JSON.parse(this.$ls.get("mycart"));
      for (var i = 0; i < mycart.length; i++) {
        if (mycart[i].id === id) {
          if (mycart[i].qty == 1) {
            mycart.splice(i, 1);
            break;
          } else {
            mycart[i].qty--;
            break;
          }
        }
      }
      this.$ls.set("mycart", JSON.stringify(mycart));
    },
  },
  computed: {
    totalPrice: function() {
      let total = 0;
      for (let p of this.carts) {
        total += p.price * p.qty;
      }
      return total;
    },
    // discount: function() {
    //   let discount = 0;
    //   if (this.$ls.get("mycart")) {
    //     let all = JSON.parse(this.$ls.get("mycart"));
    //     let allQty = all.map(({ qty }) => qty);
    //     let sortQty = allQty.sort(function(a, b) {
    //       return b - a;
    //     });

    //     for (let i = 0; i < sortQty.length - 1; i++) {
    //       let diff = sortQty[i] - sortQty[i + 1];
    //       this.diffArr.push(diff);
    //     }

    //     console.log(this.diffArr);

    //     for (let i = 0; i < this.diffArr.length; i++) {
    //       this.eachDiscount.push(
    //         this.diffArr[i] * this.plusArr[i] * ((10 + i) / 100)
    //       );
    //     }
    //   }
    //   return discount;
    // },
  },
};
</script>
