const {MongoClient,ServerApiVersion,GridFSBucket} =  require('mongodb')
const keys = require('./keys')


class DataBase{

    constructor(){
        this.dbo = null
        this.client = new MongoClient(keys.mangodb.Url, { 
             serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        } 
        
    });

/*     this.client.once('open',()=>{
        let bucketPhotos = new GridFSBucket(this.client.db,{
           bucketName:'photos'
       })
   }) */
    
}

    async connect(){
        try{
                await this.client.connect()
                await this.client.db('pro-man-sys').command({ping:1})
                this.dbo = this.client.db('pro-man-sys') 
        }catch(e){
            console.log('Error in connecting the database',e)
            
        }
    }

    async  CreateCollection(collectionName){
        try{
            if(!this.dbo){
                await this.connect()
            }
            await this.dbo.createCollection(collectionName)
            console.log('Collection Created')
        }catch(e){ 
            console.log('Error Occoured in creating Collection',collectionName,e)
        }
    }

    async  DeleteCollection(collectionName){
        try{
            if(!this.dbo){
                await this.connect()
            }
            await this.dbo.collection(collectionName).drop()
            console.log('Collection droped')
        }catch(e){ 
            console.log('Error Occoured in droping Collection',collectionName,e)
        }
    }

    async Insert(collectionName,query){
        try{
            if(!this.dbo){
                await this.connect()
            }
            let response = await this.dbo.collection(collectionName).insertMany(query)
            console.log('inserted',response)
            return response
        }catch(e){
            console.log("Error in Inserting ",e)
        }
        
    }


    async Delete(collectionName, query) {
        try {
            if (!this.dbo) {
                await this.connect();
            }
            const result = await this.dbo.collection(collectionName).deleteMany(query);
            console.log(result.deletedCount + " document(s) deleted");
            console.log('deleted');
        } catch (e) {
            console.log("Error in deleting", e);
        }
    }
    
    async Find(collectionName,query,field,sort={}){
        try{
            let documents = ''
            if(!this.dbo){
                await this.connect()
            }
            
          documents = await this.dbo.collection(collectionName).find(query,field).sort(sort)
          documents = documents.toArray()
            return documents

        }catch(e){
            console.log("Error in Finding ",e)
        }
        
    }

    async Update(collectionName,query,value,query2 ={}){
        try {
            if (!this.dbo) {
                await this.connect();
            }
            const result = await this.dbo.collection(collectionName).updateMany(query,value,query2);
            return result
        } catch (e) {
            console.log("Error in updating", e);
        }
    }

}

module.exports= DataBase