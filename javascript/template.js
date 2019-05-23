// @ts-check

let currentLocation = "wmt";

//Mappings for the back button 
//TODO Better way, record prev location, then go back to that 
let locationmappings = {
    //Snowy Mountains Dinosuar -> Snowy Mountains Location
    "smdt": "smlt",

}

//Code to run when loading the locatoin,
//  smlt -> opens the snowy mountain dinosaur 
let dinocode = {
    "smlt": () => clickondino(".smda", "smdt"),
};

//Initial loading of the website  
document.addEventListener("DOMContentLoaded", () => {
    loadWorldMap();

    //Reset maphilight if the window is resized 
    window.addEventListener('resize', () => setTimeout(() => $('#mapping').maphilight(), 50));

    //Adding events to top buttons 
    document.getElementById("worldmapbutton").addEventListener("click", loadWorldMap);
});

//Function to make it easy to create a flashing effect on the area tags on the world map screen
function flashing(element, startcolour) {
    $(element).data('maphilight', { "stroke": false, "fillColor": startcolour, "fillOpacity": 0.6, "alwaysOn": true });
    $('#mapping').maphilight();
}

//Function to make it easy to implement a hover over for world map locations on the world map screen 
function hoverNew(element, color, othercolor) {
    $(element).hover(() => {
        $(element).data('maphilight', { "stroke": false, "fillColor": color, "fillOpacity": 0.6, "alwaysOn": true });
        $('#mapping').maphilight();
    }, () => {
        $(element).data('maphilight', { "stroke": false, "fillColor": othercolor, "fillOpacity": 0.6, "alwaysOn": true });
        $('#mapping').maphilight();
    });
};

//Function that runs when you click on one of the locations on the world map
function clickonloc(element, locationname) {
    $(element).on("click", function (e) {
        e.preventDefault();
        loadLocation(locationname);
    });
};

//Loading a location section 
//TODO implement better way of going from dinosaur -> location, instead of reredending everything, just remove dinosaur
function loadLocation(locationname) {
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
const clearMainSection = () => document.getElementById("maincontent").innerHTML = "";

//Loads a specific area from an ID 
function loadScreenpart(templateID) {
    let temp = document.getElementById(templateID);
    let clon = temp.content.cloneNode(true);
    document.getElementById("maincontent").append(clon);
};

//Function to load the world map
function loadWorldMap() {

    //Clearing the main section just in case there is something there, then loading the world map 
    clearMainSection();
    loadScreenpart("wmt"); //wmt is the world map template

    //Loading the plugin that places html area tags in the right location for the world map section 
    $('img[usemap]').rwdImageMaps();

    //Adding highlighting to areas on the world map
    flashing("#wmsma", "000000");
    flashing("#wmora", "000000");
    hoverNew("#wmsma", "555555", "000000");

    //Loading the area highlighting, have delay due to it not working correctly as it loaded too quickly 
    setTimeout(() => $('#mapping').maphilight(), 50)

    //Loading the world map area events, so that when you click on an area tag you go to that location 
    //World map -> Snowy mountains 
    clickonloc("#wmsma", "smlt");;

}

//Removes all the event listeners from the back button 
function cleanBackButton() {
    let oldbackbutton = document.getElementById("backbutton")
    let newbackbutton = oldbackbutton.cloneNode(true);
    oldbackbutton.parentNode.replaceChild(newbackbutton, oldbackbutton);
}