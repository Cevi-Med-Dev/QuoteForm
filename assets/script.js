const regExpObject = {
  fName: "^([A-ZÁÉÍÓÚ]{1}[a-zñáéíóú]+[s]*)+$",
  lName: "^([A-ZÁÉÍÓÚ]{1}[a-zñáéíóú]+[s]*)+$",
  phone: "^[0-9()-]+$",
  email: "[a-zA-Z0-9._-]+@[a-zA-Z]+.+com",
  address: "[A-Za-z0-9'.-s,]",
  zCode: "^[0-9]{5}(?:-[0-9]{4})?$",
  city: "^[a-zA-Z',.s-]{1,25}$",
  state: "^[a-zA-Z',.s-]{1,25}$",
  country: "^[a-zA-Z',.s-]{1,25}$",
};
let currentView = 1;
let shippingArray = [];
let quoteArray = JSON.parse(localStorage.getItem("quoteItems")) || [];
let error = (input) => {
  input.classList.add("error");
  input.nextElementSibling.innerHTML = `<img src="./icon-error.svg"/ class="errorImg"> ${input.placeholder} is Invalid`;
  input.nextElementSibling.style.display = "flex";
  document.getElementById("next").disabled = true;
};
let approved = (input) => {
  input.classList.remove("error");
  input.nextElementSibling.style.display = "none";
  document.getElementById("next").disabled = Array.from(
    document.querySelectorAll("#formContainer .errorText")
  ).some((errMsg) => errMsg.style.display === "flex");
};

let getData = () => {
  console.log("getData executed");
  let CM = Math.floor(Math.random() * (2224 - 2258 + 1)) + 2228;
  fetch(
    `https://searchserverapi.com/getwidgets?api_key=5c9E0E4f0q&q=cm${CM}&maxResults=12&startIndex=0&items=true&pages=true&facets=false&categories=true&suggestions=true&vendors=false&tags=false&pageStartIndex=0&pagesMaxResults=10&categoryStartIndex=0&categoriesMaxResults=10&suggestionsMaxResults=4&CustomerGroupId=0&recentlyViewedProducts=&recentlyAddedToCartProducts=&recentlyPurchasedProducts=&vendorsMaxResults=3&tagsMaxResults=3&output=jsonp&callback=jQuery3600586473215199615_1719243771726&_=1719243771727`
  )
    .then((response) => response.text())
    .then((data) => {
      first_subs = data.substring(40);
      data = first_subs.substring(0, first_subs.length - 2);
      return JSON.parse(data);
    })
    .then((data) => {
      !quoteArray.some(
        (item) => data.items[0].product_id === item.product_id
      ) && quoteArray.push(...data.items);
    });
  document.getElementById("quotedItemsList").innerHTML = "";
  quoteArray.forEach((item) => {
    document.getElementById("quotedItemsList").innerHTML += `
      <aside id="item">
        <div id="imgContainer">
            <img src=${item.image_link} alt="product image">
        </div>
        <div id="itemDetails">
            <h4>${item.title}</h4>
            <aside>
              <span> Original Price ${item.list_price}...</span>
              <br/>
              <p>${item.description.substr(0, 100)}...</p>
              <br/>
              <a href=${item.link}> Product Details </a>
            </aside>
        </div>
        <div id="quoteBtns">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" fill="none" xmlns:v="https://vecta.io/nano"><path d="M1 4h16m-4 0l-.271-.812c-.262-.787-.393-1.18-.637-1.471a2 2 0 0 0-.802-.578C10.938 1 10.523 1 9.694 1H8.306c-.829 0-1.244 0-1.597.139a2 2 0 0 0-.802.578c-.243.291-.374.684-.637 1.471L5 4m10 0v10.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C12.72 19 11.88 19 10.2 19H7.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C3 16.72 3 15.88 3 14.2V4m8 4v7M7 8v7" stroke="#c40c11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <button class="qtyBtn">-</button>
            <small>${item.quantity}</small>
            <button class="qtyBtn">+</button>
        </div>
      </aside>`;
  });

  return quoteArray;
};

document.getElementById("quoteTrigger").addEventListener("click", () => {
  document.getElementById("formContainer").style.display = "flex";
  let newItem = getData();
  console.log(newItem);
  localStorage.setItem("quoteItems", JSON.stringify(newItem));
});

JSON.parse(localStorage.getItem("quoteItems"));
document.getElementById("next").addEventListener("click", () => {
  if (currentView === 1) {
    document.querySelector(".active").classList.remove("active");
    document.querySelector("li#step2").classList.add("active");
    document.querySelector("#formHeader h4").innerText =
      "Please fill out  Shipping Information ";
    document.querySelector("#formHeader img").src = "./2.svg";
    document.getElementById("viewSwitch").innerHTML = `<div class="fields">
                <div>
                    <label for="fName">First name:</label>
                    <input type="text" id="fname" name="fName" placeholder="First name">
                    <span class="errorText" style="display: none"></span>
                </div>
                <div>
                    <label for="lName">Last name:</label>
                    <input type="text" id="lName" name="lName" placeholder="Last name">
               <span class="errorText" style="display: none"></span>
                    </div>
            </div>
            <div class="fields">
                <div>
                    <label for="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone" placeholder="Phone Number">
               <span class="errorText" style="display: none"></span>
                    </div>
                <div>
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="Email Address">
               <span class="errorText" style="display: none"></span>
                    </div>
            </div>
            <div class="fields">
                <div>
                    <label for="address"> Shipping Address</label>
                    <input type="text" id="address" name="address" placeholder="Address">
               <span class="errorText" style="display: none"></span>
                    </div>
            </div>
            <div class="fields">
                <div>
                    <label for="zCode">Zip Code</label>
                    <input type="number" id="zCode" name="zCode" placeholder="Zip Code ">
               <span class="errorText" style="display: none"></span>
                    </div>
                <div>
                    <label for="city"> City</label>
                    <input type="text" id="city" name="city" placeholder="City ">
               <span class="errorText" style="display: none"></span>
                    </div>
            </div>
            <div class="fields">
                <div>
                    <label for="state">State </label>
                    <input type="text" id="state" name="state" placeholder="State ">
               <span class="errorText" style="display: none"></span>
                    </div>
                <div>
                    <label for="country">Country </label>
                    <input type="text" id="country" name="country" placeholder="Country ">
               <span class="errorText" style="display: none"></span>
                    </div>
            </div>`;
    document.getElementById("back").innerText = "Back";
    currentView++;

    Array.from(document.querySelectorAll("input")).forEach((input) => {
      input.addEventListener("focusout", () => {
        let rgx = new RegExp(regExpObject[`${input.name}`]);
        !rgx.test(input.value) ? error(input) : approved(input);
      });
    });
  } else if (currentView === 2) {
    document.querySelector(".active").classList.remove("active");
    document.querySelector("li#step3").classList.add("active");
    Array.from(document.querySelectorAll("input")).forEach((input) => {
      input.value != "" && shippingArray.push(`${input.value}`);
    });
    document.querySelector("#formHeader h4").innerText = "Review Quote Details";
    document.querySelector("#formHeader img").src = "./Frame 23.svg";
    document.querySelector("#viewSwitch").innerHTML = `
    <h6>Items</h6> 
    <img src="./img.jpg" style="width: 100%;">
    <h6>Destination</h6>
    <ul>
    ${shippingArray.join(" <br>")}
    </ul>`;
    document.getElementById("next").innerText = "Confirm";
    currentView++;
  } else if (currentView === 3) {
    document.getElementById("formContainer").classList.add("confirmation");
    document.querySelector("#viewSwitch").innerHTML = `<h3>
    Thank you ${shippingArray[0]} <br>
    You are a step closer to gething exclusive rates <br>
    We will be in contact with you within 72 hours with a quote
    </h3>
    <img src="./cmTruck.svg" class="cmTruck"/>`;
    document.getElementById("back").style.display = "none";
    document.getElementById("next").innerText = "Close";
    document.getElementById("steps").style.display = "none";
    currentView++;
  } else if (currentView === 4) {
    document.getElementById("formContainer").style.display = "none";
  }
});

document.getElementById("back").addEventListener("click", () => {
  if (currentView === 2) {
    document.querySelector(".active").classList.remove("active");
    document.querySelector("li#step1").classList.add("active");
    document.querySelector("#formHeader h4").innerText =
      "Choose items you would like to include in your quote";
    document.querySelector("#formHeader img").src = "./one.svg";
    document.getElementById("back").innerText = "Continue Shopping";
    document.getElementById("next").innerText = "Next";
    document.getElementById(
      "viewSwitch"
    ).innerHTML = `<img src="./img.jpg" style="width: 100%;">`;
    currentView--;
  } else if (currentView === 3) {
    document.querySelector(".active").classList.remove("active");
    document.querySelector("li#step2").classList.add("active");
    document.querySelector("#formHeader h4").innerText =
      "Please fill out Shipping Information";
    document.querySelector("#formHeader img").src = "./2.svg";
    document.getElementById("next").innerText = "Next";
    document.querySelector("#viewSwitch").innerHTML = `<div class="fields">
                <div>
                    <label for="fName">First name:</label>
                    <input type="text" id="fname" name="fName" placeholder="First name">
                    <span class="errorText" style="display: none"></span>
                </div>
                <div>
                    <label for="lName">Last name:</label>
                    <input type="text" id="lName" name="lName" placeholder="Last name">
               <span class="errorText" style="display: none"></span>
                    </div>
            </div>
            <div class="fields">
                <div>
                    <label for="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone" placeholder="Phone Number">
               <span class="errorText" style="display: none"></span>
                    </div>
                <div>
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="Email Address">
               <span class="errorText" style="display: none"></span>
                    </div>
            </div>
            <div class="fields">
                <div>
                    <label for="address"> Shipping Address</label>
                    <input type="text" id="address" name="address" placeholder="Address">
               <span class="errorText" style="display: none"></span>
                    </div>
            </div>
            <div class="fields">
                <div>
                    <label for="zCode">Zip Code</label>
                    <input type="number" id="zCode" name="zCode" placeholder="Zip Code ">
               <span class="errorText" style="display: none"></span>
                    </div>
                <div>
                    <label for="city"> City</label>
                    <input type="text" id="city" name="city" placeholder="City ">
               <span class="errorText" style="display: none"></span>
                    </div>
            </div>
            <div class="fields">
                <div>
                    <label for="state">State </label>
                    <input type="text" id="state" name="state" placeholder="State ">
               <span class="errorText" style="display: none"></span>
                    </div>
                <div>
                    <label for="country">Country </label>
                    <input type="text" id="country" name="country" placeholder="Country ">
               <span class="errorText" style="display: none"></span>
                    </div>
            </div>`;

    currentView--;
  }
});
