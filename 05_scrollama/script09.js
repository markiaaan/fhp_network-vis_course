// defining variables just for convenience of being able to stuff without having to select everything anew each time
var main = d3.select("main")
var scrolly = main.select("#scrolly")
var figure = d3.select("figure")
var svg = d3.select("#visualization")
var article = scrolly.select("article")
var step = article.selectAll(".step")
var houseSVG = d3.select("#houseSVG") // define a variable for our new houseSVG

// initialize the scrollama
var scroller = scrollama();

// generic window resize listener event: we need this to resize our content when we resize our browser window
function handleResize() {
  var figureHeight = window.innerHeight - 100;
  var figureMarginTop = (window.innerHeight - figureHeight) - 50;

  figure
    .style("height", figureHeight + "px")
    .style("top", figureMarginTop + "px");

  // tell scrollama to update new element dimensions
  scroller.resize();
}

//create a scale for the color-change of the backgrorund
var colorScale = d3.scaleOrdinal()
  .domain([0, 1, 2, 3])
  .range(["#acebf6", "#f9cdc2", "#9a78aa", "#dae48f"])

//create a Scale for the Color-Change of the progress bar
var progressBarColor = d3.scaleLinear()
  .domain([0, 1])
  .range(["grey", "blue"])

//create a Scale for the Cloud-Movement
var cloudeMovementScale = d3.scaleLinear()
  .domain([0, 1])
  .range([0, -800])


///add a new variable progressStatus that appends a svg-text-element to our svg and position it somewhere in the visualization block
var progressStatus = svg.append("text")
  .attr("x", "50px") //x-position
  .attr("y", "50px") //y-position
  .text("0") //what does the text say?

//add a rectangle as background for a progress Bar indicating the max. width for 100%
var progressGoalBar = svg.append("rect")
  .attr("x", "50px")
  .attr("y", "50px")
  .attr("height", "20px")
  .attr("width", "800px")
  .style("fill", "white")

//add a progressBar. The width will be changed in handleStepProgress
var progressBar = svg.append("rect")
  .attr("x", "50px")
  .attr("y", "50px")
  .attr("height", "20px")
  .attr("width", "0px")
  .style("fill", "black")

//first image
var firstSlideImage = svg.append("image")
  .attr("xlink:href", "img/image01.jpg") // path to the image
  .attr("x", "50px")
  .attr("y", "100px")
  .attr("width", "800px")
  .attr("height", "400px")
  .style("opacity", 0)


//second image
var secondSlideImage = svg.append("image")
  .attr("xlink:href", "img/image02.gif")  // path to the image
  .attr("x", "200px")
  .attr("y", "200px")
  .attr("width", "520px")
  .attr("height", "292px")
  .style("opacity", 0)




houseSVG.selectAll("path") // selectAll path-Elements inside houseSVG
  .on("mouseover", function(d, i) { //on mouseOver change the hovered path-Element (this) to blue
    d3.select(this).transition().style("fill", "blue")
  })
  .on("mouseout", function(d, i) { //on mouseOut change the hovered path-Element (this) back to its original color
    d3.select(this).transition().style("fill", null)
  })



//select the element with the id "#clickhier". In our case it is a span element in the text. #clickhier is also styled in the css file
d3.select("#clickhier")
  .on("click", function(d, i) { //clicking on "#clickhier" changes the color of the element with the class st0 in our houseSVG to orange

    houseSVG.select(".st0")
      .transition()
      .duration("800")
      .style("fill", "orange")

  })



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


  svg.style("background-color", colorScale(response.index)) //change the background-color of our SVG based on response.index and and a color scale


  if (response.index == 0) {   //only do something on first slide (index = 0)
    firstSlideImage.transition().duration(1000).style("opacity", 1) //change opacity of the image to 1 to fade in the image
  } else if (response.index == 1) {   //only do something on second slide (index = 1)
    secondSlideImage.transition().duration(1000).style("opacity", 1) //change opacity of the image to 1 to fade in the image
  } else if (response.index == 2 || response.index == 3) { //only do something on third slide (index = 2) OR fourth Slide (index = 3)
    houseSVG
      .style("display", "block") //change display of the houseSVG to block to display it (it was set to "none" before in the css to not display it in the beginning)
      .transition()
      .duration(1000)
      .style("opacity", 1)
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
    firstSlideImage.transition().duration(1000).style("opacity", 0) //change opacity of the image to 0 to fade out
  } else if (response.index == 1) {   //only do something on second slide exit
    secondSlideImage.transition().duration(1000).style("opacity", 0) //change opacity of the image to 0 to fade out
  } else if (response.index == 2 && response.direction == "up") { // if we leave slide two only do this step if the direction goes upwoards
    houseSVG
      .style("display", "none")
      .style("opacity", 0)
  }



  // remove color from current step
  step
    .filter(function(d, i) {
      return i === response.index
    })
    .classed("is-active", false)

}



///handleStepProgress: what should happen during a step between Enter and Exit?
function handleStepProgress(response) {

  //change the text of progressStatus depending on the Scroll-Position together with the textbox-index
  progressStatus
    .text(function(d, i) {
      return response.index + response.progress
    })

//change the width of the progressBar depending on response.progress (Scroll-Progress) and after that do the same for the color using a d3.scale
  progressBar
    .attr("width", response.progress * 800)
    .style("fill", progressBarColor(response.progress))


///do only on the fourth (index=3) text-block
  if (response.index == 3) {

    ///select all elements in houseSVG with the id "#step2" and use transform/translate to move the clouds based on response.progressStatus
    //translate works like this: translate(x-value, y-value). we only change the x-value
    houseSVG.selectAll("#step2")
      .attr("transform", "translate(" + cloudeMovementScale(response.progress) + ", 0)")
  }



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
      offset: 0.2, // on what position of the page should events be triggered?
      progress: true,
      debug: true, //if you set debug to false the debug stripe won't be shown anymore
    })
    .onStepEnter(handleStepEnter)
    .onStepProgress(handleStepProgress)
    .onStepExit(handleStepExit)



  // setup resize event
  window.addEventListener("resize", handleResize);
}

// kick things off
init();
