function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for (let i = 0; i < uiBathrooms.length; i++) {
      if (uiBathrooms[i].checked) {
          return parseInt(i) + 1;
      }
  }
  return -1; // Invalid Value
}

function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  for (let i = 0; i < uiBHK.length; i++) {
      if (uiBHK[i].checked) {
          return parseInt(i) + 1;
      }
  }
  return -1; // Invalid Value
}

function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");
  var sqft = document.getElementById("uiSqft").value;
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("uiLocations").value;
  var estPrice = document.getElementById("uiEstimatedPrice");

  var url = "/api/predict_home_price"; // Make sure this matches your Flask endpoint

  if (sqft === "" || bhk === -1 || bathrooms === -1 || location === "") {
      estPrice.innerHTML = "<h2>Please fill out all the fields correctly.</h2>";
      return;
  }

  $.post(url, {
      total_sqft: parseFloat(sqft),
      bhk: bhk,
      bath: bathrooms,
      location: location
  }, function (data, status) {
      if (status === "success") {
          estPrice.innerHTML = "<h2>" + data.estimated_price.toString() + " Lakh</h2>";
      } else {
          estPrice.innerHTML = "<h2>Error estimating the price.</h2>";
      }
  }).fail(function () {
      estPrice.innerHTML = "<h2>Failed to get a response from the server.</h2>";
  });
}

function onPageLoad() {
  console.log("Document loaded");

  var url = "/api/get_location_names"; // Matches your Flask route

  $.get(url, function (data, status) {
      if (status === "success" && data.locations) {
          const locations = data.locations;
          const uiLocations = document.getElementById("uiLocations");
          $('#uiLocations').empty(); // Clear any existing options

          for (let i = 0; i < locations.length; i++) {
              const opt = new Option(locations[i]);
              $('#uiLocations').append(opt);
          }
      } else {
          console.error("Failed to load locations.");
      }
  }).fail(function () {
      console.error("Error fetching location names.");
  });
}

window.onload = onPageLoad;
