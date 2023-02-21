            
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};


const FRAME1 = d3.select("#scatterplot") 
.append("svg") 
    .attr("height", FRAME_HEIGHT)   
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame"); 

// Next, open file 
d3.csv("data/scatter-data.csv").then((data) => { 

    // let's check our data
    console.log(data); //Notice this data has 3 columns
                        // to access data in a column, use .

    var x = d3.scaleLinear()
    .domain([0, 10])
    .range([ 0, FRAME_WIDTH - MARGINS.left - MARGINS.right]);
    
    // Add X-axis
    FRAME1.append("g")
    .attr("transform", "translate(" +  MARGINS.left +","+ (FRAME_HEIGHT - MARGINS.top - MARGINS.bottom) + ")")
    .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, 10])
    .range([ FRAME_HEIGHT- MARGINS.top - MARGINS.bottom, 0]);

    FRAME1.append("g")
    .attr("transform", "translate(" + MARGINS.left + ", 0)")
    .call(d3.axisLeft(y));

    // Add dots
    FRAME1.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
        .attr("class", "circles")
        .attr("cx", (d) => { return x(d.x) + MARGINS.left; } )
        .attr("cy", (d) =>{ return y(d.y); } )
        .attr("r", 5)
        .style("fill", "lightsalmon");


    function handleMouseover(event, d) {
        // on mouseover, make opaque 
        d.style("fill", "red"); 
        
    };

    FRAME1.selectAll(".circles")
    .on("mouseover", function(d) {
        d3.select(this).style("fill", "red");
      })
      .on("mouseout", function(d) {
        d3.select(this).style("fill", "lightsalmon");
      })
      .on("click", function(d){
        if(d3.select(this).style('stroke') == 'blue'){
            d3.select(this).style("stroke", "none");
        }
        else{
            d3.select(this).style("stroke", "blue");
            d3.select(this).style("stroke-width", "3px");

        }
      }); //add event listeners

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // const MAX_Y = d3.max(data, (d) => { return d.x; }); 
    // const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 
    // const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom
    // const Y_SCALE = d3.scaleLinear() // linear scale because we have 
    // // linear data 
    //     .domain([MAX_Y, 0]) 
    //     .range([0, VIS_HEIGHT]); 
    

    // FRAME1.selectAll("points")  
    // .data(data)  
    // .enter()       
    // .append("circle")  
    //     .attr("cx", (d) => {return d.x + MARGINS.left})  
    //     .attr("cy", (d) => {return (Y_SCALE(d.y) + MARGINS.top);})
    //     .attr("r", 5)
    //     .attr("class", "point"); 
    // // add our circles with styling 
    // // FRAME1.selectAll("circle") 
    // //     .data(data) // this is passed from  .then()
    // //     .enter()  
    // //     .append("circle")
    // //       .attr("cx", (d) => { return d.x; }) // use x for cx
    // //       .attr("cy", (d) => { return d.y; }) // use y for cy
    // //       .attr("r", 5)  // set r 
    // //       .attr("fill", (d) => { return d.color; }); // fill by color
  
  });  
