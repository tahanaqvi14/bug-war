import { getUserModel } from '../../utils/getUserModel.js'; // FIX: correct relative import
import Code from '../../code_verification/Code.js'

const challenge_resolvers = {
    Query: {
        Get_challenge: async () => {
            const ChallengeModel = getUserModel('Challenges');
            const challenge = await ChallengeModel.find();
            return challenge;
        },
        checking_user_code: async (parent, args) => {
            const result = Code(args.input);
            return result
        }
    }
};

export default challenge_resolvers;