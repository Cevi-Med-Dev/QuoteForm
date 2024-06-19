let currentView = 1;
const regExpObject = {
  fName: "^([A-ZÁÉÍÓÚ]{1}[a-zñáéíóú]+[s]*)+$",
  lName: "^([A-ZÁÉÍÓÚ]{1}[a-zñáéíóú]+[s]*)+$",
  phone: "^[0-9()-]+$",
  email: "[a-zA-Z0-9._-]+@[a-zA-Z]+.+com",
  address: "^[a-zA-Z0-9s,'-]*$",
  zCode: "^[0-9]{5}(?:-[0-9]{4})?$",
  city: "^[a-zA-Z',.s-]{1,25}$",
  state: "^[a-zA-Z',.s-]{1,25}$",
  country: "^[a-zA-Z',.s-]{1,25}$",
};

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
  ).some( errMsg => errMsg.style.display === "flex");

};

document.getElementById("next").addEventListener("click", () => {
  if (currentView === 1) {
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
    document.getElementById("formContainer").classList.add("confirmation");
  }
});
