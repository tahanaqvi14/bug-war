import { getUserModel } from '../../utils/getUserModel.js'; // FIX: correct relative import
import Code from '../../code_verification/Code.js'

const challenge_resolvers = {
    Query: {
        Get_challenge: async () => {
            const ChallengeModel = getUserModel('Challenges');
            const challenge = await ChallengeModel.find({ id_number: Math.floor(Math.random() * 2) + 1 })
            console.log('result: ',challenge)
            return challenge;
        },
        checking_user_code: async (parent, args) => {
            console.log('this is input',args.input)
            const ChallengeModel = getUserModel('Challenges');
            const challenge = await ChallengeModel.find();
            const result = Code(args.input,challenge);
            return result
        }
    }
};

export default challenge_resolvers;