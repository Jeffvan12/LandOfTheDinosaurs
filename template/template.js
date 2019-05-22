//Initial loading of the world 
let hovering = {
    "wmsmloc": false,
    "or": false,
}

let currentLocation = "wm";

document.addEventListener("DOMContentLoaded", () => {
    //Clearing the main section just in case there is something there, then loading the world map 
    clearMainSection();
    loadScreenpart("worldmaptemplate");

    //Loading the plugin that places html area tags in the right location for the world map section 
    $('img[usemap]').rwdImageMaps();

    //Reloading the highligted maps areas when the window is resized and initially loaded 
    $(window).resize(function () {
        setTimeout(function () {
            $('#mapping').maphilight();
        }, 500)
    })






});


function flashing(element, startcolour, endcolour, interval) {
    let state = 1;
    setInterval(function () {
        if (!hovering[element]) {
            if (state) {
                $(element).data('maphilight', { "stroke": false, "fillColor": startcolour, "fillOpacity": 0.6, "alwaysOn": true });
            } else {
                $(element).data('maphilight', { "stroke": false, "fillColor": endcolour, "fillOpacity": 0.6, "alwaysOn": true });
            }
        }
        $('#mapping').maphilight();
        state = !state;
    }, interval);
}

function clickonloc(element, locationname) {
    $(element).on("click", function (e) {
        e.preventDefault();
        clearMainSection();
        loadScreenpart(locationname);
        currentLocation = locationname;
    });
}


function hoverNew(element, color) {
    $(element).hover(() => {
        $("element").data('maphilight', { "stroke": false, "fillColor": color, "fillOpacity": 0.6, "alwaysOn": true });
        $('#mapping').maphilight();
        hovering[element] = true;
    }, () => hovering[element] = false);
}


function clearMainSection() {
    document.getElementById("maincontent").innerHTML = "";
}

function loadScreenpart(templateID) {
    let temp = document.getElementById(templateID);
    let clon = temp.content.cloneNode(true);
    document.getElementById("maincontent").append(clon);
}

function imageMapping(colour) {
    $('#mapping').maphilight({
        stroke: true,
        strokeColor: '111111',
        // strokeOpacity: 0.5,
        strokeWidth: 2,
        fill: true,
        fillColor: colour,
        fillOpacity: 1,
        alwaysOn: true,
        wrapClass: 'map'
    });
}


