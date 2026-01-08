fetch("https://chronoframesbackend.onrender.com/api/templates/stats/dashboard")
    .then(res => res.json())
    .then(data => {
        document.getElementById("views").innerText = data.views;
        document.getElementById("likes").innerText = data.likes;
        document.getElementById("templates").innerText = data.templates;
    });
