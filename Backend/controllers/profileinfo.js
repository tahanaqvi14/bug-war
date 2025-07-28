import { getUserModel } from '../utils/getUserModel.js';

export  async function profileinfo(req, res) {
    try {
        const UseruserModel = getUserModel('Users');

        res.send(req.session)

    } catch (error) {
        res.send(error)
    }
}