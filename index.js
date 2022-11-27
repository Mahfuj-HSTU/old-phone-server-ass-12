const express = require( 'express' )
const app = express();
const cors = require( 'cors' );
const jwt = require( 'jsonwebtoken' )
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require( 'mongodb' );
require( 'dotenv' ).config();


// middleware
app.use( cors() );
app.use( express.json() );




const uri = `mongodb+srv://${ process.env.DB_user }:${ process.env.DB_password }@cluster0.mdoqsyi.mongodb.net/?retryWrites=true&w=majority`;
// console.log( uri );
const client = new MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 } );

// jwt function
function verifyJWT ( req, res, next ) {
    // console.log( 'token inside', req.headers.authorization )
    const authHeader = req.headers.authorization
    if ( !authHeader ) {
        return res.status( 401 ).send( 'unauthorized access' )
    }
    const token = authHeader.split( ' ' )[ 1 ];

    jwt.verify( token, process.env.ACCESS_token, function ( err, decoded ) {
        if ( err ) {
            return res.status( 403 ).send( { message: 'forbidden access' } )
        }
        req.decoded = decoded;
        next();
    } )
}



async function run () {
    try {
        const categoryCollection = client.db( 'SuperSale' ).collection( 'Categories' )
        const productCollection = client.db( 'SuperSale' ).collection( 'products' )
        const ordersCollection = client.db( 'SuperSale' ).collection( 'orders' )
        const usersCollection = client.db( 'SuperSale' ).collection( 'users' )


        // get categories
        app.get( '/categories', async ( req, res ) => {
            const query = {}
            const cursor = categoryCollection.find( query );
            const category = await cursor.toArray();
            res.send( category );
        } );

        app.get( '/products/:brand', async ( req, res ) => {
            const brand = req.params.brand;
            const query = { brand: brand };
            // console.log( query )
            const result = await productCollection.find( query ).toArray();
            res.send( result )
        } );


        // post product
        app.post( '/products', async ( req, res ) => {
            const product = req.body;
            const result = await productCollection.insertOne( product );
            res.json( result );
        } );

        // my product
        app.get( '/products', verifyJWT, async ( req, res ) => {
            const email = req.query.email
            const decodedEmail = req.decoded.email;
            if ( email !== decodedEmail ) {
                return res.status( 403 ).send( { message: 'forbidden access' } )
            }
            const query = { email: email }
            const product = await productCollection.find( query ).toArray();
            res.send( product )
        } )

        // delete product
        app.delete( '/products/:id', async ( req, res ) => {
            const id = req.params.id;
            const query = { _id: ObjectId( id ) };
            const result = await productCollection.deleteOne( query );
            res.send( result )
            console.log( result );
        } )

        // post orders
        app.post( '/orders', async ( req, res ) => {
            const order = req.body;
            // console.log( order )
            // const query = {
            //     email: booking.email,
            // }
            const result = await ordersCollection.insertOne( order );
            res.send( result )
        } )

        // get my orders
        app.get( '/orders', async ( req, res ) => {
            const email = req.query.email;
            const query = { email: email };
            const orders = await ordersCollection.find( query ).toArray();
            res.send( orders )
        } )

        // get buyers
        app.get( '/users/buyers/:role', async ( req, res ) => {
            const role = req.params.role
            // console.log( role )
            const query = { role: role }
            const user = await usersCollection.find( query ).toArray();
            res.send( user )
        } )

        // get sellers
        app.get( '/users/sellers/:role', async ( req, res ) => {
            const role = req.params.role
            // console.log( role )
            const query = { role: role }
            const user = await usersCollection.find( query ).toArray();
            res.send( user )
        } )

        // check admin
        app.get( '/users/admin/:email', async ( req, res ) => {
            const email = req.params.email
            const query = { email }
            // console.log( email );
            const user = await usersCollection.findOne( query )
            res.send( { isAdmin: user?.role === 'admin' } )
        } )

        // check buyer
        app.get( '/users/buyer/:email', async ( req, res ) => {
            const email = req.params.email
            const query = { email }
            // console.log( email );
            const user = await usersCollection.findOne( query )
            res.send( { isBuyer: user?.role === 'Buyer' } )
        } )

        // check seller
        app.get( '/users/seller/:email', async ( req, res ) => {
            const email = req.params.email
            const query = { email }
            // console.log( email );
            const user = await usersCollection.findOne( query )
            res.send( { isSeller: user?.role === 'Seller' } )
        } )

        // jwt token
        app.get( '/jwt', async ( req, res ) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne( query );
            if ( user ) {
                const token = jwt.sign( { email }, process.env.ACCESS_token, { expiresIn: '1d' } )
                return res.send( { accessToken: token } )
            }
            // console.log( user );
            res.status( 403 ).send( { accessToken: '' } )
        } )

        // post users
        app.post( '/users', async ( req, res ) => {
            const user = req.body;
            const result = await usersCollection.insertOne( user );
            res.send( result )
        } )

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
