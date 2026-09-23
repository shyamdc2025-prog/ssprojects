const cats=[["🍛","Biryani"],["🍕","Pizza"],["🍔","Burgers"],["🍜","Chinese"],["🥘","South Indian"],["🍗","Chicken"],["🥗","Healthy"],["🍰","Desserts"]];
const restaurants=[
{name:"Emmy Biryani House",cuisine:"Biryani • Indian",rating:4.6,time:"25-30 min",offer:"20% OFF",img:"https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=900&q=80",menu:[["Chicken Biryani","Fragrant basmati rice with chicken",249],["Mutton Biryani","Rich mutton biryani",329],["Paneer Biryani","Spiced paneer & rice",229]]},
{name:"Chennai Spice",cuisine:"South Indian • Meals",rating:4.5,time:"20-25 min",offer:"Free Delivery",img:"https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=900&q=80",menu:[["South Indian Meals","Rice, sambar, vegetables & sides",169],["Masala Dosa","Crispy dosa with potato masala",99],["Idli Vada","Soft idli with vada & chutney",89]]},
{name:"Pizza Corner",cuisine:"Pizza • Italian",rating:4.4,time:"30-35 min",offer:"Buy 1 Get 1",img:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80",menu:[["Margherita Pizza","Tomato, mozzarella & basil",249],["Farmhouse Pizza","Fresh vegetables & cheese",349],["Chicken Pizza","Chicken, cheese & herbs",399]]},
{name:"Royal Arabian Kitchen",cuisine:"Arabian • Chicken",rating:4.7,time:"30-40 min",offer:"15% OFF",img:"https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",menu:[["Chicken Shawarma","Tender chicken with sauces",159],["Grilled Chicken","Charcoal grilled chicken",299],["Arabian Rice","Aromatic rice with chicken",279]]},
{name:"Tasty Chinese",cuisine:"Chinese • Noodles",rating:4.3,time:"25-30 min",offer:"10% OFF",img:"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80",menu:[["Chicken Noodles","Wok-tossed noodles",199],["Veg Manchurian","Crispy vegetable balls",179],["Fried Rice","Chinese-style fried rice",169]]},
{name:"Fresh Bowl",cuisine:"Healthy • Salads",rating:4.6,time:"15-20 min",offer:"Healthy Combo",img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",menu:[["Fresh Salad Bowl","Greens, vegetables & dressing",189],["Protein Bowl","Rice, vegetables & protein",249],["Fruit Bowl","Seasonal fresh fruits",149]]}
];
let cart=JSON.parse(localStorage.getItem("emmyTastyCart")||"[]");
cats.forEach(([e,n])=>document.getElementById("cats").innerHTML+=`<button class="cat" onclick="filter('${n}')"><div>${e}</div>${n}</button>`);
function render(list=restaurants){let q=document.getElementById("search").value.toLowerCase();list=list.filter(r=>(r.name+" "+r.cuisine).toLowerCase().includes(q));document.getElementById("restaurants").innerHTML=list.map((r,i)=>`<article class="card"><img src="${r.img}" alt="${r.name}" loading="lazy"><div class="cardBody"><h3>${r.name}</h3><div class="meta"><span class="rating">★ ${r.rating}</span> • ${r.time}<br>${r.cuisine}</div><div class="offer">${r.offer}</div><div class="row"><b>From ₹${Math.min(...r.menu.map(x=>x[2]))}</b><button class="add" onclick="openRestaurant(${restaurants.indexOf(r)})">VIEW MENU</button></div></div></article>`).join("")||"<p>No restaurants found.</p>"}
function filter(x){document.getElementById("search").value=x;render();document.getElementById("restaurants").scrollIntoView({behavior:"smooth"})}
function allRestaurants(){document.getElementById("search").value="";render()}
function openRestaurant(i){let r=restaurants[i];document.getElementById("restaurantContent").innerHTML=`<h2>${r.name}</h2><div class="meta"><span class="rating">★ ${r.rating}</span> • ${r.time} • ${r.cuisine}</div><img class="menuImg" src="${r.img}"><h3>Menu</h3>${r.menu.map((m,j)=>`<div class="menuItem"><div><b>${m[0]}</b><small>${m[1]}</small><br><b>₹${m[2]}</b></div><button class="add" onclick="add(${i},${j})">ADD</button></div>`).join("")}`;document.getElementById("restaurantModal").classList.remove("hidden")}
function closeRestaurant(){document.getElementById("restaurantModal").classList.add("hidden")}
function add(ri,mi){let r=restaurants[ri],m=r.menu[mi],x=cart.find(x=>x.name===m[0]&&x.restaurant===r.name);if(x)x.qty++;else cart.push({name:m[0],price:m[2],restaurant:r.name,qty:1});save();showToast(m[0]+" added to cart")}
function save(){localStorage.setItem("emmyTastyCart",JSON.stringify(cart));updateCount()}
function updateCount(){document.getElementById("cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0)}
function openCart(){renderCart();document.getElementById("cartModal").classList.remove("hidden")}
function closeCart(){document.getElementById("cartModal").classList.add("hidden")}
function renderCart(){let sub=cart.reduce((a,x)=>a+x.price*x.qty,0),min=199;document.getElementById("cartItems").innerHTML=cart.length?cart.map((x,i)=>`<div class="menuItem"><div><b>${x.name}</b><small>${x.restaurant}</small><b>₹${x.price}</b></div><div><button class="add" onclick="qty(${i},-1)">−</button> ${x.qty} <button class="add" onclick="qty(${i},1)">+</button></div></div>`).join(""):"<p>Your cart is empty. Add something tasty!</p>";let delivery=sub?sub>=499?0:35:0,tax=Math.round(sub*.05),total=sub+delivery+tax;document.getElementById("itemTotal").textContent="₹"+sub;document.getElementById("deliveryFee").textContent=delivery?"₹"+delivery:"FREE";document.getElementById("tax").textContent="₹"+tax;document.getElementById("grandTotal").textContent="₹"+total;let ok=sub>=min;document.getElementById("minimumMsg").textContent=cart.length&& !ok?`Minimum order value is ₹${min}. Add ₹${min-sub} more to continue.`:"";document.getElementById("checkoutBtn").disabled=!ok}
function qty(i,d){cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);save();renderCart()}
async function checkout(){
  if(!cart.length) return showToast("Cart is empty");
  const subtotal=cart.reduce((a,x)=>a+x.price*x.qty,0);
  if(subtotal<199) return showToast("Minimum order is ₹199");
  const btn=document.getElementById("checkoutBtn");
  btn.disabled=true; btn.textContent="Creating secure order...";
  try{
    const res=await fetch("/api/create-order",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({items:cart})
    });
    const data=await res.json();
    if(!res.ok) throw new Error(data.error||"Could not create Razorpay order");

    closeCart();
    const options={
      key:data.keyId,
      amount:data.amount,
      currency:data.currency,
      name:"EmmyTasty",
      description:"Food order",
      order_id:data.orderId,
      prefill:{name:"EmmyTasty Customer"},
      theme:{color:"#ff5a1f"},
      handler:async function(response){
        try{
          const verify=await fetch("/api/verify-payment",{
            method:"POST",headers:{"Content-Type":"application/json"},
            body:JSON.stringify(response)
          });
          const result=await verify.json();
          if(!verify.ok || !result.verified) throw new Error(result.error||"Payment verification failed");
          cart=[];save();showToast("🎉 Payment successful! Order confirmed.");
        }catch(e){showToast(e.message)}
      },
      modal:{ondismiss:function(){showToast("Payment cancelled")}}
    };
    if(!window.Razorpay) throw new Error("Razorpay Checkout failed to load");
    new Razorpay(options).open();
  }catch(e){
    showToast(e.message);
  }finally{
    btn.disabled=false; btn.textContent="Proceed to payment";
  }
}
function closePayment(){document.getElementById("paymentModal").classList.add("hidden")}
function pay(method){showToast("Select Proceed to payment for secure Razorpay checkout") }
function focusSearch(){document.getElementById("search").focus();scrollTo({top:0,behavior:"smooth"})}
function scrollTopPage(){scrollTo({top:0,behavior:"smooth"})}
function showToast(s){let t=document.getElementById("toast");t.textContent=s;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
updateCount();render();