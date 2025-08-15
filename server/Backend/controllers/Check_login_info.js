import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.js';

export async function Check_login_info(fetchedinfo, context, is_this_a_user) {
    try {
        const result = await bcrypt.compare(fetchedinfo.password, is_this_a_user.password);
        if (result) {
            try {
                let token = generateToken(is_this_a_user);
                context.res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'development',
                    // The cookie will only be sent if you're using a secure HTTPS connection (with the 🔒 lock in the browser
                    // if secure value is false so Cookie will work on http:// too (like localhost)
                    // if secure value is true so Cookie will only work on https:// (with the 🔒 lock in the browser) which means it will be used only on production server
                    // in this case we have set NODE_ENV in .env file as production so this will be FALSE as we are using in development mode & when it is production ready so we will set it to TRUE.
                    sameSite: "lax"
                });

                context.req.session.user = {
                    username: fetchedinfo.username
                };
                await context.req.session.save(err => {
                    if (err) console.error('Failed to save session:', err);
                    else console.log('Session saved successfully');
                  });

                return {
                    success: true,
                    message: "You are loggedin!"
                }

            } catch (error) {
                return {
                    success: false,
                    message: error.message
                };
            }

        }
        else {
            return {
                success: false,
                message: "Wrong Password"
            };
        }
    }
    catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}
