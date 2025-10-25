import Authenticator from '../../controllers/Authenticator.js'; // FIX: correct relative import
import { Check_login_info } from '../../controllers/Check_login_info.js';
import { getUserModel } from '../../utils/getUserModel.js'; // FIX: correct relative import




const resolvers = {
    Query: {
        LeaderBoard_Info: async (parent, args, context) => {
            if (context.loggedIn==false) {
                throw new Error("Not authenticated");
            }
            const UserModel = getUserModel('Users');
            const users = await UserModel.find().sort({ points: -1 });
            return users;
        },

        FindUserForProfile: async (parent, args, context) => {
            // const { user } = context; // FIX: Use context.user from JWT/session
            // const { req } = context; // FIX: Use context.user from JWT/session
            // const is_user_authenticated = await isloggedin(req); // this is for middle ware

            // if (is_user_authenticated) {
            //     const UserModel = getUserModel('Users');
            //     const user_all_info = await UserModel.findOne({ username: user.username });
            //     return user_all_info;
            // } else {
            //     console.log(is_user_authenticated);
            // }
            if (context.loggedIn==false) {
                throw new Error("Not authenticated");
            }
            const UserModel = getUserModel('Users');
            const user_all_info = await UserModel.findOne({ username: context.req.session.user.username });
            return user_all_info;

        },

        Main_menu: async (parent, args, context) => {
            if (context.loggedIn==false) {
                throw new Error("Not authenticated");
            }
            const UserModel = getUserModel('Users');
            const user_all_info = await UserModel.findOne({ username: context.req.session.user.username }); // FIX: await
            // console.log(user_all_info)
            return user_all_info
        }
    },

    Mutation: {
        user_login: async (parent, args, context) => {
            try {
                const UseruserModel = getUserModel('Users');
                const fetchedinfo = args.input;
                const username = fetchedinfo.username;
                let is_this_a_user = await UseruserModel.findOne({ username: username });
                if (is_this_a_user != null) {
                    // const checking=Check_login_info(fetchedinfo,context,is_this_a_user);
                    const result = await Check_login_info(fetchedinfo, context, is_this_a_user);
                    return result;
                } else {
                    return {
                        success: false,
                        message: "User not found"
                    }
                }
            } catch (error) {
                return {
                    success: false,
                    message: error
                }
            }


        },



        user_creation: async (parent, args) => {
            try {
                const UserModel = getUserModel('Users');
                const fetchedinfo = args.input;
                const username = fetchedinfo.username;

                const username_available = await UserModel.findOne({ username: username }); // FIX: await
                if (username_available == null) {
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
                } else {
                    console.log(`Username taken`)
                    return {
                        success: false,
                        message: `Username taken`
                    }
                }

            } catch (error) {
                return {
                    success: false,
                    message: `${error.message}`
                }
                // throw new Error(`Failed to create user: ${error.message}`);

            }
        },

        logout: async (parent, args, context) => {
            try {
                // --- Destroy session ---
                if (context.req.session) {
                    await new Promise((resolve, reject) => {
                        context.req.session.destroy(err => {
                            if (err) {
                                console.error("Error destroying session:", err);
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    });
                }
        
                // --- Clear JWT cookie ---
                context.res.clearCookie("token", {
                    httpOnly: true,
                    sameSite: "lax",
                    secure: process.env.NODE_ENV === "production", // should be true in production
                });
        
                // --- Clear username cookie (if you set one) ---
                context.res.clearCookie("username", {
                    sameSite: "lax",
                    secure: process.env.NODE_ENV === "production",
                });
        
                console.log("✅ User logged out successfully");
        
                return {
                    success: true,
                    message: "Logout successful",
                };
            } catch (error) {
                console.error("❌ Logout error:", error);
                return {
                    success: false,
                    message: `Logout failed: ${error.message}`,
                };
            }
        },
        

        Update: async (parent, args, context) => {
            console.log(args.input);
            try {
                // const { user } = context;
                // if (!user || !user.username) {
                //     throw new Error('User not authenticated');
                // }
                
                const UserModel = getUserModel('Users');
                const fetchedinfo = args.input;

                // const After_Auth = await Authenticator({
                //     username: user.username,
                //     displayname: fetchedinfo.newdisplayname,
                //     password: fetchedinfo.newpassword
                // });

                const updatedUser = await UserModel.findOneAndUpdate(
                    { username: context.req.session.user.username },
                    {
                        displayname: fetchedinfo.newdisplayname,
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

export default resolvers;