const express = require( 'express' )
const app = express();
const cors = require( 'cors' );
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require( 'mongodb' );
require( 'dotenv' ).config();


// middleware
app.use( cors() );
app.use( express.json() );




const uri = `mongodb+srv://${ process.env.DB_user }:${ process.env.DB_password }@cluster0.mdoqsyi.mongodb.net/?retryWrites=true&w=majority`;
// console.log( uri );
const client = new MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 } );



async function run () {
    try {


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
