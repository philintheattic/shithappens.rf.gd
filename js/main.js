let displayRange = 7;
let bristolData = [];

function updateChart(days){
  displayRange = days;
  loadEntries();
}

// Register a serviceworker that updates the app automatically when files are updated on the server
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js").then((registration) => {
    console.log("Service Worker registered with scope:", registration.scope);
  }).catch((error) => {
    console.error("Service Worker registration failed:", error);
  });
}


// CODE FOR THE MAIN FUNCTIONALITY. SAVING ENTRIES AND DISPLAYING THEM ON THE SCREEN
// Speichert die eingetragenen Toilettengänge im Localstorage
function loadEntries() {
    // Holt sich die Infos aus dem LocasStorage und rendert diese in die Liste "entryList"
    const entries = JSON.parse(localStorage.getItem("toiletEntries")) || [];
    const listContainer = document.getElementById("entryList");
    listContainer.innerHTML = "";

    // Gruppiert einzelne Einträge nach Tagen
    const groupedEntries = entries.reduce((acc, entry) => {
        const dateKey = new Date(entry.date).toLocaleDateString();
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(entry);;
        return acc;
    }, {});

    for (const date in groupedEntries) {
        const dateHeading = document.createElement("h2");
        dateHeading.textContent = date;
        listContainer.appendChild(dateHeading);

        const ul = document.createElement("ul");
        groupedEntries[date].forEach((entry, index) => {
            const li = document.createElement("li");
            li.innerHTML = `${new Date(entry.date).toLocaleTimeString()} - Typ ${entry.bristol} 
                <button class="delete-btn" onclick="deleteEntry('${entry.date}')">✖</button>`;
            ul.appendChild(li);
            
        });
        listContainer.appendChild(ul);
    }

    // Speichert die Daten über die Bristol Typen an den vers Tagen in einem Objekt. Für eventuelle Statistiken und Visualisierungen
    bristolData = entries.reduce((acc, entry) => {
      const dateKey = new Date(entry.date).toLocaleDateString();
      if(!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(entry.bristol);
      return acc;
    }, {});

    // computes the average bristol type per day
    var averageBristol = Object.values(bristolData)[0].reduce((sum, value) => {return sum + value}, 0) / Object.values(bristolData)[0].length;
    
    //console.log(averageBristol);

    const allTypeMeans = [];
    for (i=0;i<Object.keys(bristolData).length;i++){
      allTypeMeans.push(Object.values(bristolData)[i].reduce((sum, value) => {return sum + value}, 0) / Object.values(bristolData)[i].length)
    }

    // Bereite die Einträge als Werte in Arrays auf um sie dann als Graphen anzuzeigen
    const allDays = Object.keys(groupedEntries);
    const allValues = Object.values(groupedEntries).map(entries => entries.length);
    
    //console.log(allTypeMeans);

    // Keep only the last n entries
    const lastDays = allDays.reverse().slice(-displayRange);
    const lastValues = allValues.reverse().slice(-displayRange);
    const lastTypeMeans = allTypeMeans.reverse().slice(-displayRange);

    // Update die Parameter des Chart Objects direkt
    shitsPerDayChart.data.labels = [...lastDays];
    shitsPerDayChart.data.datasets[0].data = [...lastValues];
    shitsPerDayChart.data.datasets[1].data = [...lastTypeMeans];

    // Update das Chart mit den neuen Werten
    shitsPerDayChart.update();
}

// Öffnet das Untermenü für die Typauswahl
function showBristolSelection() {
    document.getElementById("bristolSelection").classList.toggle("hidden");
}

// Fügt dem entries-Array einen neuen Eintrag mit Datum & Zeitstempel hinzu und ruft fann loadEntries zum updaten des HTML
function addEntry(bristolType) {
    const entries = JSON.parse(localStorage.getItem("toiletEntries")) || [];
    const newEntry = { date: new Date(), bristol: bristolType };

    //entries.push(newEntry);
    entries.unshift(newEntry);
    localStorage.setItem("toiletEntries", JSON.stringify(entries));
    loadEntries();

    document.getElementById("bristolSelection").classList.add("hidden"); // Auswahl verstecken

    
}

// Löscht Einträge aus dem Array und updatet dann mit loadEntries die Anzeige des HTML
function deleteEntry(entryDate) {
    let entries = JSON.parse(localStorage.getItem("toiletEntries")) || [];
    entries = entries.filter(entry => entry.date !== entryDate);
    localStorage.setItem("toiletEntries", JSON.stringify(entries));
    loadEntries();
}





// Beim laden der Seite die Liste mit Einträgen aus dem Localstorage füllen
window.onload = loadEntries;

// CODE FOR DISPLAYING STATS
const ctx = document.getElementById('chart');

var shitsPerDayChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [{
        label: 'Shits per Day',
        data: [],
        borderWidth: 1,
        backgroundColor: '#1cd893aa',
        order: 2
      },{
        type: 'line',
        label: '∅ Bristol-Typ',
        data: [],
        borderWidth: 2,
        borderColor: '#000000',
        backgroundColor: '#3c4043',
        order: 1
      }      ]
    },
    options: {
      responsive: true,
      
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });


// CODE FOR NAVIGATING THE SITE
// Funktionalität für die Tab Navigation
function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click()

// CODE FOR IMPORT & EXPORT FUNCTION
//ChatGPT Lösung. Exportiere die Einträge als JSON File.
function exportToJson() {
    const data = localStorage.getItem("toiletEntries");
    if (!data) {
        alert("No data to export!");
        return;
    }

    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    // Eigene Kreation :). Formatiert Date in YYYY_MM_DD Format für Dateinamen.
    const todayDate = new Date().toISOString().substring(0,10).replace(/-/g, "_");
    a.download = todayDate + ".json"; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    alert("Export successful!");
    

    //setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function importFromJson(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (!Array.isArray(importedData)) throw new Error("Invalid format");

            localStorage.setItem("toiletEntries", JSON.stringify(importedData));
            alert("Import successful!");
            loadEntries(); // Refresh the UI
        } catch (error) {
            alert("Error importing file: " + error.message);
        }
    };
    reader.readAsText(file);
}