import User from '../models/user.js';


export const registerUser = async function (req, res) {
    try {
        let { displayname, username, password } = req.body;
        // Create the user
        await User.create({ displayname, username, password });
        res.status(201).json({ message: 'User registered successfully'});

    } catch (error) {
        console.log(error)
    }
}
