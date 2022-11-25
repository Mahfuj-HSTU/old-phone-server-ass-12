const express = require( 'express' )
const app = express();
const cors = require( 'cors' );
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require( 'mongodb' );
require( 'dotenv' ).config();


// middleware
app.use( cors() );
app.use( express.json() );




const uri = `mongodb+srv://${ process.env.DB_user }:${ process.env.DB_password }@cluster0.mdoqsyi.mongodb.net/?retryWrites=true&w=majority`;
// console.log( uri );
const client = new MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 } );



async function run () {
    try {
        const categoryCollection = client.db( 'SuperSale' ).collection( 'Categories' )

        // get categories
        app.get( '/categories', async ( req, res ) => {
            const query = {}
            const cursor = categoryCollection.find( query );
            const category = await cursor.toArray();
            res.send( category );
        } );

        // get products under category
        app.get( '/categories/:id', async ( req, res ) => {
            const id = req.params.id;
            const query = { _id: ObjectId( id ) };
            const service = await categoryCollection.find( query ).toArray()
            res.send( service )
        } );

    }
    finally {

    }
}
run().catch( error => console.log( error ) )

app.get( '/', ( req, res ) => {
    res.send( 'Super sale server is running' )
} )

app.listen( port, () => {
    console.log( `Super sale server is running on ${ port }` );
} )
