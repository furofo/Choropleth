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
 // console.log("logging max and min of bacelors here");
  //console.log(d3.max(education, d => d.bachelorsOrHigher)); //75.1 is max
  //console.log(d3.min(education, d => d.bachelorsOrHigher)); // 2.6 is min
  let colorScale = d3.scaleThreshold()
                      .domain([10, 20, 30, 40, 50, 60])
                      .range(["#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"]);
  //let colors = d3.scaleOrdinal(d3.schemeBlues[9]); // scale crhomatic color brewer color schme
  // this is array of colors from schem blues  ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"]
  // wnant to use a threshold scale and threshold invert extent

  
  svg.append("g")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", function(d) {
        let educationArr = idMatch(d);
        //console.log(" hey its me d again");
       // console.log(educationArr[0].bachelorsOrHigher);
        return colorScale(educationArr[0].bachelorsOrHigher);})
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
        let educationArr = idMatch(d);
        //console.log(" hey its me d again");
       // console.log(educationArr[0].bachelorsOrHigher);
        let fillColor = colorScale(educationArr[0].bachelorsOrHigher);
        d3.select(this).attr("fill", fillColor);
        tooltip.style("display", "none");
      });

  let gXscale = d3.scaleLinear()
                  .domain([0, 60])
                  .range([0, 300]); // takes array takes array takes array DO NOT FORGET BrACKETS GRRR
  
  console.log('this is gscale');
  console.log(gXscale(10));
  let g = svg.append('g');
  g.attr('id', "legend");
  
  g.selectAll("rect")
    .data(colorScale.range().map(function(color) {
      var d = colorScale.invertExtent(color);
      if(d[0]== undefined) {d[0] = 0};
      if(d[1]== undefined) {d[1] = 60};
      console.log("this is d");
      console.log(d);
      return d;
      
    }))
  .enter()
  .append("rect")
  .attr('height', 8)
  .attr('fill', function(d) { return colorScale(d[0])})
  .attr('x', function(d) {return gXscale(d[0])})
  .attr('width', function(d) {
   // console.log(d[1]);
    //console.log(d[0]);
   // console.log("here comes the x scale choo choo");
   // console.log(gXscale(d[1]));
     return gXscale(d[1]) - gXscale(d[0]);
     });
  }

  
});


