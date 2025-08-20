import { getUserModel } from '../../utils/getUserModel.js'; // FIX: correct relative import


const challenge_resolvers = {
    Query: {
        Get_challenge: async () => {
            const ChallengeModel = getUserModel('Challenges');
            const challenge = await ChallengeModel.find();
            console.log(challenge);
            return challenge;
        }
    }
};

export default challenge_resolvers;