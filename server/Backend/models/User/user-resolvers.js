import Authenticator from '../../controllers/Authenticator'; // FIX: correct relative import
import { getUserModel } from '../../utils/getUserModel.js'; // FIX: correct relative import
import isloggedin from "../../middleware/isloggedIn"

const resolvers = {
    Query: {
        LeaderBoard_Info: async () => {
            const UserModel = getUserModel('Users');
            const users = await UserModel.find().sort({ points: -1 });
            console.log(users);
            return users;
        },

        FindUserForProfile: async (parent, args, context) => {
            const { user } = context; // FIX: Use context.user from JWT/session
            const { req } = context; // FIX: Use context.user from JWT/session
            const is_user_authenticated = await isloggedin(req); // ✅ pass req
            if (is_user_authenticated) {
                const UserModel = getUserModel('Users');
                const user_all_info = await UserModel.findOne({ username: user.username }); // FIX: await
                return user_all_info;
            } else {
                console.log(is_user_authenticated);
            }
        }
    },

    Mutation: {
        CreateUser: async (parent, args) => {
            try {
                const UserModel = getUserModel('Users');
                const fetchedinfo = args.input;
                const { username } = fetchedinfo;

                const username_available = await UserModel.findOne({ username }); // FIX: await
                if (username_available) {
                    throw new Error('User already exists');
                }

                const user_all_detail = await Authenticator(fetchedinfo);

                await UserModel.create({
                    displayname: user_all_detail.displayname,
                    username: user_all_detail.username,
                    password: user_all_detail.hash
                });

                return {
                    success: true,
                    message: 'User created successfully'
                };
            } catch (error) {
                throw new Error(`Failed to create user: ${error.message}`);
            }
        },

        Update: async (parent, args, context) => {
            try {
                const { user } = context; // FIX: context contains logged-in user
                if (!user || !user.username) {
                    throw new Error('User not authenticated');
                }

                const UserModel = getUserModel('Users');
                const fetchedinfo = args.input;

                const After_Auth = await Authenticator({
                    username: user.username,
                    displayname: fetchedinfo.newdisplayname,
                    password: fetchedinfo.newpassword
                });

                const updatedUser = await UserModel.findOneAndUpdate(
                    { username: user.username },
                    {
                        displayname: After_Auth.displayname,
                        password: After_Auth.hash
                    },
                    { new: true }
                );

                return updatedUser;
            } catch (error) {
                throw new Error(`Failed to update user: ${error.message}`);
            }
        }
    }
};

export { resolvers }; // ✅ modern ES module syntax
