const supertest = require('supertest');

const server = require('./server');

const db = require('./data/dbConfig');

beforeEach(() => {
    return db.migrate.rollback().then(() =>db.migrate.latest()).then(()=>db.seed.run());
});

describe('server', () => {
    it('should run tests', () => {
        expect(true).toBeTruthy()
    })

    describe('GET /', () => {
        it('should return http status 200', async() => {
            const res = await supertest(server)
                .get('/');

            expect(res.status).toBe(200)
        })

        it('should return { message: "API is running" }', async() => {
            const res = await supertest(server)
                .get('/');

            expect(res.body).toEqual({ message: "API is running" })
        })
    });

    describe('GET /api/auth', () => {
        it('should return http status 200', async() => {
            const res = await supertest(server)
                .get('/api/auth')

            expect(res.status).toBe(200)
        })

        it('should return a list of users', async() => {
            const res = await supertest(server)
                .get('/api/auth')

            expect(Array.isArray(res.body.data)).toBe(true)
            expect(res.body.data.length).toBe(9)
        })
    });

    describe('POST /api/auth/register', () => {
        it('should return http status 201', async() => {
            const res = await supertest(server)
                .post('/api/auth/register')
                .send({ username: 'TestUser', password: 'password' })
            
            expect(res.status).toBe(201)
            expect(res.body.data.id).toBeDefined()
        })

        it('should return http status 400 if no req.body', async() => {
            const res = await supertest(server)
                .post('/api/auth/register')

            expect(res.status).toBe(400)
            expect(res.body).toEqual({ message: "No User Data." })
        })
    });

    describe('POST /api/auth/login', () => {
        it('should return http status 200', async() => {
            const res = await supertest(server)
                .post('/api/auth/login')
                .send({ username: 'BusiaMarket', password: 'password' })

            expect(res.status).toBe(200)
            expect(res.body.message).toEqual("Welcome to the API.")
            expect(res.body.token).toBeDefined()
        })

        it('should return http status 400 if no req.bdoy', async() => {
            const res = await supertest(server)
                .post('/api/auth/login')

            expect(res.status).toBe(400)
            expect(res.body).toEqual({ message: "No User Data." })
        })
    });

    describe('GET /api/market', () => {
        it('should return http status 200', async() => {
            const logged = await supertest(server)
                .post('/api/auth/login')
                .send({ username: 'BusiaMarket', password: 'password' })
            
            const res = await supertest(server)
                .get('/api/market')
                .set('Authorization', logged.body.token)

            expect(res.status).toBe(200)
            expect(res.body.data.length).toBe(27)
        })

        it('should return http status 400 without authorization', async() => {
            const res = await supertest(server)
                .get('/api/market')
                
            expect(res.status).toBe(400)
            expect(res.body).toEqual({ message: "Please provide authentication information." })
        })
    });

    describe('GET /api/market/:id', async() => {
        it('should return http status 200', async() => {
            const logged = await supertest(server)
                .post('/api/auth/login')
                .send({ username: 'BusiaMarket', password: 'password' })
            
            const res = await supertest(server)
                .get('/api/market/1')
                .set('Authorization', logged.body.token)

            expect(res.status).toBe(200)
            expect(res.body.data.id).toBe(1)
        })

        it('should return http status 404 if listing with ID was not found', async() => {
            const logged = await supertest(server)
                .post('/api/auth/login')
                .send({ username: 'BusiaMarket', password: 'password' })

            const res = await supertest(server)
                .get('/api/market/199')
                .set('Authorization', logged.body.token)

            expect(res.status).toBe(404)
            expect(res.body).toEqual({ "message": "Listing with specified ID was not found." })
        })
    });

    describe('GET /api/market/user/:id', async() => {
        it('should return http status 200', async() => {
            const logged = await supertest(server)
                .post('/api/auth/login')
                .send({ username: 'BusiaMarket', password: 'password' })
            
            const res = await supertest(server)
                .get('/api/market/user/1')
                .set('Authorization', logged.body.token)

            expect(res.status).toBe(200)
            expect(res.body.data.user_id).toBe(1)
        })

        it('should return http status 404 if user with id was not found', async() => {
            const logged = await supertest(server)
                .post('/api/auth/login')
                .send({ username: 'BusiaMarket', password: 'password' })

            const res = await supertest(server)
                .get('/api/market/user/199')
                .set('Authorization', logged.body.token)

            expect(res.status).toBe(404)
            expect(res.body).toEqual({ "message": "Listing with specified User ID was not found." })
        })
    })
})