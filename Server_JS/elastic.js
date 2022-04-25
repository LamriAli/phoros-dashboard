const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

async function createPost() {
    const { response } = await client.create({
        index: 'titles',
        id: 11,
        body: {
            title: 'My First title',
            author: 'Jaseem',
            date: new Date()
        }
    });
}
 
//createPost().catch(console.log);
async function getdata_with_index(index) {
    const { body } = await client.get({
        index: index,
      //id:11
    });

    return body['hits']['hits'];
}
module.exports = {
     


 search:function(index_name,key,attribute) {
      console.log("hello elastic search")
    const { body: response } =   client.search({
        index: index_name,
        body: {
            query: {
                match: {
                    attribute: key
                }
            }
        }
    });

    return response.hits.hits;
 }
 

};

/*async function searchTitles() {
    const { body: response } = await client.search({
        index: 'titles',
        body: {
            query: {
                match: {
                    title: 'Fashion'
                }
            }
        }
    });

    console.log(response.hits.hits);
}

searchTitles().catch(console.log);

/***************************** */
 