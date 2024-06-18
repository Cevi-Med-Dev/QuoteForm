let currentView = 1;

document.getElementById("next").addEventListener("click", () => {
  if (currentView === 1) {
    document.getElementById("viewSwitch").innerHTML = `<div class="fields">
                <div>
                    <label for="fName">First name:</label>
                    <input type="text" id="fname" name="fname" placeholder="Enter your first name..">
                </div>
                <div>
                    <label for="lName">Last name:</label>
                    <input type="text" id="lName" name="lName" placeholder="Enter your last name..">
                </div>
            </div>
            <div class="fields">
                <div>
                    <label for="phone">Phone Number</label>
                    <input type="text" id="phone" name="phone" placeholder="Enter your Phone Number..">
                </div>
                <div>
                    <label for="lName">Email</label>
                    <input type="text" id="lName" name="lName" placeholder="Enter your Email Address">
                </div>
            </div>
            <div class="fields">
                <div>
                    <label for="address"> Shipping Address</label>
                    <input type="text" id="address" name="address" placeholder="Please provide address">
                </div>
            </div>
            <div class="fields">
                <div>
                    <label for="fname">Zip Code</label>
                    <input type="text" id="fname" name="fname" placeholder="Enter Zip Code ">
                </div>
                <div>
                    <label for="city"> City</label>
                    <input type="text" id="city" name="city" placeholder="Enter City ">
                </div>
            </div>
            <div class="fields">
                <div>
                    <label for="state">State </label>
                    <input type="text" id="state" name="state" placeholder="Enter state ">
                </div>
                <div>
                    <label for="country">Country </label>
                    <input type="text" id="country" name="country" placeholder="Enter Country ">
                </div>
            </div>`;
    document.getElementById("back").innerText = "Back";
    currentView++;
    console.log("current view : ", currentView);
  } else if (currentView === 2) {
    Array.from(document.querySelectorAll("input")).forEach((text) => {
      //needs to validate data before saving it for the next page
      console.log(text, text.value);
    });
  }
});
