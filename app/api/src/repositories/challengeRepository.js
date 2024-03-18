import Challenge from '../models/Challenge';

class ChallengeRepository {
    async createChallenge(challengeData) {
        try {
            const challenge = new Challenge(challengeData);
            return await challenge.save();
        } catch (err) {
            throw err;
        }
    }

    async updateChallenge(challengeData) {
        try {
            return await Challenge.findByIdAndUpdate(challengeData.id, challengeData, { new: true });
        } catch (err) {
            throw err;
        }
    }

    async deleteChallenge(challengeId) {
        try {
            return await Challenge.findByIdAndDelete(challengeId);
        } catch (err) {
            throw err;
        }
    }

    async getChallenge(challengeId) {
        try {
            return await Challenge.findById(challengeId);
        } catch (err) {
            throw err;
        }
    }

    async getChallenges(challengeReq) {
        try {
            return await Challenge.find(challengeReq);
        } catch (err) {
            throw err;
        }
    }

    async getByCredentials(challengeReq) {
        try {
            return await Challenge.findOne(challengeReq);
        } catch (err) {
            throw err;
        }
    }
}

export default ChallengeRepository;
