createChallenge = async (req, res, next) => {
    const { title, description, difficulty, category, creator, tests } = req.body;

    try {
        const { challenge, token } = await this.challengeService.createChallenge({
            title,
            description,
            difficulty,
            category,
            creator,
            tests,
        });

        res.status(201).json({
            message: "Challenge created successfully!",
            challenge: challenge,
            token: token,
        });
    } catch (err) {
        next(err);
    }
};

updateChallenge = async (req, res, next) => {
    const challengeId = req.params.challengeId;
    const { title, description, difficulty, category, creator, tests } = req.body;

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
            creator,
            tests,
        });

        res.status(200).json({
            message: "Challenge updated successfully!",
            challenge: challenge,
        });
    } catch (err) {
        next(err);
    }
};

deleteChallenge = async (req, res, next) => {
    const challengeId = req.params.challengeId;

    try {
        if (!ObjectId.isValid(challengeId)) {
            return res.status(400).json({ message: "Invalid challengeId!" });
        }

        await this.challengeService.deleteChallenge(challengeId);

        res.status(200).json({
            message: "Challenge deleted successfully!",
        });
    } catch (err) {
        next(err);
    }
};

getChallenge = async (req, res, next) => {
    const challengeId = req.params.challengeId;

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
        next(err);
    }
};

getAllChallenges = async (req, res, next) => {
    try {
        const challenges = await this.challengeService.getAllChallenges();

        res.status(200).json({
            message: "Challenges fetched successfully!",
            challenges: challenges,
        });
    } catch (err) {
        next(err);
    }
};
