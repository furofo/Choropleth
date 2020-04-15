


$(document).ready(function() {
  let body = d3.select("body");
  let svg = d3.select("svg");
  let width = 500;
  let height = 500;
  var path = d3.geoPath();
  let tooltip = d3.select(".svgdiv")
                  .append("div")
                  .style("position", "absolute")
                  .style("z-index", "10")
                  .style("visiblity", "hidden")
                  .style("background", "#ddd")
                  .text("a simple tooltip")
                  .attr("id", "tooltip");
                  
  const EDUCATION_FILE = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json'; // this is  alink to eductation file simpler the one i called json 1
  const COUNTY_FILE = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json'; 
  d3.queue()
      .defer(d3.json, COUNTY_FILE)
      .defer(d3.json, EDUCATION_FILE)
      .await(ready);
  function ready(error, us, education){
  if(error) throw error;
  let idMatch = function(currentData) {
      let filteredEducation = education.filter((d) => d.fips == currentData.id);
      return filteredEducation;
  }
  svg.append("g")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "black")
      .attr("class", "county")
      .attr("data-fips", function(d) {
        let fipsArr = idMatch(d);
        return fipsArr[0].fips;
      })
      .attr("data-education", function(d) {
        let educationArr = idMatch(d);
        return educationArr[0]["bachelorsOrHigher"];
      })
      .attr("area-name", function(d) {
        let educationArr = idMatch(d);
        return educationArr[0]["area_name"];
      })
      .on("mouseover", function(d, i) {
        d3.select(this).attr("fill", "red");
        tooltip
        tooltip
        .style("left", d3.event.pageX - 50 + "px")
        .style("top", d3.event.pageY - 125 + "px")
        .style("visiblity", "visible")
        .style("display", "inline-block")
        .style("background", "black")
        .style("color", "white")
        .style("opacity", "0.8")
        .style("padding-left", "15px")
        .style("padding-right", "15px")
        .style("padding-bottom", "15px")
        .style("padding-top", "15px")
        .style("margin", "auto")
        .style("text-align", "center")
        .attr("data-education", d3.select(this).attr('data-education'))
        .html("Percentage in " + d3.select(this).attr("area-name") + " with Bachelor's <br />" + d3.select(this).attr('data-education') + '%');
      })
      .on("mouseout", function(d) {
        d3.select(this).attr("fill", "black");
        tooltip.style("display", "none");
      });
  }

  let g = svg.append('g');
    g.attr('id', "legend");
});


