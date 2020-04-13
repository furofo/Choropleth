
$(document).ready(function() {
  let body = d3.select("body");
  let svg = d3.select("svg");
  let width = 2000;
  let height = 2000;

  
  var path = d3.geoPath();
  console.log('this should be geopath?');
  let feature = {
    "type": "Feature",
    "id": 18049,
    "properties": {},
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            649.1057769641899,
            236.3490012887262
          ],
          [
            655.5730607623997,
            235.65348589750747
          ],
          [
            655.8029642049944,
            237.6231387281017
          ],
          [
            656.7525653809294,
            237.49455605073354
          ],
          [
            656.8525233994488,
            238.4823047996072
          ],
          [
            658.0720112253864,
            238.33618812077972
          ],
          [
            658.161973442054,
            239.3122475353472
          ],
          [
            654.4735225586854,
            239.77397624044198
          ],
          [
            654.6634427938725,
            241.70271640096453
          ],
          [
            649.6755376697508,
            242.2112024432841
          ],
          [
            649.1057769641899,
            236.3490012887262
          ]
        ]
      ]
    }
  }

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
      .attr("class", "counties");
  }
});


