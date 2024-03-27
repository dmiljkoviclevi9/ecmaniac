import { container, setup } from "../../dependencyInjectionConfig.js";
import awilix from "awilix";
import { expect } from "chai";
import sinon from "sinon";

describe("Auth Controller tests", () => {
    let userServiceMock; // Move the userServiceMock declaration to a wider scope

    before(() => {
        setup(); // Setup dependency injection container before running tests.

        // Initialize the userServiceMock with the necessary mocked methods
        userServiceMock = {
            getByCredentials: sinon.stub().returns({
                user: { id: 1, name: "John Doe" },
                token: "abc123",
            }),
        };

        // Register the mock within the Awilix container
        container.register({
            userService: awilix.asValue(userServiceMock),
        });
    });

    describe("logIn", () => {
        let req, res, authController;

        beforeEach(() => {
            // Setup request and response objects for each test
            req = {
                body: {
                    email: "test@example.com",
                    password: "password123",
                },
            };
            res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            // Resolve AuthController from the Awilix container before each test
            authController = container.resolve("authController");
        });

        it("should log in a user successfully", async () => {
            // Call the logIn method
            await authController.logIn(req, res);

            // Assertions
            expect(userServiceMock.getByCredentials.calledWith(req.body)).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({
                message: "User logged in successfully!",
                user: { id: 1, name: "John Doe" },
                token: "abc123",
            })).to.be.true;
        });

        it("should return 401 if unable to login", async () => {
            // Set specific behavior for this test
            userServiceMock.getByCredentials.returns(null);

            // Call the logIn method
            await authController.logIn(req, res);

            // Assertions
            expect(userServiceMock.getByCredentials.calledWith(req.body)).to.be.true;
            expect(res.status.calledWith(401)).to.be.true;
            expect(res.json.calledWith({ message: "Unable to login!" })).to.be.true;
        });

        it("should throw an error if userService throws", async () => {
            // Adjust the mock to throw an exception for this test
            userServiceMock.getByCredentials.throws(new Error("Failed to get user by credentials"));
        
            // Attempt to call the logIn method and catch any thrown errors
            try {
                await authController.logIn(req, res);
                expect.fail("Expected error was not thrown");
            } catch (error) {
                // Assertions about the caught error
                expect(error.message).to.equal("Failed to get user by credentials");
            }
        });        
    });

    describe("logOut", () => {
        let req, res, authController;

        beforeEach(() => {
            // Setup request and response objects for each test
            req = {
                user: {
                    tokens: [
                        { token: "abc123" },
                        { token: "def456" },
                    ],
                    save: sinon.stub(),
                },
                token: "abc123",
            };
            res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            // Resolve AuthController from the Awilix container before each test
            authController = container.resolve("authController");
        });

        it("should log out a user successfully", async () => {
            // Call the logOut method
            await authController.logOut(req, res);

            // Assertions
            expect(req.user.tokens).to.have.lengthOf(1);
            expect(req.user.tokens[0].token).to.equal("def456");
            expect(req.user.save.called).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: "User logged out successfully!" })).to.be.true;
        });

        it("should throw an error if req.user.save throws", async () => {
            // Adjust the mock to throw an exception for this test
            req.user.save.throws(new Error("Failed to save user"));
        
            // Attempt to call the logOut method and catch any thrown errors
            try {
                await authController.logOut(req, res);
                expect.fail("Expected error was not thrown");
            } catch (error) {
                // Assertions about the caught error
                expect(error.message).to.equal("Failed to save user");
            }
        });
    });
});
