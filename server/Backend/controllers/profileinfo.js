import { getUserModel } from '../utils/getUserModel.js';

export  async function profileinfo(req, res) {
    try {
        const UseruserModel = getUserModel('Users');

        let username=req.session.user.username
        console.log('pp: ',username);

        let user1 = await UseruserModel.findOne({ username: username });
        res.send(user1);
        
    } catch (error) {
        res.send(error)
    }
}