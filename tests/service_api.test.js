const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');
const Service = require('../models/service');

describe('when there is initially some services saved', () => {
    beforeEach(async () => {
        await Service.deleteMany({});
        await Service.insertMany(helper.initialServices);
    });

    test('services are returned as json', async () => {
        await api
            .get('/api/services')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('all services are returned', async () => {
        const response = await api.get('/api/services');
        expect(response.body).toHaveLength(helper.initialServices.length);
    });

    test('a specific service is within the returned services', async () => {
        const response = await api.get('/api/services');
        const contents = response.body.map(r => r.content);
        expect(contents).toContain('Browser can execute only JavaScript');
    });

    describe('viewing a specific service', () => {
        test('succeeds with a valid id', async () => {
            const servicesAtStart = await helper.servicesInDb();
            const serviceToView = servicesAtStart[0];
            const resultService = await api
                .get(`/api/services/${serviceToView.id}`)
                .expect(200)
                .expect('Content-Type', /application\/json/);

            expect(resultService.body).toEqual(serviceToView);
        });

        test('fails with statuscode 404 if service does not exist', async () => {
            const validNonexistingId = await helper.nonExistingId();
            await api
                .get(`/api/services/${validNonexistingId}`)
                .expect(404);
        });

        test('fails with statuscode 400 if id is invalid', async () => {
            const invalidId = '5a3d5da59070081a82a3445';
            await api
                .get(`/api/services/${invalidId}`)
                .expect(400);
        });
    });

    describe('addition of a new service', () => {
        test('succeeds with valid data', async () => {
            const newService = {
                content: 'async/await simplifies making async calls',
                important: true,
            };

            await api
                .post('/api/services')
                .send(newService)
                .expect(201)
                .expect('Content-Type', /application\/json/);

            const servicesAtEnd = await helper.servicesInDb();
            expect(servicesAtEnd).toHaveLength(helper.initialServices.length + 1);

            const contents = servicesAtEnd.map(n => n.content);
            expect(contents).toContain('async/await simplifies making async calls');
        });

        test('fails with status code 400 if data invalid', async () => {
            const newService = {
                important: true,
            };

            await api
                .post('/api/services')
                .send(newService)
                .expect(400);

            const servicesAtEnd = await helper.servicesInDb();
            expect(servicesAtEnd).toHaveLength(helper.initialServices.length);
        });
    });

    describe('deletion of a service', () => {
        test('succeeds with status code 204 if id is valid', async () => {
            const servicesAtStart = await helper.servicesInDb();
            const serviceToDelete = servicesAtStart[0];

            await api
                .delete(`/api/services/${serviceToDelete.id}`)
                .expect(204);

            const servicesAtEnd = await helper.servicesInDb();
            expect(servicesAtEnd).toHaveLength(helper.initialServices.length - 1);

            const contents = servicesAtEnd.map(r => r.content);
            expect(contents).not.toContain(serviceToDelete.content);
        });
    });
});

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({ username: 'root', passwordHash });
        await user.save();
    });

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

        const usernames = usersAtEnd.map(u => u.username);
        expect(usernames).toContain(newUser.username);
    });

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(result.body.error).toContain('expected `username` to be unique');

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});
