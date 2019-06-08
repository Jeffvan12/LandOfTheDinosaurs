//Mappings for the back button 
let backbuttonmappings = {
    //Snowy Mountains Dinosuar -> Snowy Mountains Location
    "smdt": "smlt",
    //Outer region dinosaur -> Outer region location
    "ordt": "orlt"
}


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
let locationsunlocked = ["smlt"];

//To store what dinosaurs the user has seen  
let founddinosaurs = {
    "smdt": false,
    "ordt": false,
}

//Questions for the quiz, with the location as the key, the list going Question, correct answer, wrong anwers .... 
let locationquestions = {
    "smlt": ["What era did the Paraceratherium live in?", "Oligocene", "Jurassic", "Cretaceous"],
    "orlt": ["How long was the T-Rex?", "12.8m", "15.9m", "20m"],
}


//Location mappings to pictures on the collection page 
let collectiondinotemplatemappings = {
    "smdt": "smd",
    "ordt": "ord",
}

//Initial loading of the website  
document.addEventListener("DOMContentLoaded", () => {
    //Loading the cookies 
    if (document.cookie !== "") {
        loadCookie();
    } else {
        makeCookie();
    }


    //Code for the world map page 
    if (document.URL.includes("index.html") || location.pathname == "/") {
        loadWorldMap();

        //Reset maphilight if the window is resized 
        window.addEventListener('resize', () => setTimeout(() => $('#mapping').maphilight(), 50));

        //Adding events to top buttons 
        document.getElementById("worldmapbutton").addEventListener("click", loadWorldMap);
        setTimeout(() =>
            alert(
                "Welcome to Dinotopia! You have just entered the land of the dinosaurs, your first goal is to find a dinosaur, do this by getting to the first location and looking around.",
                2000
            )
        );
    }


    //Code for the collection page 
    if (document.URL.includes("collection.html")) {
        if (document.cookie !== '') {
            let num = 0;
            //const dinoseen = JSON.parse(document.cookie)['dinoseen'];
            loadCookie();
            const dinoseen = founddinosaurs;

            //Adding the dinosaurs that have been unlocked and adding click events that take you back to the dinosaur information screen 
            for (let dino in dinoseen) {
                if (dinoseen[dino]) {
                    loadTemplate(dino);
                    num++;
                }
            }

            document.getElementById("unlockedbutton").innerHTML = num + "/2 Dinosaurs seen";
        } else {
            document.getElementById("unlockedbutton").innerHTML = "0/2 Dinosaurs seen";
        }

    }


    //Loading events for logo, world map button and collection button 
    document.getElementById("worldmapbutton").addEventListener("click", () => {
        makeCookie();
        location.href = 'index.html';
    });
    document.getElementById("collectionbutton").addEventListener("click", () => {
        makeCookie();
        location.href = 'collection.html'
    });
    document.getElementById("logodiv").addEventListener("click", () => location.href = 'index.html');

});

//Making and saving the website Cookies 
function makeCookie() {
    let tosave = {
        //Saving dinosaurs seen 
        'dinoseen': founddinosaurs,
        //Saving Locations unlocked 
        'locationsunlock': locationsunlocked,
    };
    document.cookie = "cookie=" + encodeURIComponent(JSON.stringify(tosave));
}

//Loading the cookie  
function loadCookie() {
    //Getting the cookie, splitting the cookies, then splitting again to get the key and the value, then filtering for the correct key, then getting the value. 
    let encoded = document.cookie
        .split(";")
        .map(str => str.split("="))
        .filter(pair => pair[0] === "cookie")
        .map(pair => pair[1])[0];

    if (encoded !== undefined) {
        let toload = JSON.parse(decodeURIComponent(encoded));
        if (toload['dinoseen'] !== undefined) {
            locationsunlocked = toload['locationsunlock'];
            founddinosaurs = toload['dinoseen'];
        }
    }
}



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
        //Adding highlighting to areas on the world map, changing the visibility depending on if the locations is unlocked or not
        if (locationsunlocked.includes(alllocations[i])) {
            highLightArea("#" + allareas[i], "00ad50", 0.7);
            hoverNew("#" + allareas[i], "00fc50", "00ad50")
            clickonLocation(allareas[i], alllocations[i]);
        } else {
            document.getElementById(allareas[i]).addEventListener("click", event => event.preventDefault());
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
            // let audio = new Audio("../sound/trexroar.mp3");
            // audio.play();
            const trexroar = document.getElementById("trexroar");
            trexroar.volume = 0.03;
            trexroar.play();
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
                    if (location === "smlt" && (!locationsunlocked.includes("orlt"))) {
                        alert("You have unlocked another region!")
                        locationsunlocked.push("orlt");
                    } else if (location === "orlt") {
                        alert("Thanks for playing! That is everything to this part of the website. You can check out the collection to see all the dinosaurs or references to do further reading on the dinosaurs.")
                    }
                    else {
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

//Shuffle code to randomise order of answers
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
        $(element).data('maphilight', { "stroke": false, "fillColor": color, "fillOpacity": 0.7, "alwaysOn": true });
        $('#mapping').maphilight();
    }, () => {
        $(element).data('maphilight', { "stroke": false, "fillColor": othercolor, "fillOpacity": 0.7, "alwaysOn": true });
        $('#mapping').maphilight();
    });
};
