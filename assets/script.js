    
    let currentView = 1;
    let shippingDataArray = [];
    let quoteArray = JSON.parse(window.localStorage.getItem("quoteItems")) || [];
    let shippingInfoObject = {};
    // Input validation error/approval togglers
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
      input.style.border = "2px solid green";
      input.style.color = "green";
      input.nextElementSibling.style.display = "none";
      document.getElementById("next").disabled = Array.from(
        document.querySelectorAll("#formContainer .errorText")
      ).some((errMsg) => errMsg.style.display === "flex");
    };
    
    //Eliminating a quoted item
    const removeItem = (targetId) => {
      let filteredArray = quoteArray.filter((item) => item.product_id != targetId);
      window.localStorage.setItem("quoteItems", JSON.stringify(filteredArray));
    };
    
    //checks stored data and paints accurate list every time
    const populateItemsList = (array) => {
      document.getElementById("viewSwitch").innerHTML = "";
      array.forEach((item) => {
        
        document.getElementById("viewSwitch").innerHTML += `
          <aside id="item">
            <div id="imgContainer">
                <img src=${item.image_link} alt="product image">
            </div>
            ${
              currentView === 3
                ? `   
            <div id="itemDetails">
                <h4> ${item.title} </h4>
                <aside>
                  <p>${item.description.substr(0, 50)}...</p>
                </aside>
            </div>
            <div id="quoteBtns">
              <h3> Qty : ${item.quantity}</h3>
            </div>`
                : `
            <div id="itemDetails">
                <h4>${item.title}</h4>
                <aside>
                  <span> Original Price ${item.list_price}</span>
                  <br/>
                  <p> ${item.description}</p>
                  <br/>
                  <a target="blank" href=${item.link}> Product Details </a>
                </aside>
            </div>
            <div id="quoteBtns">
                <button class="qtyBtn btn1 remove"><img id=${item.product_id} src="https://cevimed.com/content/cevimed/assets/quote/remove.svg"/> </button>
                <small>${item.quantity}</small>
                <button class="qtyBtn btn1 add"> <img id=${item.product_id} src="https://cevimed.com/content/cevimed/assets/quote/add.svg"/></button>
            </div>
            <img src="https://cevimed.com/content/cevimed/assets/quote/trash.svg" id=${item.product_id} alt="trash" class="trashIcon"/>
            `
            }
          </aside>`;
      });
    
      //Uses Id's to eliminate items whos trash is clicked
      document.querySelectorAll(".trashIcon").forEach((trash) => {
        trash.addEventListener("click", () => {
          removeItem(trash.id);
          quoteArray = JSON.parse(window.localStorage.getItem("quoteItems"));
          populateItemsList(quoteArray);
        });
      });
    
      //Increases Qty
      document.querySelectorAll(".add").forEach((addBtn) => {
        addBtn.addEventListener("click", (e) => {
          e.preventDefault();
          
          let itemSelected = quoteArray.find(
            (item) => item.product_id === e.target.id
          );
          itemSelected.quantity = Number(itemSelected.quantity) + 1;
          window.localStorage.setItem("quoteItems", JSON.stringify(quoteArray));
          populateItemsList(quoteArray);
          console.log(itemSelected.quantity)
        });
      });
    
      //Decreases Qty
      document.querySelectorAll(".remove").forEach((dltBtn) => {
        dltBtn.addEventListener("click", (e) => {
          e.preventDefault();
          let itemSelected = quoteArray.find(
            (item) => item.product_id === e.target.id
          );
          itemSelected.quantity > 0 && itemSelected.quantity < 2
            ? removeItem(itemSelected.product_id)
            : (itemSelected.quantity = Number(itemSelected.quantity) - 1);
          localStorage.setItem("quoteItems", JSON.stringify(quoteArray));
          populateItemsList(quoteArray);
        });
      });
    };
    
    //allows cross tab memory for accurate data persistance even when window is closed
    const getData = () => {
      console.log("new item fetched");
      fetch(`
        https://searchserverapi.com/getwidgets?api_key=5c9E0E4f0q&q=${142 + Math.floor(Math.random() * (1 - 100 + 1)) + 9}&maxResults=1&startIndex=0&items=true&pages=true&facets=false&categories=true&suggestions=true&vendors=false&tags=false&pageStartIndex=0&pagesMaxResults=10&categoryStartIndex=0&categoriesMaxResults=10&suggestionsMaxResults=4&CustomerGroupId=0&recentlyViewedProducts=&recentlyAddedToCartProducts=&recentlyPurchasedProducts=&vendorsMaxResults=3&tagsMaxResults=3&output=jsonp&callback=jQuery3600586473215199615_1719243771726&_=1719243771727
      `)
        .then((response) => response.text())
        .then((data) => {
          first_subs = data.substring(40);
          data = first_subs.substring(0, first_subs.length - 2);
          return JSON.parse(data);
        })
         .then((data) => {
          if (quoteArray.length > 0) {
            !quoteArray.some(
              (item) => data.items[0].product_id === item.product_id
            ) && quoteArray.push(...data.items);
          } else {
            quoteArray.push(data.items[0]);
          }
        })
        .then(() => {
          window.localStorage.setItem("quoteItems", JSON.stringify(quoteArray));
          
          populateItemsList(quoteArray);
        });
    
      return quoteArray;
    };
    
    //send data in object form to Airtable
    async function postData(url = "", data = '') {
      const response = await fetch(url, {
        method: "POST",
        cache: "no-cache",
        mode: 'no-cors',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data, // body data type must match "Content-Type" header
      });
      return response; // parses JSON response into native JavaScript objects
    }
    
    // // Send trigger
    // postData({}).then((data) => {});
    
    //View change - SPA feature
    const itemListView = () => {
      document.querySelector(".active").classList.remove("active");
      document.querySelector("li#step1").classList.add("active");
      document.querySelector("#formHeader h4").innerText =
        "Choose items you would like to include in your quote";
      document.querySelector("#formHeader img").src = "https://cevimed.com/content/cevimed/assets/quote/one.svg";
      document.getElementById("back").innerText = "Continue Shopping";
      document.getElementById("next").innerText = "Next";
      populateItemsList(quoteArray);
      document.getElementById("next").disabled = false;
    };
    const shippingFormView = (array) => {
      document.querySelector(".active").classList.remove("active");
      document.querySelector("li#step2").classList.add("active");
      document.querySelector("#formHeader h4").innerText =
        "Please fill out  Shipping Information ";
      document.querySelector("#formHeader img").src = "https://cevimed.com/content/cevimed/assets/quote/two.svg";
      document.getElementById("viewSwitch").innerHTML = `<div class="fields">
              <div>
                    <label for="fName">First name:</label>
                    <input value="${
                      array === undefined ? "" : array[0].value
                    }" type="text" id="fName" name="fName" placeholder="First name">
                    <span class="errorText" style="display: none"></span>
                    </div>
                    <div>
                    <label for="lName">Last name:</label>
                    <input value="${
                      array === undefined ? "" : array[1].value
                    }" type="text" id="lName" name="lName" placeholder="Last name">
                    <span class="errorText" style="display: none"></span>
                      </div>
              </div>
              <div class="fields">
                  <div>
                      <label for="phone">Phone Number</label>
                      <input value="${
                        array === undefined ? "" : array[2].value
                      }" type="tel" id="phone" name="phone" placeholder="Phone Number">
                 <span class="errorText" style="display: none"></span>
                      </div>
                      <div>
                      <label for="email">Email</label>
                      <input value="${
                        array === undefined ? "" : array[3].value
                      }" type="email" id="email" name="email" placeholder="Email Address">
                 <span class="errorText" style="display: none"></span>
                      </div>
                      </div>
                      <div class="fields">
                  <div>
                  <label for="address"> Shipping Address</label>
                      <input value="${
                        array === undefined ? "" : array[4].value
                      }" type="text" id="address" name="address" placeholder="Address">
                 <span class="errorText" style="display: none"></span>
                      </div>
              </div>
    
              <div class="fields">
                  <div>
                  <label for="zCode">Zip Code</label>
                  <input value="${
                    array === undefined ? "" : array[5].value
                  }" type="text" id="zCode" name="zCode" placeholder="Zip Code ">
                  <span class="errorText" style="display: none"></span>
                  </div>
                  <div>
                  <label for="city"> City</label>
                  <input value="${
                    array === undefined ? "" : array[6].value
                  }" type="text" id="city" name="city" placeholder="City ">
                  <span class="errorText" style="display: none"></span>
                  </div>
                  </div>
                  <div class="fields">
                  <div>
                  <label for="state">State </label>
                  <input value="${
                    array === undefined ? "" : array[7].value
                  }" type="text" id="state" name="state" placeholder="State ">
                  <span class="errorText" style="display: none"></span>
                  </div>
                  <div>
                  <label for="country">Country </label>
                  <input value="${
                    array === undefined ? "" : array[8].value
                  }" type="text" id="country" name="country" placeholder="Country ">
                  <span class="errorText" style="display: none"></span>
              </div>
            </div>`;
      document.getElementById("back").innerText = "Back";
      document.getElementById("next").innerText = "next";
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
      document.querySelector("#formHeader img").src = "https://cevimed.com/content/cevimed/assets/quote/three.svg";
      document.querySelector("div.qBtns").style.display = "none !important";
      quoteArray = JSON.parse(window.localStorage.getItem("quoteItems"));
      shippingInfoObject = {};
      shippingDataArray.forEach((input) => {
        shippingInfoObject[`${input.name}`] = `${input.value}`;
      });
      shippingInfoObject = [Array.from(quoteArray)].concat(shippingInfoObject);
    
      //items listed
      populateItemsList(quoteArray);
    
      //Shipping info
      document.getElementById("viewSwitch").innerHTML += `
        <h4>Destination</h4>
        ${array
          .map(
            (data) =>
              data.value && `<span> ${data.placeholder} : ${data.value}</span><br/>`
          )
          .join("")}
        <br/>`;
        document.getElementById("next").innerText = "Send";
    };
    const confirmationView = () => {
      document.getElementById("formContainer").classList.add("confirmation");
      document.querySelector("#viewSwitch").innerHTML = `<h3>
        Thank you ${shippingDataArray[0].value} ${shippingDataArray[1].value}<br>
        You are a step closer to gething exclusive rates <br>
        We will be in contact with you within 72 hours with a quote
        </h3>
        <img src="https://cevimed.com/content/cevimed/assets/quote/cmTruck.svg" class="cmTruck"/>`;
      document.getElementById("back").style.display = "none";
      document.getElementById("next").innerText = "Close";
      document.getElementById("steps").style.display = "none";
      document.getElementById("");
    };
    
    //updates quoted items list when a new item is added
    document.getElementById("quoteTrigger").addEventListener("click", (e) => {
      let newItem = getData();
      window.localStorage.setItem("quoteItems", JSON.stringify(newItem));
      quoteArray = JSON.parse(window.localStorage.getItem("quoteItems"));
      populateItemsList(quoteArray);
    });
    
    //toggles screen views on User Interface upon Next button click
    document.getElementById("next").addEventListener("click", () => {
      if (currentView === 1) {
        currentView++;
        shippingFormView();
      } else if (currentView === 2) {
        shippingDataArray = [];
    
        //Can decide what inputs are necessary - ask Simon - 6 recommended - atm only ask for first name
        Array.from(document.querySelectorAll("input")).forEach((input) => {
          if (input.value == "" && input.id === "fName") {
            error(input);
          } else {
            shippingDataArray.push(input);
            approved(input);
          }
        });
    
        //Runs through every input && checks for typos then visually notifies user
        !Array.from(document.querySelectorAll("input")).some((input) =>
          input.classList.contains("error")
        ) && currentView++,
          quoteReview(shippingDataArray);
          document.querySelector("#viewSwitch").parentElement.querySelector('#next').addEventListener("click", () => {
            // Join params
            let makeQ = '';
            Object.keys(shippingInfoObject[1]).forEach(el => {
                makeQ += `${el}=${shippingInfoObject[1][el]}&`
            })
            
            let items = ''
            shippingInfoObject[0].forEach((item) => {
              items += `name: ${item.title}, CM: ${item.product_code}, Qty: ${item.quantity}, \n`;
            });
    
            makeQ += `items=${items}`
    
            // Send Data
            postData(
              "https://hooks.airtable.com/workflows/v1/genericWebhook/appi0FYLXUm0K6RqJ/wflMJtlWnopIkAxUG/wtrGuQFtO9eVRLxA7", makeQ
            ).then((data) => {
              console.log(data);
            })
    
           });
      } else if (currentView === 3) {
        confirmationView();
        currentView++;
      } else if (currentView === 4) {
        document.getElementById("formContainer").style.display = "none";
        currentView++;
      }
    });
    
    //toggles screen views on User Interface upon Back button click
    document.getElementById("back").addEventListener("click", () => {
      if (currentView === 2) {
        currentView--;
        itemListView();
      } else if (currentView === 3) {
        currentView--;
        document
          .getElementById("next")
          .removeEventListener("click", postData, true);
        shippingFormView(shippingDataArray);
      } else if (currentView === 1) {
        document.getElementById("formContainer").style.display = "none";
      }
    });
    
    currentView === 1 && itemListView();
    