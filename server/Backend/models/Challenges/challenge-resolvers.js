import { getUserModel } from '../../utils/getUserModel.js'; // FIX: correct relative import
import Code from '../../code_verification/Code.js'

const challenge_resolvers = {
    Query: {
        Get_challenge: async () => {
            const ChallengeModel = getUserModel('Challenges');
            const challenge = await ChallengeModel.find({ id_number: Math.floor(Math.random() * 2) + 1 })
            return challenge;
        },
        checking_user_code: async (parent, args) => {
            const ChallengeModel = getUserModel('Challenges');
            const challenge = await ChallengeModel.find({ id_number: args.input.challengeid })
            const result = Code(args.input.code,challenge);
            return result
        }
    }
};

export default challenge_resolvers;