// defining variables just for convenience of being able to stuff without having to select everything anew each time
var main = d3.select("main")
var scrolly = main.select("#scrolly");
var figure = d3.select("figure")
var svg = d3.select("#visualization")
var article = scrolly.select("article");
var step = article.selectAll(".step");

// initialize the scrollama
var scroller = scrollama();

// generic window resize listener event: we need this to resize our content when we resize our browser window
function handleResize() {
  var figureHeight = window.innerHeight - 100
  var figureMarginTop = (window.innerHeight - figureHeight) - 50

  figure
    .style("height", figureHeight + "px")
    .style("top", figureMarginTop + "px");

  // tell scrollama to update new element dimensions
  scroller.resize();
}



var colorScale = d3.scaleOrdinal()
  .domain([0, 1, 2, 3])
  .range(["#acebf6", "#f9cdc2", "#9a78aa", "#dae48f"])

var progressBarColor = d3.scaleLinear()
  .domain([0, 1])
  .range(["grey", "blue"])

///add a new variable progressStatus that appends a svg-text-element to our svg and position it somewhere in the visualization block
var progressStatus = svg.append("text")
  .attr("x", "50px") //x-position
  .attr("y", "50px") //y-position
  .text("0") //what does the text say?

//add a progressBar
var progressGoalBar = svg.append("rect")
  .attr("x", "50px")
  .attr("y", "50px")
  .attr("height", "20px")
  .attr("width", "800px")
  .style("fill", "white")

var progressBar = svg.append("rect")
  .attr("x", "50px")
  .attr("y", "50px")
  .attr("height", "20px")
  .attr("width", "0px")
  .style("fill", "black")


//first image
var firstSlideImage = svg.append("image")
  .attr("xlink:href", "img/image01.jpg")
  .attr("x", "50px")
  .attr("y", "100px")
  .attr("width", "800px")
  .attr("height", "400px")
  .style("opacity", 0)


//second image
var secondSlideImage = svg.append("image")
  .attr("xlink:href", "img/image02.gif")
  .attr("x", "200px")
  .attr("y", "200px")
  .attr("width", "520px")
  .attr("height", "292px")
  .style("opacity", 0)





////////////////////////////////////////////////////////In here we define what happens on scrolling
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// scrollama event handlers
// response.element  --> returns the current element/text paragraph
// response.direction --> returns the direction
// response.index --> returns the index of the current element, which in our case is the same as the "data-step"-attribute and the index of the step elements
// response.progress --> returns the position/scrolling progress of a paragraph in percentages, starting with 0 and ending with 1. We can use that for scroll-triggered animations


///handleStepEnter: what should happen if we enter a Step?
function handleStepEnter(response) {


  svg.style("background-color", colorScale(response.index))

  //only do something on first slide
  if (response.index == 0) {
    firstSlideImage.transition().duration(1000).style("opacity", 1)
  } else if (response.index == 1) {
    secondSlideImage.transition().duration(1000).style("opacity", 1)
  }


  // add color to current step only
  step
    .filter(function(d, i) {
      return i === response.index
    })
    .classed("is-active", true)
}


///handleStepExit: what should happen if we exit a Step?
function handleStepExit(response) {


  //only do something on first slide exit
  if (response.index == 0) {
    firstSlideImage.transition().duration(1000).style("opacity", 0)
  } else if (response.index == 1) {
    secondSlideImage.transition().duration(1000).style("opacity", 0)
  }



  // remove color from current step
  step
    .filter(function(d, i) {
      return i === response.index
    })
    .classed("is-active", false)

}



///handleStepExit: what should happen during a step between Enter and Exit?
function handleStepProgress(response) {
  progressStatus
    .text(function(d, i) {
      return response.index + response.progress
    })

  progressBar
    .attr("width", response.progress * 800)
    .style("fill", progressBarColor(response.progress))


}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////








function setupStickyfill() {
  d3.selectAll(".sticky").each(function() {
    Stickyfill.add(this);
  });
}


///general setup: interesting for you here will be mainly offset and debug
function init() {
  setupStickyfill();

  // 1. force a resize on load to ensure proper dimensions are sent to scrollama
  handleResize();

  // 2. setup the scroller passing options
  // 		this will also initialize trigger observations
  // 3. bind scrollama event handlers (this can be chained like below)
  scroller.setup({
      step: "#scrolly article .step",
      offset: 0.2,
      progress: true,
      debug: true,
    })
    .onStepEnter(handleStepEnter)
    .onStepProgress(handleStepProgress)
    .onStepExit(handleStepExit)



  // setup resize event
  window.addEventListener("resize", handleResize);
}

// kick things off
init();
