            
// Set Frame dimensions for visualizations
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// ----------- SCATTERPLOT PROCESSING ------------------
// Make svg to house visualization
const FRAME1 = d3.select("#scatterplot") 
.append("svg") 
    .attr("height", FRAME_HEIGHT)   
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame"); 

// Scatterplot function
d3.csv("data/scatter-data.csv").then((data) => { 

    // x-Scale
    let x = d3.scaleLinear()
    .domain([0, 10])
    .range([ 0, FRAME_WIDTH - MARGINS.left - MARGINS.right]);
    // Add X-axis
    FRAME1.append("g")
    .attr("transform", "translate(" +  MARGINS.left +","+ (FRAME_HEIGHT - MARGINS.top) + ")")
    .call(d3.axisBottom(x));

    // y-Scale
    let y = d3.scaleLinear()
    .domain([0, 10])
    .range([FRAME_HEIGHT- MARGINS.top - MARGINS.bottom, 0]);
    // Add Y axis
    FRAME1.append("g")
    .attr("transform", "translate(" + MARGINS.left + ","+ MARGINS.top +")")
    .call(d3.axisLeft(y));

    // Function to dd event listeners to all circles in visualization
    function circleEvents(){
        FRAME1.selectAll(".circles")
        // When hovering, change fill of the circle, and when the mouse leaves, change it back
        .on("mouseover", function(d) {
            d3.select(this).style("fill", "red");
            })
            .on("mouseout", function(d) {
            d3.select(this).style("fill", "lightsalmon");
            })
            // When the circle is clicked, update lastClicked and the stroke
            .on("click", function(d){
            // Update last clicked in text when circle is clicked
            let last_clicked = d3.select(this).attr("id")
            d3.select("#coordinates").text(last_clicked)
            // Check if stroke exists, and change accordingly
            if(d3.select(this).style('stroke') == 'teal'){
                d3.select(this).style("stroke", "none");
            }
            else{
                d3.select(this).style("stroke", "teal");
                d3.select(this).style("stroke-width", "3px");
            }
        });
    };

    // Add initial points from data
    FRAME1.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
        .attr("class", "circles")
        .attr("id", (d) => {return "(" + d.x + ", " + d.y + ")"} )
        .attr("cx", (d) => { return x(d.x) + MARGINS.left; } )
        .attr("cy", (d) =>{ return y(d.y) + MARGINS.top; } )
        .attr("r", 5);
    // Add Event listeners to them
    circleEvents();

    // Data for dropdown menus
    let dropdown = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

    //   Populate X selection dropdown menu
    d3.select("#selectX")
        .selectAll('myOptions')
        .data(dropdown)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; });

    //   Populate X selection dropdown menu
    d3.select("#selectY")
        .selectAll('myOptions')
        .data(dropdown)
        .enter()
        .append('option')
        .text(function (d) { return d; }) 
        .attr("value", function (d) { return d; });
      
    // Select the addpoint button, and when clicked, get the values from dropdowns and add them to the plot
    d3.selectAll(".button")
        .on("click", function(d){
        // Get the values from dropdowns
        let xVal = document.getElementById("selectX").value;
        let yVal = document.getElementById("selectY").value;
        // let xVal = (d3.select("#selectX")).attr("value");
        // let yVal = (d3.select("#selectY")).attr("value");
        console.log(xVal, yVal);
        // Add correspoinding circles in the location specified
        FRAME1.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
            .attr("class", "circles")
            .attr("id", (d) => {return "(" + xVal + ", " + yVal + ")"} )
            .attr("cx", (d) => { return x(xVal) + MARGINS.left; } )
            .attr("cy", (d) =>{ return y(yVal) + MARGINS.top; } )
            .attr("r", 5);
        // Update event listeners to the new circles
        circleEvents();

    });
});  



// -------------------------- BAR CHART PROCESSING --------------------------------------- 
// Add new svg to house the bar chart
const FRAME2 = d3.select("#barchart") 
    .append("svg") 
    .attr("height", FRAME_HEIGHT)   
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

// Bar Chart function
d3.csv("data/bar-data.csv").then((data) => {

    // Add X Axis
    let x = d3.scaleBand()
        .range([ 0, FRAME_WIDTH - MARGINS.left - MARGINS.right ])
        .domain(data.map(function(d) { return d.category; }))
        .padding(0.2);
    FRAME2.append("g")
        .attr("transform", "translate(" +  MARGINS.left +","+ (FRAME_HEIGHT - MARGINS.top) + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "middle");

    // Set height of visualization based on highest value
    const Y_MAX = d3.max(data, (d) => { return parseInt(d.amount); });

    // Add Y axis
    let y = d3.scaleLinear()
        .domain([0, Y_MAX+5])
        .range([FRAME_HEIGHT- MARGINS.top - MARGINS.bottom, 0]);
    FRAME2.append("g")
        .attr("transform", "translate(" +  MARGINS.left +","+(MARGINS.top)+ ")")
        .call(d3.axisLeft(y));

    // Add Bars
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
        .attr("height", function(d) { 
            return FRAME_HEIGHT- MARGINS.top - MARGINS.bottom - y(d.amount); 
        });


    // Create tooltip for the barchart
    let tooltip = d3.select("#barchart")
        .append("div")
        .attr("class", "tooltip");
    
    // Add event listeners to tooltip
    FRAME2.selectAll(".bars")
    .on("mouseover", function(d) {
        // Change the color of the bar being hovered over
        d3.select(this).style("fill", "#CF9FFF");
    })
    .on("mousemove", function(event, d){
        //  console.log(d3.pointer(event));
        // Get the category and amount of the bar being hovered over
        let category = d3.select(this).attr("category");
        let amount = d3.select(this).attr("amt");
        
        // Get the location of the mouse pointer
        const [mouseX, mouseY] = d3.pointer(event, this);
        // Change the tooltips content and location 
        tooltip.html("Category: " + category + "<br>" + "Amount: " + amount)
            .style("opacity", 1)
            .style("left", mouseX + 10 + "px")
            .style("top", mouseY + 10 + "px");

    })
    .on("mouseout", function(d) {
        // Switch back to original color and hide content
        d3.select(this).style("fill", "lavender");
        tooltip.style("opacity", 0);
    });
      
});



