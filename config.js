
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
  svg.append("g")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "black")
      .attr("class", "county")
      .on("mouseover", function(d, i) {
        d3.select(this).attr("fill", "red");
        tooltip
          .style("left", d3.event.pageX - 50 + "px")
          .style("top", d3.event.pageY - 125 + "px")
          .style("visiblity", "visible")
          .style("display", "inline-block")
          .style("background", "black")
          .style("color", "white")
          .style("opacity", "0.8")
          .style("padding-left: 10px")
          .style("padding-right: 10px")
          .style("padding-bottom: 10px")
          .style("padding-top: 10px")
          .html("this is a simpet tool tip test")
      })
      .on("mouseout", function(d) {
        d3.select(this).attr("fill", "black");
        tooltip.style("display", "none");
      });
  }
});


