
$(document).ready(function() {
    let json1;
    fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json')
      .then(response => response.json())
      .then(data => {
          json1 = JSON.parse(JSON.stringify(data));
          console.log(json1);
      })
});

