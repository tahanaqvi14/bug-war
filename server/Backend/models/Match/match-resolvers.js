import { getUserModel } from '../../utils/getUserModel.js'
import { v4 as uuidv4 } from 'uuid';


const challenge_resolvers = {
    Query: {
        //// //// ////
    },
    Mutation: {
        createMatch: async (parent, args, context) => {

            const usernames = args.input;
            const UserModel = getUserModel('Users');
            const users = await UserModel.find({ username: { $in: usernames } });
            // console.log(users);
            if (users.length !== usernames.length) {
                throw new Error('One or more users not found');
            }
            const participants = usernames.map(u => ({
                username: u,
                points: 0
            }));

            const matchId = uuidv4();
            const MatchModel = getUserModel('Matches');
            const matchinfo=await MatchModel.create({
                matchId: matchId,
                participants
            })
            let forwardingV= matchinfo.toObject();

            forwardingV.participants.forEach((participant, index) => {
                participant.displayName = users[index].displayname;
              });
            return forwardingV;
        },
    }
};

export default challenge_resolvers;