

function loadSources() {
  // AJAX request to fetch sources.json from server

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // Update dropdowns
      sources = JSON.parse(this.responseText);
      var options = sources.map(s => "<option>" + s + "</option>").join("");
      ['stream1sources', 'stream2sources'].forEach(function (id) {
        document.getElementById(id).innerHTML = options;
      });
    }
  };
  // HTTP basic auth set here, but not checked
  xhttp.open("GET", "sources.json", true, "user", "pass");
  xhttp.send();
}

// Send update commands to server in format <URL>/<stream>/<action> and a JSON body of "{ source: <source> }"
function sendUpdate(stream, action) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    // Report errors
    if (this.readyState == 4 && this.status != 200) {
      alert("Error " + this.status + ": " + this.responseText);
    }
  };
  // HTTP basic auth set here, but not checked
  xhttp.open("PUT", "/api/v1/routing/" + stream, true, "user", "pass");
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify({ source: document.getElementById(stream + "source").value }));
}

// call the fetcher on load
loadSources();