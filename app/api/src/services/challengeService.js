export default class ChallengeService {
    constructor({ challengeRepository }) {
        this.challengeRepository = challengeRepository;
    }

    createChallenge = async (challengeData) => {
        try {
            return await this.challengeRepository.createChallenge(challengeData);
        } catch (err) {
            throw err;
        }
    };

    updateChallenge = async (challengeData) => {
        try {
            return await this.challengeRepository.updateChallenge(challengeData);
        } catch (err) {
            throw err;
        }
    };

    deleteChallenge = async (challengeId) => {
        try {
            return await this.challengeRepository.deleteChallenge(challengeId);
        } catch (err) {
            throw err;
        }
    };

    getChallenge = async (challengeId) => {
        try {
            return await this.challengeRepository.getChallenge(challengeId);
        } catch (err) {
            throw err;
        }
    };

    getChallenges = async (challengeReq) => {
        try {
            return await this.challengeRepository.getChallenges(challengeReq);
        } catch (err) {
            throw err;
        }
    };

    getByCredentials = async (challengeReq) => {
        try {
            return await this.challengeRepository.getByCredentials(challengeReq);
        } catch (err) {
            throw err;
        }
    };
}