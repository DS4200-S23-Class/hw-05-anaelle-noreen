            
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};


const FRAME1 = d3.select("#scatterplot") 
.append("svg") 
    .attr("height", FRAME_HEIGHT)   
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame"); 

// Scatterplot function
d3.csv("data/scatter-data.csv").then((data) => { 

    // let's check our data
    console.log(data); //Notice this data has 3 columns
                        // to access data in a column, use .

    let x = d3.scaleLinear()
    .domain([0, 10])
    .range([ 0, FRAME_WIDTH - MARGINS.left - MARGINS.right]);
    
    // Add X-axis
    FRAME1.append("g")
    .attr("transform", "translate(" +  MARGINS.left +","+ (FRAME_HEIGHT - MARGINS.top) + ")")
    .call(d3.axisBottom(x));

    // Add Y axis
    let y = d3.scaleLinear()
    .domain([0, 10])
    .range([FRAME_HEIGHT- MARGINS.top - MARGINS.bottom, 0]);

    FRAME1.append("g")
    .attr("transform", "translate(" + MARGINS.left + ","+ MARGINS.top +")")
    .call(d3.axisLeft(y));

    // Add dots
    FRAME1.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
        .attr("class", "circles")
        .attr("id", (d) => {return "(" + d.x + ", " + d.y + ")"} )
        .attr("cx", (d) => { return x(d.x) + MARGINS.left; } )
        .attr("cy", (d) =>{ return y(d.y) + MARGINS.top; } )
        .attr("r", 5)
        .style("fill", "lightsalmon");



    FRAME1.selectAll(".circles")
    .on("mouseover", function(d) {
        d3.select(this).style("fill", "red");
      })
      .on("mouseout", function(d) {
        d3.select(this).style("fill", "lightsalmon");
      })
      .on("click", function(d){
        // Update last clicked in text when circle is clicked
        let last_clicked = d3.select(this).attr("id")
        d3.select("#coordinates").text(last_clicked)

        if(d3.select(this).style('stroke') == 'blue'){
            d3.select(this).style("stroke", "none");
        }
        else{
            d3.select(this).style("stroke", "blue");
            d3.select(this).style("stroke-width", "3px");

        }
      }); //add event listeners



      console.log("lol")
      d3.selectAll(".button")
      .on("click", function(d){
        let xVal = document.getElementById("xRange").value
        let yVal = document.getElementById("yRange").value
        console.log("lol")
        console.log(xVal)
        console.log(yVal)

        FRAME1.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
        .attr("class", "circles")
        .attr("id", (d) => {return "(" + xVal + ", " + yVal + ")"} )
        .attr("cx", (d) => { return x(xVal) + MARGINS.left; } )
        .attr("cy", (d) =>{ return y(yVal) + MARGINS.top; } )
        .attr("r", 5)
        .style("fill", "lightsalmon")
        .on("mouseover", function(d) {
            d3.select(this).style("fill", "red");
          })
          .on("mouseout", function(d) {
            d3.select(this).style("fill", "lightsalmon");
          })
          .on("click", function(d){
            // Update last clicked in text when circle is clicked
            let last_clicked = d3.select(this).attr("id")
            d3.select("#coordinates").text(last_clicked)
    
            if(d3.select(this).style('stroke') == 'blue'){
                d3.select(this).style("stroke", "none");
            }
            else{
                d3.select(this).style("stroke", "blue");
                d3.select(this).style("stroke-width", "3px");
    
            }
          });
      })


  });  


// Bar Chart 
const FRAME2 = d3.select("#barchart") 
.append("svg") 
    .attr("height", FRAME_HEIGHT)   
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame"); 


d3.csv("data/bar-data.csv").then((data) => {
    console.log(data)

    // X Axis
    let x = d3.scaleBand()
        .range([ 0, FRAME_WIDTH - MARGINS.left - MARGINS.right ])
        .domain(data.map(function(d) { return d.category; }))
        .padding(0.2);

    FRAME2.append("g")
        .attr("transform", "translate(" +  MARGINS.left +","+ (FRAME_HEIGHT - MARGINS.top) + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "middle");

    const Y_MAX = d3.max(data, (d) => { return parseInt(d.amount); });
    console.log(Y_MAX);
    // Add Y axis
    
    let y = d3.scaleLinear()
    .domain([0, 100])
    .range([FRAME_HEIGHT- MARGINS.top - MARGINS.bottom, 0]);

    FRAME2.append("g")
        .attr("transform", "translate(" +  MARGINS.left +","+(MARGINS.top)+ ")")
        .call(d3.axisLeft(y));


        // Bars
    FRAME2.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bars")
    .attr("category", function(d) {return String(d.category)})
    .attr("amt", function(d) {return String(d.amount)})
    .attr("x", function(d) { return x(d.category) + MARGINS.left; })
    .attr("y", function(d) { return y(d.amount) + MARGINS.top; })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return FRAME_HEIGHT- MARGINS.top - MARGINS.bottom - y(d.amount); })
    .attr("fill", "lavender");


   
    let tooltip = d3.select("#barchart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "lightgray")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "5px");



    FRAME2.selectAll(".bars")
    .on("mouseover", function(d) {
        d3.select(this).style("fill", "#CF9FFF");
        let category = d3.select(this).attr("category");
        let amount = d3.select(this).attr("amt");
        tooltip
        .html("Category: " + category + "<br>" + "Amount: " + amount)
        .style("opacity", 1)
      })
      .on("mousemove", function(event, d){
        // console.log(d3.pointer(event));
        const [mouseX, mouseY] = d3.pointer(event, this);
        // console.log(mouseX, mouseY);
        tooltip.style("top", mouseY);
        tooltip.style("left", mouseX);

        // setPosition(mouseX + MARGINS.left, mouseY + MARGINS.top);
        // tooltip
        //   .attr('position', `(${x}, ${y})`);
      })
      .on("mouseout", function(d) {
        d3.select(this).style("fill", "lavender");
        tooltip.style("opacity", 0)
      });
       //add event listeners
      

});

// Button inputs in right section
const FRAME3 = d3.select("#selection") 
.append("div")
.attr("id", "selection"); 

// FRAME3.append("input")
// .attr("type", "number")
// .attr("id", "xRange")
// // .attr("min", "1")
// // .attr("max", "9")
// .attr("value", "Select X-Value 1-9");
let inputX = d3.select(".xRange");
console.log(inputX)


