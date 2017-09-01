var map, places, infoWindow, i = 0;
var markers = [];
var searchBox;
//var key = AIzaSyAoyeRgwmw43xYe1kIyO3R_BJEzPBFYqns;

function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: 37.9000578, lng: -110.364755},
    mapTypeId: 'roadmap',
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    streetViewControl: false
  });

  infoWindow = new google.maps.InfoWindow({
    content: document.getElementById('info-content')
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('autocomplete');
  var searchBox = new google.maps.places.SearchBox(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    clearResults();
    clearMarkers();
    places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    //markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      addResult(place, i);
    
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        url: place.url,
        address: place.formatted_address,
        position: place.geometry.location,
        animation: google.maps.Animation.DROP
      }));

      //add event to each marker to display info window
      google.maps.event.addListener(markers[i], 'click', showInfoWindow);
      i++;

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}


// Show the information in an info window
// anchored on the marker for the place that the user selected.
function showInfoWindow() {
  var marker = this;
  infoWindow.open(map, marker);
  infoWindowContent(marker);  
 } 
 // Load the place information into the HTML elements used by the info window.
 function infoWindowContent(marker) {
  document.getElementById('iw-icon').innerHTML = '<img class="icon" ' +
      'src="' + marker.icon.url + '"/>';
  document.getElementById('iw-url').innerHTML = '<b><a href="' + marker.url +
      '">' + marker.title + '</a></b>';
  document.getElementById('iw-address').textContent = marker.address;

}

//Display search result list markers
function addResult(result, i) {
  var results = document.getElementById('results');
  var markerIcon = result.icon;

  var tr = document.createElement('tr');
  tr.style.backgroundColor = (i % 2 === 0 ? '#daddf2' : '#FFFFFF');
  tr.onclick = function() {
    google.maps.event.trigger(markers[i], 'click');
  };

  var iconTd = document.createElement('td');
  var nameTd = document.createElement('td');
  var icon = document.createElement('img');
  icon.src = markerIcon;
  icon.setAttribute('class', 'placeIcon');
  icon.setAttribute('className', 'placeIcon');
  var name = document.createTextNode(result.name);
  iconTd.appendChild(icon);
  nameTd.appendChild(name);
  tr.appendChild(iconTd);
  tr.appendChild(nameTd);
  results.appendChild(tr);
}

//Clear Result List display 
function clearResults() {
  var results = document.getElementById('results');
  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
  i=0;
}

//clear any Markers
function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
    }
  }
  markers = [];
}