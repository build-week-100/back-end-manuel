const router = require('express').Router();

const Listings = require('./market-model');

const Users = require('../auth/auth-model');

router.get('/', (req, res) => {
    Listings.find()
        .then(listings => {
            res.status(200).json({ data: listings })
        })
        .catch(error => {
            console.log({ error })
            res.status(500).json({ message: error.message })
        })
})

router.get('/:id', validateUser, (req, res) => {
    const { id } = req.params;

    Listings.findBy({id})
        .then(([listing]) => {
            if(listing) {
                res.status(200).json({ data: listing })
            } else {
                res.status(404).json({ message: "Listing with specified ID was not found." })
            }
        })
        .catch(error => {
            console.log({ error })
            res.status(500).json({ message: error.message })
        })
})

router.get('/user/:id', validateUser, (req, res) => {
    const { id } = req.params;
    
    Listings.findUserListings(id)
        .then(listings => {
            if(listings) {
                res.status(200).json({ data: listings })
            } else {
                res.status(404).json({ message: "Listing with specified User ID was not found." })
            }
        })
        .catch(error => {
            console.log({ error })
            res.status(500).json({ message: error.message })
        })
})

router.post('/user/:id', validateUser, validateListing, (req, res) => {
    const { product_name, product_category, product_description, product_quantity, product_price, country, market_name } = req.body;
    const { id } = req.params;

    Listings.add({ product_name, product_category, product_description, product_quantity, product_price, country, market_name }, id)
        .then(([newListing]) => {
            if(newListing) {
                res.status(201).json({ data: newListing })
            } else {
                res.status(404).json({ message: "Newly created listing was not found." })
            }
        })
        .catch(error => {
            console.log({ error })
            res.status(500).json({ message: error.message })
        })
})

router.put('/:id', validateListing, (req, res) => {
    const { product_name, product_category, product_description, product_quantity, product_price, country, market_name } = req.body;
    const { id } = req.params;

    Listings.edit({ product_name, product_category, product_description, product_quantity, product_price, country, market_name }, id)
        .then(([updatedListing]) => {
            if(updatedListing) {
                res.status(200).json({ data: updatedListing })
            } else {
                res.status(404).json({ message: "Listing with specified ID was not found." })
            }
        })
        .catch(error => {
            console.log({ error })
            res.status(500).json({ message: error.message })
        })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    Listings.remove(id)
        .then(count => {
            if(count) {
                res.status(204).end()
            } else {
                res.status(404).json({ message: "Listing with specified ID was not found." })
            }
        })
        .catch(error => {
            console.log({ error })
            res.status(500).json({ message: error.message })
        })
})

// Custom MiddleWare //

function validateUser(req, res, next) {
    const { id } = req.params;

    Users.findById(id)
        .then(user => {
            if(user) {
                next();
            } else {
                res.status(404).json({ message: "User with specified ID was not found." })
            }
        })
        .catch(error => {
            console.log({ error })
            res.status(500).json({ message: error.message })
        })
}

function validateListing(req, res, next) {
    const { product_name, product_category, product_quantity, product_price, country, market_name } = req.body;

    if(Object.entries(req.body).length === 0) {
        res.status(400).json({ message: "No Listing Data." })
    } else if( !product_name || !product_category || !product_quantity || !product_price || !country || !market_name ) {
        res.status(400).json({ message: "product_name, product_category, product_quantity, product_price, country, market_name are all required fields." })
    } else {
        next()
    }
}

module.exports = router;