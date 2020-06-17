var eventBus = new Vue()

// PRODUCT
Vue.component('product', {
   props: {
      premium: {
         type: Boolean,
         required: true
      }
   },
   template: `
   <div class="product">

   <a :href="image" target="_blank" class="product-image">

         <img :src="image" alt="">

         </a>

   <div class="product-info">
      <h1>{{title}}</h1>
      <product-details :details="details"></product-details>

      <p v-if="inStock">In Stock</product-details>
      <p :class="{outOfStock: !inStock}" v-else="!instock">Out Of Stock</p>
      

      <div class="shopping-types">
   
         <div v-for="(variant,index) in variants" :key="variant.variantId" class="color-box"
               :style="{backgroundColor: variant.variantColor}" @click="updateProduct(index)">
         </div>
      
      
         <button @click="addToCart" :disabled="!inStock" :class="{disabledButton: !inStock}">Add to
            cart</button>

         <button @click="removeFromCart" :disabled="!inStock" :class="{disabledButton: !inStock}">Remove from
            cart</button>
      </div>
   </div>

   <product-tabs :reviews="reviews" :shipping="shipping" :details="details"></product-tabs>



</div>
   `,
   data() {
      return {
         product: 'Socks',
         brand: 'VuEcommerce:',
         selectedVariant: 0,
         onSale: true,
         details: ['80% cotton', '20% polyester', 'Gender-neutral'],
         variants: [
            {
               variantId: 2234,
               variantColor: 'green',
               variantImage: './vmSocks-green-onWhite.jpg',
               variantQuantity: 10
            },
            {
               variantId: 2235,
               variantColor: 'blue',
               variantImage: './blue-socks.png',
               variantQuantity: 0
            }
         ],
         reviews: []
      }
   },
   methods: {
      addToCart() {
         this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
      },
      removeFromCart() {
         this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
      },
      updateProduct(index) {
         this.selectedVariant = index
      }
   },
   computed: {
      title() {
         return this.brand + ' ' + this.product
      },
      image() {
         return this.variants[this.selectedVariant].variantImage
      },
      inStock() {
         return this.variants[this.selectedVariant].variantQuantity
      },
      shipping() {
         if (this.premium) return `free`;
         else return `$2.99`;
      }
   },
   mounted() {
      eventBus.$on('review-submitted', productReview => {
         this.reviews.push(productReview);
      })
   }
});

// PRODUCT REVIEW
Vue.component('product-review', {
   template: `
   <div class="form-container">
  

   <form class="review-form" @submit.prevent="onSubmit">
   <p v-if="errors.length > 0">
   You must fill in all fields.
      <ul>
         <li v-for="error in errors"> {{error}}</li>
      </ul>
   </p>

   <p>
     <label for="name">Name:</label>
     <input id="name" v-model="name" placeholder="name">
   </p>
   
   <p>
     <label for="review">Review:</label>      
     <textarea id="review" v-model="review"></textarea>
   </p>

   <p>
     <label for="rating">Rating:</label>
     <select id="rating" v-model.number="rating">
       <option>5</option>
       <option>4</option>
       <option>3</option>
       <option>2</option>
       <option>1</option>
     </select>
   </p>

   <p>
      <label for="recommend">Would you recommend this product?</label>
      <select id="recommend" v-model="recommend">
         <option>Yes</option>
         <option>No</option>
      </select>
   </p>

   <p>
     <input type="submit" value="Submit">  
   </p>    
 
 </form>
 </div>
   `,
   data() {
      return {
         name: null,
         review: null,
         rating: null,
         recommend: "Yes",
         errors: []
      }
   },
   methods: {
      onSubmit() {
         let productReview = {
            name: this.name,
            review: this.review,
            rating: this.rating
         };
         if (this.name && this.review && this.rating) {
            eventBus.$emit('review-submitted', productReview)
            this.name = null;
            this.review = null;
            this.rating = null;
         } else {
            if (this.errors.length >= 3) return;
            if (!this.name) this.errors.push("Name required");
            if (!this.review) this.errors.push("Review required");
            if (!this.rating) this.errors.push("Rating required");
         }
      }
   }
});

// PRODUCT TABS
Vue.component('product-tabs', {
   props: {
      reviews: {
         type: Array,
         required: true
      },
      shipping: {
         type: String,
         required: true
      },
      details: {
         type: Array,
         required: true
      }
   },
   template: `
      <div class="reviews">
         <span class="tab"
            :class="{activeTab: selectedTab === tab}"
            v-for="(tab, index) in tabs" :key="index"
            @click="selectedTab = tab">{{ tab }}</span>


         <div v-show="selectedTab === 'Reviews'">
            <h2>Reviews</h2>
            <p v-if="reviews.length == 0">There are no reviews yet.</p>
            <ul>
               <div v-for="review in reviews">
                  <h4>User: {{review.name}}</h4>
                  <p>{{review.review}}</p>
                  <p><small>{{review.rating}} Stars</small></p>
               </div>
            </ul>
         </div>
      
         <product-review v-show="selectedTab === 'Make a Review'"></product-review>

         <p v-show="selectedTab === 'Shipping'"> Shipping {{shipping}}</p>

         <div class="details-container" v-show="selectedTab === 'Details'">
            <ul 
               
               v-for="detail in details"
               
            >
            
                  <li>
                     {{detail}}
                  </li>
            
            </ul>
         </div>
      </div>
   `,
   data() {
      return {
         tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
         selectedTab: 'Reviews'
      }
   }
})

Vue.component('product-details', {
   props: {
      details: {
         type: Array,
         required: true
      }
   },
   template: `
   <ul>
   <li v-for="detail in details">
      {{detail}}
   </li>
</ul>
`
})

var app = new Vue({
   el: '#app',
   data: {
      premium: false,
      cart: []
   },
   methods: {
      updateCart(id) {
         this.cart.push(id);
      },
      removeItemFromCart(id) {
         if (this.cart.length === 0) return;

         for (let index = 0; index < this.cart.length; index++) {
            if (this.cart[index] === id) return this.cart.splice(index, 1);
         }
      }
   }
})