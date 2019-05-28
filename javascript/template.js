// @ts-check

let currentLocation = "wmt";

//Mappings for the back button 
//TODO Better way, record prev location, then go back to that 
let locationmappings = {
    //Snowy Mountains Dinosuar -> Snowy Mountains Location
    "smdt": "smlt",
}

//Object for setting up the dinosaur events in specific locations 
let dinocode = {
    //Setting up snowy mountain dinosaur when snowy mountain location is loaded
    "smlt": () => clickondino(".smda", "smdt"),
};

//Locations unlocked 
let locationsunlocked = [];


//Questions for the quiz, with the location as the key, the list going Question, correct answer, wrong anwers .... 
let locationquestions = {
    "smlt": ["What era did the snowy mountains dinosaur live in", "Oligocene", "Jurrasic", "Crustase"]
}


//Initial loading of the website  
document.addEventListener("DOMContentLoaded", () => {
    loadWorldMap();

    //Reset maphilight if the window is resized 
    window.addEventListener('resize', () => setTimeout(() => $('#mapping').maphilight(), 50));

    //Adding events to top buttons 
    document.getElementById("worldmapbutton").addEventListener("click", loadWorldMap);
});

//Function to make it easy to highlight an area on the world map screen
function highLightArea(element, startcolour) {
    $(element).data('maphilight', { "stroke": false, "strokeWidth": 2.3, "strokeColor": 000000, "fillColor": startcolour, "fillOpacity": 0.4, "alwaysOn": true });
    $('#mapping').maphilight();
}

//Function to make it easy to implement a hover over for world map locations on the world map screen 
function hoverNew(element, color, othercolor) {
    $(element).hover(() => {
        $(element).data('maphilight', { "stroke": false, "fillColor": color, "fillOpacity": 0.6, "alwaysOn": true });
        $('#mapping').maphilight();
    }, () => {
        $(element).data('maphilight', { "stroke": true, "strokeWidth": 3, "strokeColor": 000000, "fillColor": othercolor, "fillOpacity": 0.6, "alwaysOn": true });
        $('#mapping').maphilight();
    });
};


//Loading a location section 
//TODO implement better way of going from dinosaur -> location, instead of reredending everything, just remove dinosaur
function loadLocation(locationname) {
    clearMainSection();
    loadTemplate(locationname);
    currentLocation = locationname
    $('img[usemap]').rwdImageMaps();
    dinocode[locationname].call();
    loadTemplate("backbuttont");
    document.getElementById("backbutton").addEventListener("click", loadWorldMap);

    //Adding an event so that when the image that activate the quiz is clicked, the quiz is opened 
    loadTemplate("smqit");
    document.getElementById("quizicon").addEventListener("click", () => {
        if (!document.getElementById("quiz")) {
            setupQuiz(locationname);
        }
    });
}

//When you click on the dinosaur in one of the locations, it opens up a picture of that dinosaur 
function clickondino(element, dinoname) {
    $(element).on("click", function (e) {
        e.preventDefault();
        currentLocation = dinoname;
        loadTemplate(dinoname);
        cleanBackButton();
        document.getElementById("backbutton").addEventListener("click", () => loadLocation(locationmappings[dinoname]));
    });
};


//Clears all the elements in the main content section 
const clearMainSection = () => document.getElementById("maincontent").innerHTML = "";

//Loads a template from an ID 
function loadTemplate(templateID) {
    let temp = document.getElementById(templateID);
    let clon = temp.content.cloneNode(true);
    document.getElementById("maincontent").append(clon);
};

//Function to load the world map
function loadWorldMap() {

    //Clearing the main section just in case there is something there, then loading the world map 
    clearMainSection();
    loadTemplate("wmt"); //wmt is the world map template

    //Loading the plugin that places html area tags in the right location for the world map section 
    $('img[usemap]').rwdImageMaps();

    //Adding highlighting to areas on the world map
    highLightArea("#wmsma", "000000");
    highLightArea("#wmora", "000000");
    hoverNew("#wmsma", "555555", "000000");

    //Loading the area highlighting, have delay due to it not working correctly as it is loaded too quickly 
    setTimeout(() => $('#mapping').maphilight(), 50)

    //Loading the world map area events, so that when you click on an area tag you go to that location 
    //World map -> Snowy mountains 
    clickonLocation("wmsma", "smlt");
}

//Function that runs when you click on one of the locations on the world map
function clickonLocation(element, locationname) {
    document.getElementById(element).addEventListener("click", (event) => {
        loadLocation(locationname);
        event.preventDefault();
    });
};


//Removes all the event listeners from the back button 
function cleanBackButton() {
    let oldbackbutton = document.getElementById("backbutton")
    let newbackbutton = oldbackbutton.cloneNode(true);
    oldbackbutton.parentNode.replaceChild(newbackbutton, oldbackbutton);
}


//Setting up the quiz once its loaded
function setupQuiz(location) {
    loadTemplate("quizt")

    //Populating the quiz template with the question and answers  

    document.getElementById("quizquestion").innerHTML = locationquestions[location][0];

    let answers = locationquestions[location].slice(1);
    let correctanswer = answers[0];

    //Randomising the order of the answers
    answers = shuffle(answers);
    //Getting the unordered list where the list items will be added to 
    let ul = document.getElementById("quizanswers");
    //Looping through the answers 
    answers.forEach(answer => {
        let li = document.createElement("li");
        //Setting the text of the list item  
        li.innerHTML = answer;
        //Checking if the answer is correct 
        li.addEventListener("click", () => {
            if (answer === correctanswer) {
                console.log("Correct answer");
            } else {
                console.log("Wrong answer")
            }
        })
        ul.appendChild(li);
    });

    //Adding event to close button
    document.getElementById("closebutton").addEventListener("click", () => {
        document.getElementById("quiz").remove();
    })
}

//Shuffle code to randomise order of answers, made by Chris Ferdinandi
var shuffle = function (array) {

    var currentIndex = array.length;
    var temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};