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
            const matchinfo = await MatchModel.create({
                matchId: matchId,
                participants
            })
            let forwardingV = matchinfo.toObject();

            forwardingV.participants.forEach((participant, index) => {
                participant.displayName = users[index].displayname;
            });
            return forwardingV;
        },
        updatematchpoint: async (parent, args, context) => {
            let matchId = args.matchId;
            let username = args.username
            const MatchModel = getUserModel('Matches');

            // Find match
            const match = await MatchModel.findOne({ matchId });
            if (!match) {
                throw new Error('Match not found');
            }

            // Find participant index
            const participantIndex = match.participants.findIndex(
                (p) => p.username === username
            );

            if (participantIndex === -1) {
                throw new Error('User not found in this match');
            }

            // Update points
            match.participants[participantIndex].points += 10;

            // Save match
            await match.save();

            return match;

        },
        matchinterrupt: async (parent, args, context) => {
            let matchId = args.matchId;
            let username = args.username;
            const MatchModel = getUserModel('Matches');

            // Find match
            const match = await MatchModel.findOne({ matchId });
            const opponent = match.participants.find(p => p.username !== username);

            if (!match) {
                throw new Error('Match not found');
            }


            // ✅ Update match
            match.status = 'Interrupted';
            match.winner = opponent ? opponent.username : 'tobedecided';

            await match.save();
            return match;
        }

    }
};

export default challenge_resolvers;