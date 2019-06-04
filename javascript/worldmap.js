// @ts-check

//Mappings for the back button 
let backbuttonmappings = {
    //Snowy Mountains Dinosuar -> Snowy Mountains Location
    "smdt": "smlt",
    //Outer region dinosaur -> Outer region location
    "ordt": "orlt"
}

//To determine if users have found the dinosaurs yet 

//To determine location -> dinosaur 
let locationdinosaur = {
    "smlt": "smdt",
    "orlt": "ordt",
}


//Object that contains events for locations 
let events = {
    "smlt": {
        "dino": () => loadDino(".smda", "smdt"),
        "quizevent": () => {
            loadTemplate("smqit");
            document.getElementById("smquizicon").addEventListener("click", () => {
                if (!document.getElementById("quiz")) {
                    setupQuiz("smlt");
                }
            });
        },
    },
    "orlt": {
        "dino": () => {
            loadDino(".orda", "ordt");
        },
        "quizevent": () => {
            loadTemplate("orqit");
            document.getElementById("orquizicon").addEventListener("click", () => {
                if (!document.getElementById("quiz")) {
                    setupQuiz("orlt");
                }
            });
        }
    },
}


//All the locations and associated area tag ids on the world map screen 
let alllocations = ["smlt", "orlt"]
let allareas = ["wmsma", "wmora"]

//Locations unlocked 
let locationsunlocked = [];

let founddinosaurs = {
    "smdt": false,
    "ordt": false,
}

document.cookie = JSON.stringify(founddinosaurs);
//Questions for the quiz, with the location as the key, the list going Question, correct answer, wrong anwers .... 


let locationquestions = {
    "smlt": ["What era did the Paraceratherium live in?", "Oligocene", "Jurassic", "Cretaceous"],
    "orlt": ["How long was the T-Rex?", "12.8m", "15.9m", "20m"],
}


//Initial loading of the website  
document.addEventListener("DOMContentLoaded", () => {


    //Check which page you are on 

    if ( document.URL.includes("worldmap.html") ){
        loadWorldMap();

        document.getElementById("logodiv").addEventListener("click", loadWorldMap);

        //Adding event listener to the logo, so that when it is clicked you get taken back to the world map screen

        //Reset maphilight if the window is resized 
        window.addEventListener('resize', () => setTimeout(() => $('#mapping').maphilight(), 50));

        //Adding events to top buttons 
        document.getElementById("worldmapbutton").addEventListener("click", loadWorldMap);
        // document.getElementById("tutorialbutton").addEventListener("click", () => {
        //     alert("Welcome to Dinotopia, the land of dinosaurs, to proceed please go to the unlocked area and find the dinosaur, then complete the quiz to continue your journeys.");
        // })
    }


});



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

    for (let i = 0; i < alllocations.length; i++) {
        //Adding highlighting to areas on the world map, changing the colour depending on if the locations is unlocked or not
        if (locationsunlocked.includes(alllocations[i])) {
            highLightArea("#" + allareas[i], "00ad50", 0.7);
            clickonLocation(allareas[i], alllocations[i]);
        } else {
            document.getElementById(allareas[i]).addEventListener("click", (event) => event.preventDefault());
            highLightArea("#" + allareas[i], "000000", 0);
        }
    }

    //Loading the area highlighting, have delay due to it not working correctly as it is loaded too quickly 
    setTimeout(() => $('#mapping').maphilight(), 50)
}

//Function that runs when you click on one of the locations on the world map
function clickonLocation(locationareaname, locationtemplatename) {
    document.getElementById(locationareaname).addEventListener("click", (event) => {
        if (locationsunlocked.includes(locationtemplatename)) {
            loadLocation(locationtemplatename);
        } else {
            alert("This area is locked! Please complete the quiz in the other area to proceed to this area")
        }
        event.preventDefault();
    });
};

//Loading a location section 
function loadLocation(locationtemplatename) {
    clearMainSection();
    loadTemplate(locationtemplatename);


    $('img[usemap]').rwdImageMaps();
    events[locationtemplatename]["dino"].call();
    loadTemplate("backbuttont");

    document.getElementById("backbutton").addEventListener("click", loadWorldMap);

    //Adding an event so that when the image that activate the quiz is clicked, the quiz is opened 
    events[locationtemplatename]["quizevent"].call();
}

//When you click on the dinosaur in one of the locations, it opens up a picture of that dinosaur 
function loadDino(element, dinoname) {
    $(element).on("click", function (e) {

        //Clearing the screen for the outer region, as the dinosaur gets its own screen 
        if (dinoname === "ordt") {
            clearMainSection();
            loadTemplate("backbuttont");
            let audio = new Audio("../sound/trexroar.mp3");
            audio.play();
        }

        e.preventDefault();
        loadTemplate(dinoname);
        cleanBackButton();
        founddinosaurs[dinoname] = true;
        document.getElementById("backbutton").addEventListener("click", () => loadLocation(backbuttonmappings[dinoname]));
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
    if (founddinosaurs[locationdinosaur[location]]) {
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
                    //TODO make this code more general, add an object or something
                    alert("You have unlocked another region!")
                    if (location === "smlt" && (!locationsunlocked.includes("orlt"))) {
                        locationsunlocked.push("orlt");
                    } else {
                        alert("You have already unlocked that location!")
                    }
                    loadWorldMap();
                } else {
                    alert("That is not the correct answer, you should probably check out the dinosaur again")
                }
            })
            ul.appendChild(li);
        });
    } else {
        document.getElementById("quizquestion").innerHTML = "Please go find the dinosaur at this location before doing this event!";
    }

    //Adding event to close button
    document.getElementById("closebutton").addEventListener("click", () => {
        document.getElementById("quiz").remove();
    })
}

//Shuffle code to randomise order of answers, by Oliver Jeaffreson
const shuffle = function (array) {
    for (let i = array.length; --i > 0;) {
        const fromIndex = Math.floor(Math.random() * i)
        const temp = array[i];
        array[i] = array[fromIndex];
        array[fromIndex] = temp;
    }
    return array;
};

//Function to make it easy to highlight an area on the world map screen
function highLightArea(element, startcolour, opacity) {
    $(element).data('maphilight', { "stroke": false, "strokeWidth": 2.3, "strokeColor": 000000, "fillColor": startcolour, "fillOpacity": opacity, "alwaysOn": true });
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