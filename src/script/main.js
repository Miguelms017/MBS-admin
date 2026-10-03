const alertSound = new Audio('./script/notification.mp3');

function servParse(service) {
    let parsed = "";

    switch (service) {
        case "menHaircut":
            parsed = "Men's Cut"
            break;

        case "womenHaircut":
            parsed = "Women's Cut"
            break;

        case "Color":
            parsed = "Hair Color"
            break;

        case "hairBrushing":
            parsed = "Brushing"
            break;

        case "waxing":
            parsed = "Eyebrows in wax"
            break;

        default:
            parsed = service
            break;
    }

    return parsed;
}

async function load() {
    try {
        //const response = await fetch('http://192.168.1.123:3000/api/Appts'); //replace with current IP address at the store location!!!
        const response = await fetch(`http://172.20.10.4:3000/api/Appts`); //replace with current IP address at the store location!!!
        const appts = await response.json();

        const container = document.getElementById('lookup');
        if (appts.length === 0) {
            container.innerHTML = "<p>No appointments Found! </p>";
            return;
        } else {
            container.style.display = 'none';
        }

        const table = document.querySelector("tbody");

        table.innerHTML = "<tr><th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Date</th><th>Hairstylist</th><th>work</th><th>Description</th></tr>";

        const filter = document.getElementById("Hairstylist").value;


        if (filter !== "Any") {
            appts.filter(a => a.Hairstylist === filter)
                .forEach(a => {
                    const item = document.createElement("tr");
                    const locale = new Date(a.Date).toLocaleString("en-US", {
                        timeZone: "America/New_York",
                        dateStyle: "short",
                        timeStyle: "short"
                    });
                    const service = servParse(a.Service);
                    item.innerHTML = `<td class="num">${a.id}</td><td>${a['First Name']} ${a['Last Name']}</td><td>${a.Phone}</td><td>${a.Email}</td><td>${locale}</td><td>${a.Hairstylist}</td><td>${service}</td><td>${a.Description}</td>`;
                    table.appendChild(item);
                });
        } else {
            appts.forEach(a => {
                const item = document.createElement("tr");
                const locale = new Date(a.Date).toLocaleString("en-US", {
                    timeZone: "America/New_York",
                    dateStyle: "short",
                    timeStyle: "short"
                });
                const service = servParse(a.Service);
                item.innerHTML = `<td class="num">${a.id}</td><td>${a['First Name']} ${a['Last Name']}</td><td>${a.Phone}</td><td>${a.Email}</td><td>${locale}</td><td>${a.Hairstylist}</td><td>${service}</td><td>${a.Description}</td>`;
                table.appendChild(item);
            });
        }

        const nums = document.querySelectorAll(".num");

        nums.forEach(num => {
            num.addEventListener("click", () => {
                if (num.style.color == 'red') {
                    num.style.color = 'black';
                    const index = array.indexOf(num.innerHTML);
                    array.splice(index, 1);
                } else {
                    num.style.color = 'red';
                    array.push(num.innerHTML);
                }
            });
        });

        console.log("successfully connected")
    } catch (err) {
        console.error(err);
        document.getElementById('lookup').innerHTML = `<p class="warnHead">Error Loading Appointments</p><p>Contact with the admin or check the console for more info</p>`
    }

}

async function erase(id) {
    const response = await fetch(`/api/Appts/${id}`, {
        method: "DELETE"
    });
}

let array = [];

function times(number) {
    // clear the current timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    // convert number into seconds
    remain = number * 60;

    // to show minutes and seconds
    let mins = remain / 60;
    let secs = remain % 60;

    clock.textContent = `${mins}:${String(secs).padStart(2, 0)}`;

    // add time button alias
    const addButton = document.getElementById('add5');

    //show button
    addButton.style.display = "block";



    // clock
    timerInterval = setInterval(() => {
        secs--;

        if (secs < 0) {
            secs = 59;
            mins--;

            if (mins < 0) {
                mins = 0;
                secs = 0;
            }
        }

        // update clock counter
        clock.textContent = `${mins}:${String(secs).padStart(2, 0)}`;

        // button behavior
        addButton.addEventListener("click", function () {
            mins = mins + 5;
        })

        //when time is over
        if (mins === 0 && secs === 0) {
            clearInterval(timerInterval); // empty clock
            clock.style.backgroundColor = 'red'; // change background
            clock.style.color = 'black'; // change letter
            addButton.style.display = "block"; // hide button
            alertSound.play(); // sound play
            alert("Time's Up!") // alert display
            return;
        }
    }, 1000);

}

load();

const pollingInterval = setInterval(load, 20000);

document.getElementById("submit").addEventListener("click", load);

//timers

//global set to 0
let remain = 0;

let timerInterval

let clock = document.getElementById("timeleft");

// button functions
document.getElementById("timer10").addEventListener("click", function () {
    times(10);
})

document.getElementById("timer20").addEventListener("click", function () {
    times(20);
})

document.getElementById("timer30").addEventListener("click", function () {
    times(30);
})

document.getElementById("timer40").addEventListener("click", function () {
    times(40);
})

document.getElementById("delete").addEventListener("click", async () => {
    const delPromises = array.map(id => erase(id));
    await Promise.all(delPromises);
    array = [];
    load();
})

// create appointments
document.getElementById("Create").addEventListener("click", menuNewAppt);

async function menuNewAppt() {
    document.getElementById("newAppt").style.display = "block";
}

document.getElementById('new').addEventListener('click', async (e) => {
    e.preventDefault();
    const data = {
        Fname: document.getElementById('Fname').value,
        Lname: document.getElementById('Lname').value || "NoSurname",
        phone: document.getElementById('Phone').value,
        email: document.getElementById('Email').value,
        date: document.getElementById('Appt').value,
        hairstylist: document.getElementById('Hairstylist').value,
        service: document.getElementById('serviceType').value,
        description: document.getElementById('Desc').value || "Description Not Available, Please Contact Customer"
    };
    try {
        const response = await fetch('/api/Appts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.success) {
            alert("Appointment created successfully!");
            document.querySelectorAll('#newAppt input').forEach(input => {
                input.value = '';
            })
        } else {
            alert("Error saving appointment.");
        }
    } catch (err) {
        console.error(err);
        alert("Server error.");
    }
    window.location.reload();
});