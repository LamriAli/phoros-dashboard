// var d3 = require('d3v4');
// var jsdom = require('jsdom');





var loadMarkers = (path) => {

}


var mapper1 = () => {

    $('#world-map-markers').mapael({
        map: {
            name: 'algeria',
            zoom: {
                enabled: true,
                maxLevel: 10
            }
        }
    })
    


    const width = 900;
    const height = 1080;



    const projection = d3.geoMercator()
        .center([2.5927734375, 28.729130483430154])
        .scale(1500)
        .translate([500, 250]);


    const path = d3.geoPath().projection(projection);

    d3.json("dzMap.json", function(error, data) {
        if (error) {
            throw error;
        }


    const tooltip = d3.select("body").append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

           

        const svg = d3.select(".map svg")
              
        svg.selectAll('path')
            .data(data.features)
            .enter()
            .append('path')
            .attr("d", path)
            .attr("id",function(d){return d.properties.ID_1})
            .attr("stroke", "red")
            .attr("fill", "rgb(162, 164, 119)")
            .on('mouseover', function(d) {
                
                tooltip
                    .style("opacity", 1)
                     
            })
            .on('mousemove', function(d) {
                // console.log("aliaali")
                tooltip.html("The exact value of<br>this cell is: " + d.value)
                    .style("left", (d3.mouse(this)[0] + 70) + "px")
                    .style("top", (d3.mouse(this)[1]) + "px")
                tooltip.transition().duration(200).style("opacity", 100);
                //Any time the mouse moves, the tooltip should be at the same position

                tooltip.style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY) + "px")
                    //The text inside should be State: rate%
                    .text(() => `${d.properties.NAME_1}`)
            })
            .on("mouseout", function(d, i) {
                tooltip.transition()
                     .duration(100)
                     .style("opacity", 0);
                tooltip
                    .style("opacity", 1)
                d3.select(this)
                    // .style("stroke", "none")
                    // .style("opacity", 0.8)
            })








    });






    




    ////////////////////////////////////////////////////////////////
    // d3.json("wells.json", (error, data) => {

    // });
}

var selected_field = {}

var send_links = {}


grapher = (name ) => {
    var width = 350,
        height = 630

    var margin = { top: 10, right: 30, bottom: 30, left: 100 }

    let node_ray = 30

    //Tooltip
    const tooltip_marker = d3.select("body").append("div")
         .attr("class", "tooltip")
         .style("opacity",   0);


    var svg = d3.select("#graph-nodes")
   sv=d3.selectAll("path")
   if (sv["_groups"][0].length!=0) {
       s=svg.select('svg')
       
      s.remove() 
   
   }
    

        svg=svg.append("svg")
        .attr("id","a")
        .attr("width", "100%")
        .attr("height", height)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    svg.append("g").attr("class","links")
    svg.append("g").attr("class","nodes")

    const nodesG = svg.select("g.nodes")
    const linksG = svg.select("g.links")

    var color = d3.scaleOrdinal(d3.schemeCategory20);
    strength=2
    collid=node_ray
    
        
     

    d3.json("json/"+name+".json", function(error, graphs) {
        
             
        send_links=graphs['links']
            svg.append('defs').append('marker')
                .attr('id', 'arrowhead')
                .attr('viewBox', '-0 -5 10 10')
                .attr('refX', 0)
                .attr('refY', 0)
                .attr('orient', 'auto')
                .attr('markerWidth', 13)
                .attr('markerHeight', 13)
                .attr('xoverflow', 'visible')
                .append('svg:path')
                .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
                .attr('fill', '#999')
                .style('stroke', 'none');
            
                var simulation = d3.forceSimulation()
                // pull nodes together based on the links between them
                .force("link", d3.forceLink().id(function(d) {
                    return d.id;
                })
                .strength(strength))
                // push nodes apart to space them out
                .force("charge", d3.forceManyBody().strength(strength))
                // add some collision detection so they don't overlap
               .force("collide", d3.forceCollide().radius(node_ray*3))
                // and draw them around the centre of the space
                .force("center", d3.forceCenter(width / 2, height / 2));
            
            /*simulation .force("link", d3.forceLink( ).distance(10) // This force provides links between nodes
                .id(function(d) { return d.id; }) // This provide  the id of a node
                .links(graphs.links) // and this the list of links
            );*/
            
            let linksData = graphs.links.map(link => {
                var obj = link;
                obj.source = link.source;
                obj.target = link.target;
                return obj;
            })
            
            const links = linksG
                .selectAll("g")
                .data(graphs.links)
                .enter().append("g")
                .attr("cursor", "pointer")
              
             
            
            const linkLines = links
                .append("path")
                .attr("id", function(_, i) {
                return "path" + i
                })
                .attr('stroke', 'black')
                .attr('opacity', 0.75)
                .attr("stroke-width", 1)
                .attr("fill", "transparent")
                .attr('marker-end', 'url(#arrowhead)')
                

                ;
            
            const linkText = links
                .append("text")
                .attr("dy", -4)
                .append("textPath")
                .attr("xlink:href", function(_, i) {
                return "#path" + i
                })
                .attr("startOffset", "50%")
                .attr('stroke',  'blue')
                .attr('opacity', 1)
                .attr("id",function(d){return d.name})
                .text((d ) => `${d.name}`)
                .on("click",clicked_link);
            
            const nodes = nodesG
                .selectAll("g")
                .data(graphs.nodes)
                .enter().append("g")
                .attr("cursor", "pointer")
                
                .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
               
                /*.on('mousemove', function (d) {
                    
                      tooltip_marker.transition()
                          .duration(200)
                          .style("opacity", .9);
                  //Any time the mouse moves, the tooltip should be at the same position
                    tooltip_marker.style("left", (d3.event.pageX) + "px")
                          .style("top", (d3.event.pageY) + "px")        
                  //The text inside should be State: rate%
                          .text(d.attributes[0].name)
                  })
                  .on("mouseout", function (d, i) {
                    tooltip_marker.transition()
                                  .duration(300)
                                  .style("opacity", 0);
                        })*/
                
             nodes.append("circle")
                .attr("r", node_ray)
                .attr("fill", "green") //function(d) { return color(d.id); } 
                .on("mouseover", mouseOver(.3))
                .on("mouseout", mouseOut)
                .on("click",clicked)
            
                nodes.append("text")
                    .attr("dy", ".35em")
                    .attr("text-anchor", "middle")
                    .text(function(d) { return d.name; });
            
            simulation
                .nodes(graphs.nodes)
                .on("tick", ticked);
            
            simulation.force("link", d3.forceLink().links(linksData)
                .id((d, i) => d.id).distance(1)
                )
                ;
            
            function ticked() {
                linkLines.attr("d", function(d) {
                var dx = (d.target.x - d.source.x),
                    dy = (d.target.y - d.source.y),
                    dr = Math.sqrt(dx * dx + dy * dy);
                return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
                });
            
                // recalculate and back off the distance
                linkLines.attr("d", function(d) {
            
                // length of current path
                var pl = this.getTotalLength(),
                    // radius of circle plus backoff
                    r = (node_ray*1.5)+5,
                    // position close to where path intercepts circle
                    m = this.getPointAtLength(pl - r);
            
                var dx = m.x - d.source.x,
                    dy = m.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
            
                return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + m.x + "," + m.y;
                });
            
                linkText
                .attr("x", function(d) {
                    return (d.source.x + (d.target.x - d.source.x) * 0.5);
                })
                .attr("y", function(d) {
                    return (d.source.y + (d.target.y - d.source.y) * 0.5);
                })
            
                nodes
                .attr("transform", d => `translate(${d.x}, ${d.y})`);
            
            
            }

            function dragstarted(d) {
                 if (!d3.event.active) simulation.alphaTarget(0 ).restart();
                d.fx = d.x;
                d.fy = d.y;
                
            }
            
            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
               
            }
            
            function dragended(d) {
               
                if (!d3.event.active) simulation.alphaTarget(1);
                d.fx = null;
                d.fy = null;
               
            }
            function mouseOver(opacity) {
                return function(d) {
                    // check all other nodes to see if they're connected
                    // to this one. if so, keep the opacity at 1, otherwise
                    // fade
                    nodes.style("stroke-opacity", function(o) {
                        thisOpacity = isConnected(d, o) ? 1 : opacity;
                        return thisOpacity;
                    });
                    nodes.style("fill-opacity", function(o) {
                        thisOpacity = isConnected(d, o) ? 1 : opacity;
                        return thisOpacity;
                    });
                    // also style link accordingly
                    linkLines.style("stroke-opacity", function(o) {
                        return o.source === d || o.target === d ? 1 : opacity;
                    });
                    linkLines.style("stroke", function(o){
                        return o.source === d || o.target === d ? o.source.colour : "transparent";
                    });

                    linkText.style("stroke-opacity", function(o) {
                        return o.source === d || o.target === d ? 1 : opacity;
                    });
                    linkText.attr("fill", function(o){
                        return o.source === d || o.target === d ? o.source.colour : "transparent";
                    });
                };
            }
        
         
            var  linkedByIndex={}
             linksData.forEach(function(d) {
               linkedByIndex[d.source.index + "," + d.target.index] = 1;
                      });
            function isConnected(a, b) {
                return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
            }
            function mouseOut() {
                nodes.style("stroke-opacity", 1);
                nodes.style("fill-opacity", 1);
               linkLines.style("stroke-opacity", 1);
               linkLines.style("stroke", "black");
               linkText.style("stroke-opacity", 1);
               linkText.style("stroke", "blue");

               linkText.style("fill", "blue");
            }
            function clicked(d) {
          
                if (selected_field[d.name]) {
                    delete selected_field[d.name]
                        // console.log("deleted " + d.name)
                        // console.log("overaal" + selected_field)
                    d3.select(this).style("fill", color(d.id))
                        .style("fill-opacity", 1)
                        .attr("opacity", 1)
                        .attr("opacity", 1)
                } else {
                    selected_field[d.name] = []
                    d.attributes.forEach(element => {
                        selected_field[d.name].push({ id: element.name, type: element.type, label: element.name,type:"node" })
                            // console.log(selected_field)
                        d3.select(this).style("fill", "gold")
                            .style("fill-opacity", 0.7)
                            .style("attr", "gold")
                            .attr("opacity", 0.7)
                    });
                }
                updateQueryBuilder()
            }

            function clicked_link(d) {
          
               
                if (selected_field[d.name]) {
                    delete selected_field[d.name]
                        // console.log("deleted " + d.name)
                        // console.log("overaal" + selected_field)
                    d3.select(this).style("fill", "bleu")
                    .attr('stroke',  'blue')
                    .attr('opacity', 1)
                         
                } else {

                    selected_field[d.name] = []
                    
                    selected_field[d.name].push({ id: d.name,type:"link" })

                        
                        d3.select(this).style("fill", "gold")
                            .style("fill-opacity", 0.7)
                            .style("attr", "gold")
                            .attr("opacity", 0.7)
                            .style("storke","gold")
                            .style("stroke-opacity",0.7)
                           
                            
                
                }
                updateQueryBuilder()
            }
        
    
        
        
        
        })
    









 }

updateQueryBuilder = () => {

    let current_children = $("#queryStructure").children()
    let already_existing_fields = []

    // removing obsolete elements
    for (const element of current_children) {
        if (!Object.keys(selected_field).includes((element.id).slice(8))) {
            $(`#${element.id}`).remove()
        } else
            already_existing_fields.push((element.id).slice(8))
    }

    for (const key of Object.keys(selected_field)) {
        if (key in already_existing_fields)
            continue;

        var $newdiv2 = $(`<div id='structQ-${key}'></div>`)
        

        $newdiv2.append($(`<h3 class="text-uppercase text-muted ls-1 mb-1">${key}</div>`))

        var $newdiv = $(`<div id='structQ-${key}-fields'></div>`)
            // console.log("Hello there " + key)
          
        $newdiv.structFilter({
            fields: selected_field[key]
                // fields: [
                //     { id: "lastname", type: "text", label: "Lastname" },
                //     { id: "firstname", type: "text", label: "Firstname" },
                //     { id: "active", type: "boolean", label: "Is active" },
                //     { id: "age", tchangeype: "number", label: "Age" },
                //     { id: "bday", type: "date", label: "Birthday" },
                //     {
                //         id: "category",
                //         type: "list",
                //         label: "Category",
                //         list: [
                //             { id: "1", label: "Family" },
                //             { id: "2", label: "Friends" },
                //             { id: "3", label: "Business" },
                //             { id: "4", label: "Acquaintances" },
                //             { id: "5", label: "Other" }
                //         ]
                //     }
                // ]
        });

        if (!$(`#structQ-${key}`).length)
            
             $("#queryStructure").append( $newdiv2.append($newdiv))
         
        
        
    }

} 



 
function Send_Req(id)
{

   
    
    //const graphdetect = GenericGraphAdapter.create();

     json_req={"nodes":{},"links":{}}
     
    console.log(selected_field)
    for (const key of Object.keys(selected_field)) {
        
       
        if (selected_field[key].length>2) {
            var a=$("#structQ-"+key+'-fields').structFilter('val')
             
            json_req["nodes"][key]=a
            
            
        } else {
            var a=$("#structQ-"+key+'-fields').structFilter('val')
            link=get_source_target(key)
            //link={"source":key,"target":key,"name":key}
            
            json_req["links"][key]=link
             
        }
       

       
        
    }
    console.log(json_req)
    
    download (type_of = "text/plain", filename= "data.txt",json_req)

 

}



 function download (type_of = "text/plain", filename= "data.txt",data) {
     
        let body = document.body;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {
            type: type_of
        }));
        a.setAttribute("download", filename);
        body.appendChild(a);
        a.click();
        body.removeChild(a);
    }
function get_source_target(key)
{
    console.log(send_links.length)
    for (let i = 0; i < send_links.length; i++) {
         if (send_links[i]['name']==key) {
             src=send_links[i]['source']
             trg=send_links[i]['target']
             data={"source":src,"target":trg,"name":key}
             return data
         }
        
    }

    
}

///////////////////////////////////////////////



function Search_data()
{

    search_inf={"key_word":"","user_id":"","start_date":"","end_date":"","location":""}
 
    key_word=document.getElementById("search_data").value
    start_date=document.getElementById("Date").value
    end_date=document.getElementById("Date").value
    search_inf["key_word"]=key_word
    search_inf["start_date"]=start_date
    search_inf["end_date"]=start_date
    search_inf["location"]=location
    
     
    console.log(search_inf)

    //send request to elastic search
 
    
   /* var request = {
        "url" : 'http://localhost:2018/',
        "method" : "POST",
        "origin":"*",
        "allowHeaders":['Content-Type'],
        "data" : search_inf
    }
    alert("sending....")
    $.ajax(request).done(function(response){
        alert("Data Updated Successfully!");
        window.history.back
    })*/

    /*let url = "https://reqbin.com/echo/post/json";

let xhr = new XMLHttpRequest();
let data = `{
    "Id": 78912,
    "Customer": "Jason Sweet",
    "Quantity": 1,
    "Price": 18.00
  }`;
xhr.open("POST", data);
xhr.onload = () => {
    console.log(xhr.response);
}


xhr.setRequestHeader("Accept", "application/json");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.responseType = 'text';

xhr.onreadystatechange = function () {
   if (xhr.readyState === 4) {
       console.log( xhr)
      console.log(xhr.responseText);
   }};



xhr.send(data);*/



let data=[]
    
Display_result()

}

function Display_result()
{
    result={

        records:[
            {text:"phoros platform...........",
            Api_type:"facebook",
            Position:{
                id:35,
                long:6.5,
                latitude:25
            },
            Time:"22/02/2020"
        
        },
        {text:"un flux de pétrole",
            Api_type:"facebook",
            Position:{
                id:15,
                long:11,
                latitude:15
            },
            Time:"25/02/2020"
        
        },
        {text:"lalalalalalalalalaalal ....",
            Api_type:"twitter",
            Position:{
                id:15,
                long:8,
                latitude:20
            },
            Time:"22/02/2020"
        
        },
        {text:"Elimination de l'équipe national",
            Api_type:"facebook",
            Position:{
                id:35,
                long:10,
                latitude:22
            },
            Time:"22/02/2020"
        
        },
        {text:"Armé nationnal............",
            Api_type:"twitter",
            Position:{

                id:35,
                long:12,
                latitude:22
            },
            Time:"22/02/2020"
        
        },
        {text:" Une nouvelle technologie",
            Api_type:"linkedin",
            Position:{
                id:12,
                long:5,
                latitude:17
            },
            Time:"22/02/2020"
        
        }
            
        ]
    }
    var tab =result["records"]
    data=tab

        if (document.getElementsByTagName("table")['length']!=0) {
            
            el=document.getElementById("res")
            el.remove()
        }

      console.log(document.getElementsByTagName("table")['length'])
        // get the reference for the body
        var body = document.getElementById("table");
      
        // creates a <table> element and a <tbody> element
        var tbl = document.createElement("table");
        tbl.setAttribute("id","res")


        tbl.setAttribute("class","table")
        var thead=document.createElement("thead")
        var tr=document.createElement("tr")
        console.log()

        for (let j = 0; j < Object.keys(tab[0] ).length ; j++) {
            
            var th=document.createElement("th")
            th.setAttribute("scope","col")
            var cellText = document.createTextNode(Object.keys(result["records"][0] )[j]);
            th.appendChild(cellText);
            tr.appendChild(th);


            
        }
        thead.appendChild(tr)
        var tblBody = document.createElement("tbody");
      
        // creating all cells
        for (var i = 0; i < tab.length; i++) {
          // creates a table row
          var row = document.createElement("tr");
          row.setAttribute("class","table-active")
            tab_att=["texte","Api_type","Position","Time"]
            console.log("aaaaaaaaaaaa")
          for (var j = 0; j < tab_att.length; j++) {
            // Create a <td> element and a text node, make the text
            // node the contents of the <td>, and put the <td> at
            // the end of the table row
            if(tab_att[j]=="Position")
            {
                var cell = document.createElement("td");
                 
                var cellText = document.createTextNode(tab[i][tab_att[j]]["id"]);
                cell.appendChild(cellText);
                cell.setAttribute("onclick","func("+i+")")

                row.appendChild(cell);

            }
            else{
                var cell = document.createElement("td");
            
                var cellText = document.createTextNode(tab[i][tab_att[j]]);
                cell.appendChild(cellText);
 
                row.appendChild(cell);
            }
          }
      
          // add the row to the end of the table body
          tblBody.appendChild(row);
        }
      
        // put the <tbody> in the <table>
        tbl.appendChild(thead)
        tbl.appendChild(tblBody);
        // appends <table> into <body>
        body.appendChild(tbl);
        // sets the border attribute of tbl to 2;
        tbl.setAttribute("border", "2");


        for (let i = 0; i <  result["records"].length; i++) {
            
            max=get_max(result["records"],result["records"][i]["Position"]["id"])
            color_place(result["records"][i]["Position"]["id"],max,result["records"].length)




            
        }
      
      
      



}
function func(i)
{
    var markers = [{long: data[i]["Position"]["long"], lat:data[i]["Position"]["latitude"], text: data[i]["text"], api: data[i]["Api_type"],id:data[i]["Position"]["id"]}]
    const svg = d3.select(".map svg");
    Add_marker(markers,svg )
     


}

function get_max(tab,id)
{
    j=0
    
    for (let i = 0; i < tab.length; i++) {
        
        if (tab[i]["Position"]["id"]==id) {
            j=j+1
            
        }

        
    }
   
    return j
}

///////////////////// MARKERS



/*var markers = [
    {long: 9.083, lat:15, group: "A", size: 34}, // corsica
    {long: 7.26, lat: 20, group: "A", size: 14}, // nice
    {long: 2.349, lat:18, group: "B", size: 87}, // Paris
    {long: 10.397, lat: 23, group: "B", size: 41}, // Hossegor
    {long: 3.075, lat: 28, group: "C", size: 78}, // Lille
    {long: 5.83, lat:17, group: "C", size: 12} // Morlaix
  ];*/

  
function color_place(id,maxid,max)
{   
    var col=document.getElementById(id);
    col.style.fill=  "rgb( "+255*maxid/max+","+  (255-255*maxid/max)+","+  (255-255*maxid/max)+")" 
     
 
    
}


function Add_marker(markers,svg )
{

 
    const projection = d3.geoMercator()
        .center([2.5927734375, 28.729130483430154])
        .scale(1100)
         .translate([500 , 190]);
  
  const tooltip_marker = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity",   0);
    /*var markers = [
        {long: 9.083, lat:30, id: "A", size: 34}, // corsica
        {long: 7.26, lat: 28, id: "A", size: 14}, // nice
        {long: 5.349, lat:26, id: "B", size: 87}, // Paris
        {long: 10.397, lat: 25, id: "B", size: 41}, // Hossegor
        {long: 3.075, lat: 28, id: "C", size: 78}, // Lille
        {long: 8.83, lat:28, id: "C", size: 12} // Morlaix
      ];

     /* svg
          .selectAll("myCircles")
          .data(markers)
          .enter()
          .append('image')
          .attr('d',path)
          .attr('class','img')

           
          .attr("xlink:href", "C:\Users\SensBook\Downloads\index.png")
          .attr("width", 40)
          .attr("height", 40)*/
tooltip1_data={"nom":"ali","prenom":"lmr"}

          svg
          .selectAll("myCircles")
          .data(markers)
          .enter()
          .append("circle")
            .attr("cx", function(d){ return projection([d.long, d.lat])[0] })
            .attr("cy", function(d){ return projection([d.long, d.lat])[1] })
            .attr("id",function(d){ return "crc"+d.id})
            .attr("r",10)
            .style("fill", "red" )
            .attr("stroke", "black" )
            .attr("stroke-width", 2)
            .attr("fill-opacity", 1) 
            .on("click", function (d, i) {
                alert("aaaaaaaaa")
              tooltip_marker.transition()
                            .duration(5)
                            .style("opacity", );
                  })
             
            .on('mousemove', function (d) {
              console.log("zzzzz")
                tooltip_marker.transition()
                    .duration(5000)
                    .style("opacity", 1);
            //Any time the mouse moves, the tooltip should be at the same position
              tooltip_marker.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px")        
            //The text inside should be State: rate%
                    .text(()=> `${tooltip1_data.nom+tooltip1_data.prenom}`)
            })
           
         

}



////////////////////////////////////////////////
mapper1();
//grapher();
// structQuery();


// console.log("finished")

//     return svg;

// }



// module.exports = {
//     mapBuilder
// }







