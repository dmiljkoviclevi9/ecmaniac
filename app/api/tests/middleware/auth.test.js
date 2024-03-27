import jwt from "jsonwebtoken";
import User from "../../src/models/userModel.js";
import { requireAdmin, auth } from "../../src/middleware/auth.js";
import { expect } from "chai";
import sinon from "sinon";

describe("Middleware (auth) tests", () => {

    describe("requireAdmin middleware", () => {
        it("should call next() if user is an admin", () => {
            const req = { user: { role: "ADMIN" } };
            const res = { status: sinon.stub().returnsThis(), send: sinon.stub() };
            const next = sinon.stub();

            requireAdmin(req, res, next);

            expect(next.called).to.be.true;
            expect(res.status.called).to.be.false;
            expect(res.send.called).to.be.false;
        });

        it("should send 'Forbidden' with status 403 if user is not an admin", () => {
            const req = { user: { role: "USER" } };
            const res = { status: sinon.stub().returnsThis(), send: sinon.stub() };
            const next = sinon.stub();

            requireAdmin(req, res, next);

            expect(next.called).to.be.false;
            expect(res.status.calledWith(403)).to.be.true;
            expect(res.send.calledWith("Forbidden")).to.be.true;
        });
    });

    describe("auth middleware", () => {
        it("should set req.token, req.user, and call next() if user is verified", async () => {
            const token = "valid_token";
            const decoded = { _id: "user_id" };
            const user = { isVerified: true };
            const req = { header: sinon.stub().returns(`Bearer ${token}`) };
            const res = { status: sinon.stub().returnsThis(), send: sinon.stub() };
            const next = sinon.stub();

            sinon.stub(jwt, 'verify').returns(decoded);
            sinon.stub(User, 'findOne').resolves(user);

            await auth(req, res, next);

            expect(req.token).to.equal(token);
            expect(req.user).to.equal(user);
            expect(next.called).to.be.true;
            expect(res.status.called).to.be.false;
            expect(res.send.called).to.be.false;

            jwt.verify.restore();
            User.findOne.restore();
        });

        it("should send 'User is not verified' with status 403 if user is not verified", async () => {
            const token = "valid_token";
            const decoded = { _id: "user_id" };
            const user = { isVerified: false };
            const req = { header: sinon.stub().returns(`Bearer ${token}`) };
            const res = { status: sinon.stub().returnsThis(), send: sinon.stub() };
            const next = sinon.stub();

            sinon.stub(jwt, 'verify').returns(decoded);
            sinon.stub(User, 'findOne').resolves(user);

            await auth(req, res, next);

            expect(req.token).to.be.undefined;
            expect(req.user).to.be.undefined;
            expect(next.called).to.be.false;
            expect(res.status.calledWith(403)).to.be.true;
            expect(res.send.calledWith({ error: "User is not verified." })).to.be.true;

            jwt.verify.restore();
            User.findOne.restore();
        });

        it("should send 'Please authenticate' with status 401 if token is invalid", async () => {
            const token = "invalid_token";
            const req = { header: sinon.stub().returns(`Bearer ${token}`) };
            const res = { status: sinon.stub().returnsThis(), send: sinon.stub() };
            const next = sinon.stub();

            sinon.stub(jwt, 'verify').throws(new Error());

            await auth(req, res, next);

            expect(req.token).to.be.undefined;
            expect(req.user).to.be.undefined;
            expect(next.called).to.be.false;
            expect(res.status.calledWith(401)).to.be.true;
            expect(res.send.calledWith({ error: "Please authenticate." })).to.be.true;

            jwt.verify.restore();
        });

        it("should throw an error if user is falsy", async () => {
            const token = "valid_token";
            const decoded = { _id: "user_id" };
            const req = { header: sinon.stub().returns(`Bearer ${token}`) };
            const res = { status: sinon.stub().returnsThis(), send: sinon.stub() };
            const next = sinon.stub();

            sinon.stub(jwt, 'verify').returns(decoded);
            sinon.stub(User, 'findOne').resolves(null); // Simulate falsy user

            try {
                await auth(req, res, next);
                // If auth does not throw, force the test to fail
                throw new Error("auth did not throw as expected");
            } catch (error) {
                expect(error).to.be.an('error');
                expect(req.token).to.be.undefined;
                expect(req.user).to.be.undefined;
                expect(next.called).to.be.false;
                expect(res.status.calledWith(401)).to.be.true;
                expect(res.send.calledWith({ error: "Please authenticate." })).to.be.true;
            }

            jwt.verify.restore();
            User.findOne.restore();
        });
    });
});