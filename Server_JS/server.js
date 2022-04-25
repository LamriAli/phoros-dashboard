 
const neo4j = require('neo4j-driver');
var fs = require('fs');
var elastic=require('./elastic.js')

//PArameter elastic search
var index_name=''
var key=''
var attribute=''

function connect_neo4j(req)
{
    console.log("neo4j")
    
    const config = {
        "neo4j": {
        "url": "neo4j://localhost",
        "authUser": "neo4j",
        "authKey": "aliali"
        }
    }
    //const neo4j = require("neo4j-driver");
    const driver = neo4j.driver(
        config.neo4j.url,
        neo4j.auth.basic(config.neo4j.authUser, config.neo4j.authKey)
    );
    
    const session = driver.session()
        req='match(n:User)return n'
    session
        .run(req)
        .then(function(result){
         data={
            

         }
      
         i=0
         result.records.forEach(function(record){
          //  const singleRecord = result.records[0]
           // console.log(singleRecord)
           record1={
          
         }
            const node = record.get(0)
            
          
            console.log(node.properties)
            //record1["labels"]=node.labels
            record1['Properties']=node.properties
            data[i.toString()]=record1
            i=i+1
               
            }) 
            
           console.log(data)
           download(result)

 
         
            return data

        })
        .catch(console.error);

}
 




function get_response(data)
{
    
    data1=data
    data=data['data']

    
    
    if(data1["target"]=='neo4j')
    {
       
        return get_response_neo4j(data)

    }
    else{
        
           return get_response_elasticsearch(data)
 
        
    }
}



//Neo4j

function get_response_neo4j(data)
{   
 
    req=req_Neo4j(data)
    
    result=connect_neo4j( req)
 
  
    return result
     

}

function req_Neo4j(data)
{    
    
    if (data["links"]=={}) {
         

        //Pas de condition sur les liens
        query=''
   
          
        for(let key of Object.keys(data["nodes"])){
             query=query+"MATCH("+key+") "
             
        }
        query=query+' where '
        j=0


       for(let key of Object.keys(data["nodes"])){

        i=0
         for (let k = 0; k < data["nodes"][key].length; k++) {
            query=query+key+'.'+data["nodes"][key][i]["field"]["value"]+' '+get_operation( data["nodes"][key][i]["operator"]["value"])+' "'+data["nodes"][key][i]["value"]["value"]+'" '
            if (i<data["nodes"][key].length-1) {
                query=query+" And " 
                i=i+1   
            }            
          }
          if (j<Object.keys(data["nodes"]).length-1) {
            query=query+" And "
            j=j+1
          }      

        }
        
        
    }
    else{
        query=''
        for(let key of Object.keys(data["nodes"]))
        {
            query=query+'MATCH('+key+") " 
        }
        query=query+' where '
        j=0
        for(let key of Object.keys(data["nodes"]))
        {
            i=0
            for (let k = 0; k < data["nodes"][key].length; k++) {
                query=query+key+'.'+data["nodes"][key][i]["field"]["value"]+' '+get_operation( data["nodes"][key][i]["operator"]["value"])+' "'+data["nodes"][key][i]["value"]["value"]+'" '
                if (i<data["nodes"][key].length-1) {
                    query=query+" And " 
                    i=i+1   
                }            
              
              if (j<Object.keys(data["nodes"]).length-1) {
                query=query+" And "
                j=j+1
              }      
    
            }

            
        }
        if (exist_link(data)=="")
        {
            console.log("no links")
        }
        else{
            query=query+' And '+exist_link(data)

        }
        if (return_nodes(data)=="") {
            
            console.log("no return")
        }
        else{
            query=query+return_nodes(data)

        }

 

    }
    return query


}


/// Links
function exist_link(data)
{
    j=0
    links=""
     
    for(let key of Object.keys(data["links"]))
    {
        links=links+' ('+data["links"][key]["source"]["name"]+')-[:'+key+']->('+data["links"][key]["target"]["name"]+')'
        if (j<Object.keys(data["links"]).length-1) {
            links=links+' AND ' 

        }
        
    }
    return links
    
}



//Gret operation 

function get_operation( val)
{
    er=' '
    operation={"eq":"=",">":">","<":"<","null":"==null","nn":"!="}
    for(let key of Object.keys(operation)){
        if (key==val) {
            return operation[key]
            
        }
    
    }
    return er

}

 
 
 

function return_nodes(data)
{
  nodes=" Return "
  k=0
  for(let key of Object.keys( data["nodes"])){
    nodes=nodes+key
    
    if(k<Object.keys( data["nodes"]).length-2){
        nodes=nodes+' , '
        k=k+1

    }
    return nodes

  }



}
 
function download(data)
{
console.log(data.records[0]._fields)
  
// parse json
var jsonObj = JSON.parse(data);
 
console.log(jsonObj)
// stringify JSON Object
var jsonContent = JSON.stringify(jsonObj);
 
 
fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
 
    console.log("JSON file has been saved.");
});
}




///// Connect to elastic search 
function get_response_elasticsearch( data)

{
    console.log(data)
    index_name=data["index_name"]
    key=data["key"]
    attribute=data["attribute"]
    result_elastic=elastic.search(index_name,key,attribute)

    return result_elastic
}

 

 
/////////////////////////Listen server

var http = require('http');
 
//create a server object:
http.createServer(function (req, res) {

    var a='5';
   
    data=''
  //write a response to the client


  req.on('data', (chunk) => {
  //  console.log(`Data chunk available: ${chunk}`)
    var b=JSON.parse(chunk)
    console.log(b)
    data=JSON.stringify(get_response(b))
     
  })
  res.write("ok"); 

 
  req.on('end', () => {
   
    //end of data
  }) 
 // 
  

  res.end(); //end the response
}).listen(8088); //the server object listens on port 8080 



