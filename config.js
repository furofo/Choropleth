
$(document).ready(function() {
    fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json')
      .then(response => response.json())
      .then(data => {
          let json = JSON.parse(JSON.stringify(data));
          console.log(json);
      })
});

