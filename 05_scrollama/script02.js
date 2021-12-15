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
  .domain([0,1,2,3])
  .range(["#acebf6","#f9cdc2","#9a78aa","#dae48f"])




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


  // add color to current step only
  step
    .filter(function(d, i) {
      return i === response.index
    })
    .classed("is-active", true)
}


///handleStepExit: what should happen if we exit a Step?
function handleStepExit(response) {
  console.log(response.index + " " + response.direction)

  // remove color from current step
  step
    .filter(function(d, i) {
      return i === response.index
    })
    .classed("is-active", false)

}



///handleStepExit: what should happen during a step between Enter and Exit?
function handleStepProgress(response) {
  console.log(response.progress)


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
