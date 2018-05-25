"use strict";

// general sort function by object key
let sortByProperty = function(property){
    return function (x, y) {
        return ((x[property] === y[property]) ? 0 : ((x[property] < y[property]) ? 1 : -1));
    };
};

document.addEventListener("DOMContentLoaded", ()=>{
    getData("https://kea-alt-del.dk/customersupport/");
});


function getData(link) {
    console.log(link);
    fetch(link)
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            // data.forEach(function(json){
                show(data);
            // })
        });
}

function show(tickets){
    tickets = tickets.sort(sortByProperty("importance"));

    const progressBar = document.querySelector(".progress-bar");
    const ticketTemplate = document.querySelector('.ticketTemplate').content;
    let totalTickets = tickets.length;
    let solvedTickets = 0;
    let leftTickets = tickets.length;
    document.querySelector("progress").setAttribute("value", 0);
    document.querySelector(".tickets-progress").textContent = `${solvedTickets} solved out of ${totalTickets}`;
    document.querySelector(".tickets-progress-left").textContent = `${leftTickets} left`;
    console.log(`total tickets: ${totalTickets}`);
    document.querySelector("progress").setAttribute("max", totalTickets);

    tickets.forEach(function(ticket){
        let clone = ticketTemplate.cloneNode(true);
        clone.querySelector(".ticket-importance").textContent = `${ticket.importance}`;
        clone.querySelector(".ticket-color").style.backgroundColor = importanceColor(ticket.importance, 90, 50);

        function importanceColor(importanceNumber, highImp, mediumImp){
            let importanceColor = "#000";
            if(importanceNumber>highImp){
                importanceColor = "red";
            } else if(ticket.importance > mediumImp){
                    importanceColor = "yellow";
                } else {
                        importanceColor = "green";
                    }
            return importanceColor;
        }

        clone.querySelector(".button-completed").addEventListener("click", (e) => {
            console.log("remove article");
            solvedTickets++;
            leftTickets--;
            console.log(`tickets solved: ${solvedTickets}`);
            console.log(`tickets left: ${leftTickets}`);
            document.querySelector(".tickets-progress").textContent = `${solvedTickets} solved out of ${totalTickets}`;
            document.querySelector(".tickets-progress-left").textContent = `${leftTickets} left`;
            document.querySelector("progress").setAttribute("value", solvedTickets);
            e.target.parentElement.parentElement.remove(); 
            document.querySelector("progress").setAttribute("value", solvedTickets);
        })

        clone.querySelector(".read-more-button").addEventListener("click", function(e){
            // It renders the text only on click, so the DOM loads faster without the full description
            e.target.nextElementSibling.textContent = ticket.full;
            e.target.nextElementSibling.classList.toggle("hide");
            // document.querySelector(".read-more-button").textContent = "Hide details";
        })

        let middlename = function(){
            console.log(ticket)
            if(ticket.middle){
                return ticket.middle;
            }
           
            return "";
        }

        clone.querySelector(".ticket-number").textContent = ticket.importance;
        clone.querySelector(".ticket-message").textContent = ticket.message;
        clone.querySelector(".ticket-place").textContent = ticket.place;
        clone.querySelector(".ticket-name").textContent = `${ticket.first} ${middlename()} ${ticket.last}`;
        clone.querySelector(".ticket-time").textContent = `${ticket.time.day}/${ticket.time.month}/${ticket.time.year}, ${ticket.time.hour}:${ticket.time.minute}:${ticket.time.second}`;
        // clone.querySelector(".read-more-content").textContent = ticket.full;

        document.querySelector("#tickets").appendChild(clone);
    })
    
}

