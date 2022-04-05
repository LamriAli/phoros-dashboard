
# these functions are responsible for handling search and retrieval queries

from wrappers.REST.http_client import send_data
from wrappers.nebula.nebula_client import nebula_client
from wrappers.nebula.ngqlBuilder import *
from wrappers.elasticsearch.elastic_client import elastic_wrapper
from wrappers.neo4j.neo4j_client import Neo4j_client



#elastic = elastic_wrapper()

graph_dbs = [Neo4j_client()]#nebula_client()
doc_dbs=[] #elastic_wrapper()

# nebulas = {}
# gdb = nebula_client()
    
tags=[]


def handle_search(api,content):

    # TODO: handle advanced search too..
    searchBody = {
        "simple_query_string": {
            # "_source":f"{api}",
            "query": f"{content}\"",
            # "fields": ["fulltext", "title^5", "name^10"]
        }
    }
    
    # {"query": {
    #     "match": {
    #     "text": {"query":content}
    # }
    # }
    # }
        
    return doc_dbs[0].search(api,searchBody)
    
    
def handle_query(api,content,roadmap):
    print(content)
    
     
    
    """neo4j = graph_dbs[0]
    query=create_req_Neo4j(content)

    print(Execute_query(neo4j,query))
    """



    """nebula = get_graph_connection(api)
    ngql_query = ngql_from_struct_filter(api,content)
    result = nebula.raw(ngql_query)
    if(roadmap): # if it has a certain path to follow
        destination = roadmap.pop(0)
        return   send_data(destination,result)
    return result"""


def create_req_Neo4j(data):
   
 
    if data["links"]=={}:

        query=''
        for key in data["nodes"].keys():
            query=query+'MATCH('+key+") " 
        query=query+' where '
        j=0
        for key in  data["nodes"].keys():
             
            i=0
            for cond in data["nodes"][key]:
               # query=query+" "+data["nodes"][key][i]["field"]["value"]+ ' : "'+data["nodes"][key][i]["value"]["value"]+'"'

                query=query+key+'.'+data["nodes"][key][i]["field"]["value"]+' '+get_operation( data["nodes"][key][i]["operator"]["value"])+' "'+data["nodes"][key][i]["value"]["value"]+'" '

                if i<len(data["nodes"][key])-1:

                     query=query+" And " 
                     i=i+1
           
            if j<len(data["nodes"].keys())-1:
               query=query+" And "
               j=j+1
              


        print(query)#return query
    else:
        query=''
        for key in data["nodes"].keys():
            query=query+'MATCH('+key+") " 
        query=query+' where '
        j=0
        for key in  data["nodes"].keys():
             
            i=0
            for cond in data["nodes"][key]:
               # query=query+" "+data["nodes"][key][i]["field"]["value"]+ ' : "'+data["nodes"][key][i]["value"]["value"]+'"'

                query=query+key+'.'+data["nodes"][key][i]["field"]["value"]+' '+get_operation( data["nodes"][key][i]["operator"]["value"])+' "'+data["nodes"][key][i]["value"]["value"]+'" '

                if i<len(data["nodes"][key])-1:

                     query=query+" And " 
                     i=i+1
           
            if j<len(data["nodes"].keys()):
               query=query+" And "
               j=j+1
              
 

        if exist_link(data)=="":
          print("no links")
        else:
          query=query+exist_link(data)


        if return_nodes(data)=="":
          print("no return nodes")
        else:
          query=query+return_nodes(data)

     
               
                   

        print(query)
        return query 



def get_operation( val):
    er=' '
    operation={"eq":"=",">":">","<":"<","null":"==null","nn":"!="}

    if val in operation.keys():
     return operation[val]
    return  er 




def exist_link(data):
    j=0
    links=""
    for key in data["links"].keys():
      links=links+' ('+data["links"][key]["source"]["name"]+')-[:'+key+']->('+data["links"][key]["target"]["name"]+')'
      if j<len(data["links"].keys())-1:
        links=links+' AND '  
    return links


def return_nodes(data):
  nodes=" Return "
  k=0
  for node in  data["nodes"].keys():
    nodes=nodes+node
    if k< len( data["nodes"].keys())-1:
      nodes=nodes+' , '
      k=k+1
  return nodes


####### Connect neo4j
def connect():
    scheme = "neo4j" # Connecting to Aura, use the "neo4j+s" URI scheme
    host_name =  "localhost"
    port = "7687"
    user = "neo4j"
    password = "aliali"
    app = Neo4j_client()
    return app


### Execute query
def Execute_query(app,query):
  #app=connect()
  result=app.Execute_request(query)
 
  app.close()
  return result
