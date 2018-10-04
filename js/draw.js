let CHART_WIDTH = 900;
let CHART_HEIGHT = 300;

var data = []; // the variable that holds the data from csv file
var category_colors = {
	// "clothing, beauty, & fashion": "#5B7BE9",
	// "computers & internet": "#E0D22E",
	// "education": "#2CCEF6",
	// "food & drink": "#FB7F23",
	// "grab bag": "#D63CA3",
	// "health & fitness": "#c38014",
	// "home & garden": "#E24062",
	// "human relations": "#5BB923",
	// "law & government": "#555",
	// "media & arts": "#B190D0",
	// "pets & animals": "#bcc832",
	// "religion & philosophy": "#ee7b9c",
	// "science & nature": "#f299b3",
	// "shopping": "#01d99f",
	// "society & culture": "#177d62",
	// "sports, hobbies, & recreation": "#a16c2f",
	// "technology": "#a2262a",
	// "travel & transportation": "#f29a76",
	// "work & money": "#88a8b9",
	// "writing & language": "#a46067"
};

$(document).ready(function () {
	loadData();
	
});


function loadData() {
	//code for Q1 goes here
	d3.csv("data/data.csv", function(d) {         
		data = d;      
		data.forEach(function (item) {item.n = parseInt(item.n);   
		});
		visualizeBubbleChart();
		// visualizeBubbleChart();  
		// visualizeSmallMultipleBarChart(groupDataByCategory())     
	}); 

}
const visualizeBubbleChart = () =>{
	console.log("draw")
	var chartdiv = d3.select("#chart").append("div").attr("id" ,  "holder").attr("class",  "chartholder");
	var svg=chartdiv.append("svg")
		.attr("class",  "bubblesets") 
		.attr("width", CHART_WIDTH)
		.attr("height", CHART_HEIGHT)
		.append("g")
		.attr("transform","translate(100, 100)");

	var defs = svg.append("defs");
	var linearGradient = defs.append("linearGradient")
	.attr("id", "linear-gradient");

	var coloursYGB = ["#FFFFDD","#AAF191","#80D385","#61B385","#3E9583","#217681","#285285","#1F2D86","#000086"];
	var colourRangeYGB = d3.range(0, 1, 1.0 / (coloursYGB.length - 1));
	colourRangeYGB.push(1);
			   
	//Create color gradient
	var colorScaleYGB = d3.scaleLinear()
		.domain(colourRangeYGB)
		.range(coloursYGB)
		.interpolate(d3.interpolateHcl);

	//Needed to map the values of the dataset to the color scale
	var colorInterpolateYGB = d3.scaleLinear()
		.domain(d3.extent(data.map(item =>{
			// console.log(item.level)
			return item.level
		})))
		.range([0,1]);

	

	var xScale = d3.scaleLinear().domain([0, 30]).range([0, CHART_WIDTH]);

	var simulation = d3.forceSimulation(data)
	    .force('charge', d3.forceManyBody().strength(1))
	    .force('x', d3.forceX(function(d) {
	    	// console.log("xScale",parseInt(xScale(d.level)))
			return xScale(d.level);
	    }))
	    .force('y', d3.forceY(function(d) {
			return 0;
	    }))
	    .force('collision', d3.forceCollide().radius(function(d) {
			return d.population/1000000;
	    }))
	    .on('tick', ticked());

    function ticked() {
		var u=d3.select('svg g')
		.selectAll(".bubble")
		.data(data);
		
		u.enter()
		.append("circle")
		.attr("class", function(d){return "bubble bubble"+d.code})
		.attr("r", function(d) { 
			return parseInt(d.population/1000000); })
		.style("fill", 
			function(d){ 
			return colorScaleYGB(colorInterpolateYGB(d.level)
			)}
		)
		.merge(u)
		.attr('cx', 
			function(d) {
			console.log("d", d)
			console.log("dx + dcode", d.x, d.code)
	      return d["x"];
	    }
	    )
	    .attr('cy', d=> d.y
	    );
		u.exit().remove();
	}

	  //   
	// svg.selectAll(".bubble")
	// .data(data)
	// .enter().append("circle")
	// .attr("class", "bubble")
	// .attr("r", function(d) { 
	// 	return parseInt(d.population/1000000); })
	// .style("stroke", "#fff")
	// .style("stroke-width", "1px")
	// .style("fill", 
	// 	function(d){ 
	// 	// return "#eeeeee"
	// 	return colorScaleYGB(colorInterpolateYGB(d.level)
	// 	)}
	// )
	// .merge(svg)
	// .attr('cx', function(d) {
 //      return d.x;
 //    })
 //    .attr('cy', function(d) {
 //      return d.y;
 //    });
	

}

