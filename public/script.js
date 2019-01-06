const PRICE=9.99;
const LOAD_NUM=10;
new Vue({
el:'#app',
data:{
    total:3.7 ,
    items:[
        
    ],
    cart:[],
    newsearch:'anime',
    lastsearch:'',
    loading:false,
    price:PRICE,
    results:[]
},
methods:{
    AddItem(index){
        this.total =0;
        let item =this.items[index];

       
        let exist=false;
        for (let i = 0; i < this.cart.length; i++) {
              if (this.cart[i].id===item.id) {
                  this.cart[i].qty++;
                  exist=true;
                  break;
              }
            
        }
        if (!exist) {
            this.cart.push({
                id: item.id,
                title: item.title,
                qty: 1,
                price: PRICE
            });
        }

          this.cart.forEach(item => {
            this.total += item.qty *item.price;
        });
    },
    inc(item){
       item.qty++;
       this.total=0;
         this.cart.forEach(item => {
             this.total += item.qty * item.price;
         });
    },
    dec(item){
     this.total=0;
        if (item.qty==1) {
            item.qty=0;
             this.total -= 1 * item.price;
            _.remove(this.cart,(elem) =>{
               return  elem.id===item.id;
            });
          
        }else{
            item.qty--;
            
        }
        
         this.cart.forEach(item => {
             this.total += item.qty * item.price;
         });
         
    
    },
    onSubmit(e){
        this.items=[];
        this.results=[];
        this.loading=true;
       this.$http.get('/search/'.concat(this.newsearch))
       .then((resp) =>{
           this.results = resp.data;
           this.appendItems();
         this.lastsearch=this.newsearch;
         this.loading=false;
       },
       (err) =>{

       }
       );      
       
    },
    appendItems(){
       if (this.items.length <this.results.length) {
           let append = this.results.splice(this.items.length, 
            this.items.length + LOAD_NUM);
            this.items= this.items.concat(append);
       }
    }

},
filters :{
    currency(price){
        return "$".concat(price.toFixed(2));
    }
},
mounted() {
    this.onSubmit();

    let elem = document.getElementById('product-list-bottom');
    let watcher = scrollMonitor.create(elem);
    watcher.enterViewport(() => {
       this.appendItems(); 
    });
},
});
