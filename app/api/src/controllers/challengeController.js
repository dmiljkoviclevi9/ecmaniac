import { ObjectId } from "mongodb";
import ValidationError from "../errors/validationError.js";

export default class ChallengeController {
    constructor({ challengeService }) {
        this.challengeService = challengeService;
    }

    createChallenge = async (req, res, next) => {

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized: User not identified." });
          }
        const { title, description, difficulty, category, tests } = req.body;
        const creatorId = req.user._id;

        try {
            const { challenge, token } = await this.challengeService.createChallenge({
                title,
                description,
                difficulty,
                category,
                creator: creatorId,
                tests,
            });

            res.status(201).json({
                message: "Challenge created successfully!",
                challenge: challenge,
                token: token,
            });
        } catch (err) {
            if (err instanceof ValidationError) {
                return res.status(err.statusCode).json({ message: err.message });
            }
            next(err);
        }
    };

    updateChallenge = async (req, res, next) => {
        const challengeId = req.params.id;
        const { title, description, difficulty, category, tests } = req.body;

        try {
            if (!ObjectId.isValid(challengeId)) {
                return res.status(400).json({ message: "Invalid challengeId!" });
            }

            const { challenge } = await this.challengeService.updateChallenge({
                challengeId,
                title,
                description,
                difficulty,
                category,
                tests,
            });

            res.status(200).json({
                message: "Challenge updated successfully!",
                challenge: challenge,
            });
        } catch (err) {
            if (err instanceof ValidationError) {
                return res.status(err.statusCode).json({ message: err.message });
            }
            next(err);
        }
    };

    deleteChallenge = async (req, res, next) => {
        const challengeId = req.params.id;

        try {
            if (!ObjectId.isValid(challengeId)) {
                return res.status(400).json({ message: "Invalid challengeId!" });
            }

            await this.challengeService.deleteChallenge(challengeId);

            res.status(200).json({
                message: "Challenge deleted successfully!",
            });
        } catch (err) {
            if (err instanceof ValidationError) {
                return res.status(err.statusCode).json({ message: err.message });
            }
            next(err);
        }
    };

    getChallenge = async (req, res, next) => {
        const challengeId = req.params.id;

        try {
            if (!ObjectId.isValid(challengeId)) {
                return res.status(400).json({ message: "Invalid challengeId!" });
            }

            const challenge = await this.challengeService.getChallenge(challengeId);

            res.status(200).json({
                message: "Challenge fetched successfully!",
                challenge: challenge,
            });
        } catch (err) {
            if (err instanceof ValidationError) {
                return res.status(err.statusCode).json({ message: err.message });
            }
            next(err);
        }
    };

    getChallenges = async (req, res, next) => {
        // Extract pagination and filter parameters from query
        const { pageNum, perPage, difficulty } = req.query;
    
        try {
            // Pass parameters to getChallenges method
            const result = await this.challengeService.getChallenges({
                pageNum,
                perPage,
                difficulty,
            });
    
            res.status(200).json({
                message: "Fetched challenges successfully!",
                ...result, // Send the entire result object including challenges and pagination info
            });
        } catch (err) {
            if (err instanceof ValidationError) {
                return res.status(err.statusCode).json({ message: err.message });
            }
            next(err);
        }
    };    

    getByCredentials = async (req, res, next) => {
        const { title, creator } = req.query;

        try {
            const challenge = await this.challengeService.getByCredentials({
                title,
                creator,
            });

            res.status(200).json({
                message: "Challenge fetched successfully!",
                challenge: challenge,
            });
        } catch (err) {
            if (err instanceof ValidationError) {
                return res.status(err.statusCode).json({ message: err.message });
            }
            next(err);
        }
    }
}