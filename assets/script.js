let currentView = 1;
let shippingDataArray = [];
let quoteArray = JSON.parse(localStorage.getItem("quoteItems")) || [];

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
const error = (input) => {
  input.classList.add("error");
  input.nextElementSibling.innerHTML = `<img src="./assets/icon-error.svg"/ class="errorImg"> ${input.placeholder} is Invalid`;
  input.nextElementSibling.style.display = "flex";
};
const approved = (input) => {
  input.classList.remove("error");
  input.nextElementSibling.style.display = "none";
  document.getElementById("next").disabled = Array.from(
    document.querySelectorAll("#formContainer .errorText")
  ).some((errMsg) => errMsg.style.display === "flex");
};
const populateItemsList = (array) => {
  document.getElementById("viewSwitch").innerHTML = "";
  array.forEach((item) => {
    document.getElementById("viewSwitch").innerHTML += `
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
              <a target="blank" href=${item.link}> Product Details </a>
            </aside>
        </div>
        <div id="quoteBtns">
        <button class="qtyBtn btn1"><img src="./assets/remove.svg"/></button>
        <small>${item.quantity}</small>
        <button class="qtyBtn btn1"> <img src="./assets/add.svg"/></button>
        </div>
        <img src="./assets/trash.svg" alt="trash" class="trashIcon" id=${
          item.product_id
        }/>
      </aside>`;
  });
};
const getData = () => {
  let CM = 2220 + Math.floor(Math.random() * (1 - 100 + 1)) + 9;
  console.log(CM);
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
  console.log(quoteArray);
  populateItemsList(quoteArray);
  localStorage.setItem("quoteItems", JSON.stringify(quoteArray));
  return quoteArray;
};
const itemListView = () => {
  document.querySelector(".active").classList.remove("active");
  document.querySelector("li#step1").classList.add("active");
  document.querySelector("#formHeader h4").innerText =
    "Choose items you would like to include in your quote";
  document.querySelector("#formHeader img").src = "./assets/one.svg";
  document.getElementById("back").innerText = "Continue Shopping";
  document.getElementById("next").innerText = "Next";
  populateItemsList(getData());
  document.getElementById("next").disabled = false;
};
const shippingFormView = () => {
  document.querySelector(".active").classList.remove("active");
  document.querySelector("li#step2").classList.add("active");
  document.querySelector("#formHeader h4").innerText =
    "Please fill out  Shipping Information ";
  document.querySelector("#formHeader img").src = "./assets/two.svg";
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

  Array.from(document.querySelectorAll("input")).forEach((input) => {
    input.addEventListener("focusout", () => {
      let rgx = new RegExp(regExpObject[`${input.name}`]);
      !rgx.test(input.value.trim()) ? error(input) : approved(input);
    });
  });
};
const quoteReview = (array) => {
  document.querySelector(".active").classList.remove("active");
  document.querySelector("li#step3").classList.add("active");
  document.querySelector("#formHeader h4").innerText = "Review Quote Details";
  document.querySelector("#formHeader img").src = "./assets/three.svg";
  populateItemsList(getData());
  document.getElementById("viewSwitch").innerHTML += `
    <h4>Destination</h4>
    ${array
      .map((data) => `<span>${data.placeholder} :  ${data.value}</span><br/>`)
      .join("")}`;
  console.log(array);
  document.getElementById("next").innerText = "Confirm";
};
const confirmationView = () => {
  document.getElementById("formContainer").classList.add("confirmation");
  document.querySelector("#viewSwitch").innerHTML = `<h3>
    Thank you ${shippingDataArray[0].value} <br>
    You are a step closer to gething exclusive rates <br>
    We will be in contact with you within 72 hours with a quote
    </h3>
    <img src="./assets/cmTruck.svg" class="cmTruck"/>`;
  document.getElementById("back").style.display = "none";
  document.getElementById("next").innerText = "Close";
  document.getElementById("steps").style.display = "none";
};
// using bigCommerce template language a snippet with CSS and Js need to be called when button is clicked

document.getElementById("quoteTrigger").addEventListener("click", () => {
  document.getElementById("formContainer").style.display = "flex";
  let newItem = getData();
  localStorage.setItem("quoteItems", JSON.stringify(newItem));
});

document.getElementById("next").addEventListener("click", () => {
  console.log(currentView);
  if (currentView === 1) {
    shippingFormView();

    currentView++;
  } else if (currentView === 2) {
    shippingDataArray = [];
    Array.from(document.querySelectorAll("input"))
      .splice(0, 1)
      .forEach((input) => {
        if (input.value == "") {
          error(input);
        } else {
          shippingDataArray.push(input);
          approved(input);
        }
      });

    !Array.from(document.querySelectorAll("input")).some((input) =>
      input.classList.contains("error")
    ) && quoteReview(shippingDataArray),
      currentView++;
  } else if (currentView === 3) {
    confirmationView();
    currentView++;
  } else if (currentView === 4) {
    document.getElementById("formContainer").style.display = "none";
    currentView++;
  }
});

// button works good
document.getElementById("back").addEventListener("click", () => {
  console.log(currentView);
  if (currentView === 2) {
    itemListView();
    currentView--;
  } else if (currentView === 3) {
    console.log(shippingDataArray);
    shippingFormView();
    currentView--;
  }
});
