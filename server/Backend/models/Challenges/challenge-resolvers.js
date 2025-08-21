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
            console.log('result:',result);
            return {
                success: true,
                message: {
                    input: [1, 2],
                    expected: 3,
                    output: 4,
                    passed: false,
                    message: "Output did not match expected"
                }
            }
        }
    }
};

export default challenge_resolvers;