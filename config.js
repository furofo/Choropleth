$(document).ready(function() {
  let body = d3.select("body");
  let svg = d3.select("svg");
  var path = d3.geoPath();
  let tooltip = d3.select(".svgdiv") //logic for tooltip later hidden by default
                  .append("div")
                  .style("position", "absolute")
                  .style("z-index", "10")
                  .style("visiblity", "hidden")
                  .style("background", "#ddd")
                  .text("a simple tooltip")
                  .attr("id", "tooltip");
                  
  const EDUCATION_FILE = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json'; // this is  alink to eductation file 
  const COUNTY_FILE = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json';  //this is link for counties file used to draw counties
  d3.queue() // way to handles thing asyncronyls in v4 d3 expects an await function with typical paramter of ready and an optional number of args for each file/ json object it is waiting for
      .defer(d3.json, COUNTY_FILE)
      .defer(d3.json, EDUCATION_FILE)
      .await(ready);
  function ready(error, us, education){ // takes three args, first is error message if fails, 2nd is the County File called US, Third is EducationFILE called Education
  if(error) throw error; // if an error tells us what it is
  let idMatch = function(currentData) { // this is a function that takes a data object and compares its id with the fips of another object
      let filteredEducation = education.filter((d) => d.fips == currentData.id); // in this case object it takes is county file and object it compares to is educatin
      return filteredEducation; // it gets the object within education that mathces the id of counties basically 
  }
  let colorScale = d3.scaleThreshold() // logic for color scale 2.6 is min value for Bachelors and 75.1 is max so wrote a threshold scale up to 60 to categorize this accordingly
                      .domain([10, 20, 30, 40, 50, 60])
                      .range(["#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"]);
  svg.append("g")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features) // topoJson is extension of GeJSon that uses line segments called arcs which objects from county_file contains multipe features
                                // feature is method to convert TopoJSON to GEoJSON takes two arguments toplogy and object
                                // toplogy is given us json object which has a type property of topology hence why it was used
                                // it is given object argument of us.objects.coutneis which has property of type geomertyr collection and gemotries
                                // in docs says  Then, if the object is a GeometryCollection, a FeatureCollection is returned, and each geometry in the collection is mapped to a Feature.
                                // so this means because us.objects.counties is a gemotry collection it ruturns  a feature collection objcetct
                                // this object has type and features properties
                                // we want features for the data since these contains the svg d data we need to draw path later
      .enter()
      .append("path")
      .attr("d", path) // calls path on the current feature object which is d3.getpath which when geiven Geojson gemoetry or feature object generates the d path of SVG which has in
                        // insturctions to draw the counties bascially, this loops through every single object in the features property of the topojson.feature object in the data argument
                        // and draws its path
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
                  .range([0, 300])
                  ; // takes array takes array takes array DO NOT FORGET BrACKETS GRRR
  
  console.log('this is gscale');
  console.log(gXscale(10));
  let g = svg.append('g');
  let xAxis = d3.axisBottom(gXscale) 
    // only show every 10 tick or every 10th year
               .tickValues( gXscale.ticks( 5 ).concat( gXscale.domain() ) )
              .tickFormat(function(d) {
                return d + '%';
              });
                
  g.attr('id', "legend");
  
  g.selectAll("rect")
    .data(colorScale.range().map(function(color) {
      var d = colorScale.invertExtent(color);
      if(d[0]== undefined) {d[0] = 0};
      if(d[1]== undefined) {d[1] = 60};
      return d;
      
    }))
  .enter()
  .append("rect")
  .attr('height', 20)
  .attr('fill', function(d) { return colorScale(d[0])})
  .attr('x', function(d) {return gXscale(d[0])})
  
  .attr('width', function(d) {
     return gXscale(d[1]) - gXscale(d[0]);
     })
  .attr('transform', 'translate(570, 22)');

  g.append("g")
    .attr('id', "x-axis")
    .attr('transform', 'translate(570, 44)')
    .call(xAxis);
  }

  

  
});


