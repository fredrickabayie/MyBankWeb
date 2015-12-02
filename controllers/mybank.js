/**
 * Created by fredrickabayie on 02/12/2015.
 */

function sendRequest ( url ) {
    var request, response;
    request = $.ajax({url:url, async:false});
    response = $.parseJSON(request.responseText);
    return response;
}

//function initialize() {
//    var mapCanvas = document.getElementById('map');
//    var mapOptions = {
//        center: new google.maps.LatLng(5.759625, -0.219465),
//        zoom: 8,
//        mapTypeId: google.maps.MapTypeId.ROADMAP
//    }
//    var map = new google.maps.Map(mapCanvas, mapOptions)
//}
//
//google.maps.event.addDomListener(window, 'load', initialize);


$( function () {
   $("#addLocation_btn").click(function () {
       alert("Add clicked");
       var longitude, latitude, bank, area, type, url, response;

       longitude = encodeURI(document.getElementById("longitudeVal").value);
       latitude = encodeURI(document.getElementById("latitudeVal").value);
       bank = encodeURI(document.getElementById("selected-bank").textContent);
       area = encodeURI(document.getElementById("areaName").value);
       type = encodeURI(document.getElementById("selected-type").textContent);

       url = "http://cs.ashesi.edu.gh/~csashesi/class2016/fredrick-abayie/mobileweb/mybank/php/mybank.php" +
           "?cmd=add_atmLocation&bankName="+bank+"&longitude="+longitude+"&latitude="+latitude+"&areaName="+area+"" +
           "&type="+type;

       console.log(url);

       response = sendRequest(url);
       if (response.result === 1) {
           alert(""+response.status);
           document.getElementById("longitudeVal").innerHTML = "";
       } else {
           alert(""+response.status);
       }
   });
});


$('#bank-menu').find('li a').click(function() {
    document.getElementById('selected-bank').textContent = $(this).text();
});


$('#type-menu').find('li a').click(function() {
    document.getElementById('selected-type').textContent = $(this).text();
});



var geocoder = new google.maps.Geocoder();

function geocodePosition(pos) {
    geocoder.geocode({
        latLng: pos
    }, function(responses) {
        if (responses && responses.length > 0) {
            updateMarkerAddress(responses[0].formatted_address);
        } else {
            updateMarkerAddress('Cannot determine address at this location.');
        }
    });
}

function updateMarkerStatus(str) {
    document.getElementById('markerStatus').innerHTML = str;
}

function updateMarkerPosition(latLng) {
    document.getElementById('info').innerHTML = [
        latLng.lat(),
        latLng.lng()
    ].join(', ');

    document.getElementById('latitudeVal').value = latLng.lat().toFixed(6);
    document.getElementById('longitudeVal').value = latLng.lng().toFixed(6);
}

function updateMarkerAddress(str) {
    //document.getElementById('address').innerHTML = str;
    document.getElementById('areaName').value = str;
}

function initialize() {
    var latLng = new google.maps.LatLng(5.759625, -0.219465);
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: latLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var marker = new google.maps.Marker({
        position: latLng,
        title: 'Pointer',
        map: map,
        draggable: true
    });

    // Update current position info.
    updateMarkerPosition(latLng);
    geocodePosition(latLng);

    // Add dragging event listeners.
    google.maps.event.addListener(marker, 'dragstart', function() {
        updateMarkerAddress('Searching...');
    });

    google.maps.event.addListener(marker, 'drag', function() {
        updateMarkerStatus('Searching...');
        updateMarkerPosition(marker.getPosition());
    });

    google.maps.event.addListener(marker, 'dragend', function() {
        updateMarkerStatus('Drag ended');
        geocodePosition(marker.getPosition());
    });
}

// Onload handler to fire off the app.
google.maps.event.addDomListener(window, 'load', initialize);