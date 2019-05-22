// @ts-check

let currentLocation = "wmt";

//Mappings for hovering 
let hovering = {
    "#wmsma": false,
    "#wmora": false,
};

//Mappings for the back button 
//Better way, record prev location, then go back to that 
let locationmappings = {
    //Snowy Mountains Dinosuar -> Snowy Mountains Location
    "smdt": "smlt",

}

//Code to run when loading the locatoin,
//  smlt -> opens the snowy mountain dinosaur 
let dinocode = {
    "smlt": () => clickondino(".smda", "smdt"),
};


//Initial loading of the world 
document.addEventListener("DOMContentLoaded", () => {
    loadWorldMap();
});

//Function to make it easy to create an effect on the locations on the world map screen 
function flashing(element, startcolour, endcolour, interval) {
    let state = false;
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

//Function to make it easy to implement a hover over for world map locations on the world map screen 
function hoverNew(element, color) {
    $(element).hover(() => {
        $(element).data('maphilight', { "stroke": false, "fillColor": color, "fillOpacity": 0.6, "alwaysOn": true });
        $('#mapping').maphilight();
        hovering[element] = true;
    }, () => hovering[element] = false);
};

//Function that runs when you click on one of the locations on the world map j
function clickonloc(element, locationname) {
    $(element).on("click", function (e) {
        e.preventDefault();
        loadLocation(locationname);
    });
};

function loadLocation(locationname){
        clearMainSection();
        loadScreenpart(locationname);
        currentLocation = locationname
        $('img[usemap]').rwdImageMaps();
        dinocode[locationname].call();
        loadScreenpart("backbuttont");
        document.getElementById("backbutton").addEventListener("click", loadWorldMap);
}

//When you click on the dinosaur in one of the locations, it opens up a picture of that dinosaur 
function clickondino(element, dinoname) {
    $(element).on("click", function (e) {
        e.preventDefault();
        currentLocation = dinoname;
        loadScreenpart(dinoname);
        cleanBackButton();
        document.getElementById("backbutton").addEventListener("click", () => loadLocation(locationmappings[dinoname]));
        $("#shader").toggleClass("shade");
    });
};


//Clears all the elements in the main content section 
function clearMainSection() {
    document.getElementById("maincontent").innerHTML = "";
};

//Loads a specific area from an ID 
function loadScreenpart(templateID) {
    let temp = document.getElementById(templateID);
    let clon = temp.content.cloneNode(true);
    document.getElementById("maincontent").append(clon);
};

function loadWorldMap() {

    //Clearing the main section just in case there is something there, then loading the world map 
    clearMainSection();
    loadScreenpart("wmt"); //wmt is the world map template

    //Loading the plugin that places html area tags in the right location for the world map section 
    $('img[usemap]').rwdImageMaps();

    //Reloading the highligted maps areas when the window is resized and initially loaded 
    $(window).resize(function () {
        setTimeout(function () {
            $('#mapping').maphilight();
        }, 500)
    });

    //World Map events 
    flashing("#wmsma", "000000", "666666", 500);
    flashing("#wmora", "000000", "666666", 500);
    hoverNew("#wmsma", "000000");

    //Snowy Mountain events 
    //World map -> Snowy mountains 
    clickonloc("#wmsma", "smlt");;
    //Loading dinosaur in snowy mountains 
}

//Removes all the event listeners from the back button 
function cleanBackButton(){
    let oldbackbutton = document.getElementById("backbutton")
    let newbackbutton = oldbackbutton.cloneNode(true);
    oldbackbutton.parentNode.replaceChild(newbackbutton,oldbackbutton);
}