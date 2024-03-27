import { container, setup } from "../../dependencyInjectionConfig.js";
import awilix from "awilix";
import { expect } from "chai";
import sinon from "sinon";
import ValidationError from "../../src/errors/validationError.js";

describe("Challenge Controller tests", () => {
    let challengeServiceMock; // Move the challengeServiceMock declaration to a wider scope

    before(() => {
        setup(); // Setup dependency injection container before running tests.

        // Initialize the challengeServiceMock with the necessary mocked methods
        challengeServiceMock = {
            createChallenge: sinon.stub().returns({
                challenge: { id: 1, title: "Challenge 1" },
                token: "abc123",
            }),
            updateChallenge: sinon.stub().returns({
                challenge: { id: 1, title: "Challenge 1" },
            }),
            deleteChallenge: sinon.stub().returns({
                challenge: { id: 1 },
            }),
            getChallenge: sinon.stub().returns({
                challenge: { id: 1 },
            }),
            getChallenges: sinon.stub().returns({ challenges: [] }),
            getByCredentials: sinon.stub().returns({
                challenge: { title: "Challenge 1", creator: 1 },
            }),
        };

        // Register the mock within the Awilix container
        container.register({
            challengeService: awilix.asValue(challengeServiceMock),
        });
    });

    /*
    createChallenge Method tests:
        Successful Creation: Test that a challenge is created successfully when valid data is provided.

        Mock req.user and req.body with valid data.
        Stub challengeService.createChallenge to resolve with a challenge object and token.
        Assert that res.status is called with 201 and res.json is called with the expected success message and challenge data.
        Unauthorized Attempt: Simulate a request without a user or invalid user ID.

        Mock req.user as undefined or with an invalid _id.
        Assert that res.status is called with 401 and res.json is called with an unauthorized message.
        Validation Error: Simulate a validation error thrown by challengeService.createChallenge.

        Stub challengeService.createChallenge to throw a ValidationError.
        Assert that res.status is called with the error's status code and res.json with the error message.
    */

    describe("createChallenge", () => {
        let req, res, challengeController;

        beforeEach(() => {
            // Setup request and response objects for each test
            req = {
                user: { _id: 1 },
                body: {
                    title: "Challenge 1",
                    description: "Description",
                    difficulty: "EASY",
                    category: "Fundamentals",
                    tests: [],
                },
            };
            res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            // Resolve ChallengeController from the Awilix container before each test
            challengeController = container.resolve("challengeController");
        });

        it("should create a challenge successfully", async () => {
            // Call the createChallenge method
            await challengeController.createChallenge(req, res);

            // Assertions
            expect(challengeServiceMock.createChallenge.calledWith({
                title: "Challenge 1",
                description: "Description",
                difficulty: "EASY",
                category: "Fundamentals",
                creator: 1,
                tests: [],
            })).to.be.true;
            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith({
                message: "Challenge created successfully!",
                challenge: { id: 1, title: "Challenge 1" },
                token: "abc123",
            })).to.be.true;
        });

        it("should return 401 if user is not authenticated", async () => {
            // Setup request object without user
            req = { body: req.body };

            // Call the createChallenge method
            await challengeController.createChallenge(req, res);

            // Assertions
            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ message: "Unauthorized: User not identified." })).to.be.true;
        });

        it("should return a validation error message", async () => {
            // Set specific behavior for this test
            challengeServiceMock.createChallenge.throws(new ValidationError([{ path: "title", msg: "Invalid data" }]));

            // Call the createChallenge method
            const nextMock = sinon.spy();
            await challengeController.createChallenge(req, res, nextMock);

            // Assertions
            expect(res.status.calledWith(422)).to.be.true;
            expect(res.json.calledWith({ message: "title: Invalid data" })).to.be.true;
        });
    });

    /*
    updateChallenge Method tests:
        Successful Update: Test that a challenge is updated successfully when valid data is provided.

        Mock req.params.id and req.body with valid data.
        Stub challengeService.updateChallenge to resolve with an updated challenge object.
        Assert that res.status is called with 200 and res.json is called with the expected success message and updated challenge data.
       
        Invalid challengeId: Simulate an invalid challengeId provided in the request.

        Mock req.params.id with an invalid value.
        Assert that res.status is called with 400 and res.json is called with an invalid challengeId message.
        Challenge Not Found: Simulate a scenario where the challenge to update is not found.

        Not found:

        Stub challengeService.updateChallenge to resolve with null.
        Assert that res.status is called with 404 and res.json is called with a challenge not found message.
    
        Validation Error: Simulate a validation error thrown during the update.

        Stub challengeService.updateChallenge to throw a ValidationError.
        Assert the correct error response is returned.
    */
    describe("updateChallenge", () => {
        let req, res, challengeController;

        beforeEach(() => {
            // Setup request and response objects for each test
            req = {
                params: { id: 1 },
                body: {
                    title: "Challenge 1",
                    description: "Description",
                    difficulty: "EASY",
                    category: "Fundamentals",
                    tests: [],
                },
            };
            res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            // Resolve ChallengeController from the Awilix container before each test
            challengeController = container.resolve("challengeController");
        });

        it("should update a challenge successfully", async () => {
            const nextMock = sinon.spy();
            // Call the updateChallenge method
            await challengeController.updateChallenge(req, res, nextMock);

            // Assertions
            expect(challengeServiceMock.updateChallenge.calledWith({
                challengeId: 1,
                title: "Challenge 1",
                description: "Description",
                difficulty: "EASY",
                category: "Fundamentals",
                tests: [],
            })).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            console.log("Argument passed to res.status: ", res.status.args)
            console.log("Argument passed to res.json: ", res)
            expect(res.json.calledWith({
                message: "Challenge updated successfully!",
                challenge: { id: 1, title: "Challenge 1" },
            })).to.be.true;
        });

        it("should return 400 if challengeId is invalid", async () => {
            // Setup request object with an invalid challengeId
            req = { params: { id: "invalid_id" }, body: req.body };

            // Call the updateChallenge method
            await challengeController.updateChallenge(req, res);

            // Assertions
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: "Invalid challengeId!" })).to.be.true;
        });

        it("should return 404 if challenge is not found", async () => {
            // Set specific behavior for this test
            const notFoundError = new Error('Challenge not found');
            notFoundError.statusCode = 404;
            challengeServiceMock.updateChallenge.throws(notFoundError);
        
            // Call the updateChallenge method
            await challengeController.updateChallenge(req, res);
        
            // Assertions
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ message: "Challenge not found" })).to.be.true;
        });
        

        it("should return a validation error message", async () => {
            // Assuming ValidationError is imported or defined somewhere in your test file
            const validationError = new ValidationError("Invalid data");
            validationError.statusCode = 422; // Ensure the error has a statusCode property
        
            // Set specific behavior for this test to throw a ValidationError
            challengeServiceMock.updateChallenge.throws(validationError);
        
            // Call the updateChallenge method
            await challengeController.updateChallenge(req, res);
        
            // Assertions
            expect(res.status.calledWith(422)).to.be.true;
            expect(res.json.calledWith({ message: "Invalid data" })).to.be.true;
        });        

    });

    /*
    deleteChallenge Method tests:
        Successful Deletion: Test that a challenge is deleted successfully.

        Mock req.params.id with a valid challenge ID.
        Stub challengeService.deleteChallenge to resolve successfully.
        Assert that res.status is called with 200 and res.json with a success message.
        Invalid Challenge ID: Test deletion with an invalid challenge ID.

        Same setup as the update's invalid ID case.
    */

    describe("deleteChallenge", () => {
        let req, res, challengeController;

        beforeEach(() => {
            // Setup request and response objects for each test
            req = { params: { id: 1 } };
            res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            // Resolve ChallengeController from the Awilix container before each test
            challengeController = container.resolve("challengeController");
        });

        it("should delete a challenge successfully", async () => {
            const nextMock = sinon.spy();
            // Call the deleteChallenge method
            await challengeController.deleteChallenge(req, res, nextMock);

            // Assertions
            expect(challengeServiceMock.deleteChallenge.calledWith(1)).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: "Challenge deleted successfully!" })).to.be.true;
        });

        it("should return 400 if challengeId is invalid", async () => {
            // Setup request object with an invalid challengeId
            req = { params: { id: "invalid_id" } };

            const nextMock = sinon.spy();
            // Call the deleteChallenge method
            await challengeController.deleteChallenge(req, res, nextMock);

            // Assertions
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: "Invalid challengeId!" })).to.be.true;
        });
    });

    /*
    getChallenge Method tests:
        Successful Fetch: Test fetching a specific challenge successfully.

        Mock req.params.id with a valid challenge ID.
        Stub challengeService.getChallenge to resolve with challenge data.
        Assert that res.status is called with 200 and res.json with the challenge data.
       
        Invalid Challenge ID: Test fetching with an invalid challenge ID.

        Same setup as the update's invalid ID case.
    */

    describe("getChallenge", () => {
        let req, res, challengeController;
        const nextMock = sinon.spy();

        beforeEach(() => {
            // Setup request and response objects for each test
            req = { params: { id: 1 } };
            res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            // Resolve ChallengeController from the Awilix container before each test
            challengeController = container.resolve("challengeController");
        });

        it("should fetch a challenge successfully", async () => {
            // Call the getChallenge method
            await challengeController.getChallenge(req, res, nextMock);

            // Assertions
            expect(challengeServiceMock.getChallenge.calledWith(1)).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({
                message: "Challenge fetched successfully!",
                challenge: challengeServiceMock.getChallenge(),
            })).to.be.true;
        });

        it("should return 400 if challengeId is invalid", async () => {
            // Setup request object with an invalid challengeId
            req = { params: { id: "invalid_id" } };
            // Call the getChallenge method
            await challengeController.getChallenge(req, res, nextMock);

            // Assertions
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: "Invalid challengeId!" })).to.be.true;
        });
    });

    /*
    getChallenges Method tests:
        Successful Fetch: Test fetching all challenges successfully.

        Mock req.query with valid query parameters.
        Stub challengeService.getChallenges to resolve with challenge data.
        Assert that res.status is called with 200 and res.json with the challenge data.
    */

    describe("getChallenges", () => {
        let req, res, challengeController;

        beforeEach(() => {
            // Setup request and response objects for each test
            req = { query: { pageNum: 1, perPage: 10, difficulty: "EASY" } };
            res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            // Resolve ChallengeController from the Awilix container before each test
            challengeController = container.resolve("challengeController");
        });

        it("should fetch challenges successfully", async () => {
            const nextMock = sinon.spy();
            // Call the getChallenges method
            await challengeController.getChallenges(req, res, nextMock);

            // Assertions
            expect(challengeServiceMock.getChallenges.calledWith({
                pageNum: 1,
                perPage: 10,
                difficulty: "EASY",
            })).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({
                message: "Fetched challenges successfully!",
                challenges: [],
            })).to.be.true;
        });
    });

    /*
    getByCredentials Method tests:
        Successful Fetch By Credentials: Test that challenges are fetched successfully by title and creator.
        Mock req.query with a title and creator.
        Stub challengeService.getByCredentials to resolve with challenge data.
        Assert that res.status is called with 200 and res.json with the fetched challenge.
    */
    
    describe("getByCredentials", () => {
        let req, res, challengeController;

        beforeEach(() => {
            // Setup request and response objects for each test
            req = { query: { title: "Challenge 1", creator: "User 1" } };
            res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            // Resolve ChallengeController from the Awilix container before each test
            challengeController = container.resolve("challengeController");
        });

        it("should fetch challenges by credentials successfully", async () => {
            
            const nextMock = sinon.spy();
            // Call the getByCredentials method
            await challengeController.getByCredentials(req, res, nextMock);

            // Assertions
            expect(challengeServiceMock.getByCredentials.calledWith({
                title: "Challenge 1",
                creator: "User 1",
            })).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({
                message: "Challenge fetched successfully!",
                challenge: challengeServiceMock.getByCredentials(),
            })).to.be.true;
        });
    });

    /*
    Error Handling for All Methods
        Unhandled Errors: Ensure that any unhandled errors are passed to the next function.
        Stub the relevant challengeService method to throw an unexpected error.
        Assert that next is called with the error.
    */

    describe("Error handling", () => {
        let req, res, challengeController;

        beforeEach(() => {
            // Setup request and response objects for each test
            req = { params: { id: 1 }, body: { title: "Challenge 1" } };
            res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            // Resolve ChallengeController from the Awilix container before each test
            challengeController = container.resolve("challengeController");
        });

        it("should pass unhandled errors to the next function", async () => {
            // Set specific behavior for this test
            challengeServiceMock.updateChallenge.throws(new Error("Unexpected error"));

            // Call the updateChallenge method
            const nextMock = sinon.spy();
            await challengeController.updateChallenge(req, res, nextMock);

            // Assertions
            expect(nextMock.calledWith(sinon.match.instanceOf(Error))).to.be.true;
        });
    });
});
