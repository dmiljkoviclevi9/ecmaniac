import Challenge from '../models/challengeModel.js';

export default class ChallengeRepository {
    createChallenge = async (challengeData) => {
        const challenge = new Challenge(challengeData);

        try {
            // Check for an existing challenge with the same title
            const existingChallenge = await Challenge.findOne({
                $or: [{ title: challengeData.title }, { description: challengeData.description }]
            });

            if (existingChallenge) {
                const error = new Error('Challenge with the provided title or description already exists.');
                error.statusCode = 409;
                throw error;
            }

            const validationError = challenge.validateSync();

            if (validationError) {
                const error = new Error(validationError.message);
                error.statusCode = 422;
                throw error;
            }

            const result = await challenge.save();
            
            return {
                challenge: result,
            };
        } catch (err) {
            throw err;
        }
    };

    patchChallenge = async (challengeData) => {
        const updates = { ...challengeData };
        const challengeId = updates.challengeId;
        delete updates.challengeId; // Remove challengeId from the updates object to avoid attempting to update it

        try {
            // Using findByIdAndUpdate to both update the document and return the updated version
            const updatedChallenge = await Challenge.findByIdAndUpdate(
                challengeId,
                { $set: updates },
                { new: true, runValidators: true } // Ensures the returned document is the updated document and runs validators
            );

            if (!updatedChallenge) {
                const error = new Error('Challenge not found');
                error.statusCode = 404;
                throw error;
            }

            return updatedChallenge; // Return the updated document
        } catch (err) {
            throw err; // Error handling
        }
    }

    updateChallenge = async (challengeData) => {
        const updates = { ...challengeData };
        const challengeId = updates.challengeId;
        delete updates.challengeId; // Remove challengeId from the updates object to avoid attempting to update it

        try {
            // Using findByIdAndUpdate to both update the document and return the updated version
            const updatedChallenge = await Challenge.findByIdAndUpdate(
                challengeId,
                { $set: updates },
                { new: true, runValidators: true } // Ensures the returned document is the updated document and runs validators
            );

            if (!updatedChallenge) {
                const error = new Error('Challenge not found');
                error.statusCode = 404;
                throw error;
            }

            return updatedChallenge; // Return the updated document
        } catch (err) {
            throw err; // Error handling
        }
    };

    deleteChallenge = async (challengeId) => {
        try {
            const challenge = await Challenge.findById(challengeId);

            if (!challenge) {
                const error = new Error('Challenge not found');
                error.statusCode = 404;
                throw error;
            }

            const result = await Challenge.findByIdAndDelete(challengeId);

            return {
                challenge: result,
            };
        } catch (err) {
            throw err;
        }
    };

    getChallenge = async (challengeId) => {
        try {
            const challenge = await Challenge.findById(challengeId);

            if (!challenge) {
                const error = new Error('Challenge not found');
                error.statusCode = 404;
                throw error;
            }

            return {
                challenge: challenge,
            };
        } catch (err) {
            throw err;
        }
    };

    getChallenges = async (challengeReq) => {
        const currentPage = +challengeReq.pageNum || 1;
        const perPage = +challengeReq.perPage || 10; // Set default items per page
        const difficulty = challengeReq.difficulty;
    
        let filter = {};
        if (difficulty) {
            filter.difficulty = difficulty; // Add filter condition
        }
    
        try {
            // Find challenges with filters, skip for pagination, and limit for items per page
            const challenges = await Challenge.find(filter)
                .skip((currentPage - 1) * perPage)
                .limit(perPage);
    
            // Optionally, get the total count of challenges for the given filter to calculate total pages
            const totalChallenges = await Challenge.countDocuments(filter);
    
            return {
                challenges,
                totalChallenges, // Total number of challenges matching the filter
                currentPage,
                perPage,
                totalPages: Math.ceil(totalChallenges / perPage), // Calculate total pages
            };
        } catch (err) {
            throw err;
        }
    };    

    getByCredentials = async (challengeReq) => {
        try {
            const challenge = await Challenge.findOne(challengeReq);

            if (!challenge) {
                const error = new Error('Challenge not found');
                error.statusCode = 404;
                throw error;
            }

            return {
                challenge: challenge,
            };
        } catch (err) {
            throw err;
        }
    };
}