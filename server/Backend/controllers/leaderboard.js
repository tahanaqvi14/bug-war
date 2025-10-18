import { getUserModel } from '../utils/getUserModel.js';

export  async function board(req, res) {
    try {
        const UseruserModel = getUserModel('Users');
        // displayName: { $exists: true, $ne: null }

        // $exists: true
        // ✅ Means: the field displayName must exist in the document
        // ❌ So if a document has no displayName field at all, it will be ignored.
        
        // $ne: null
        // ✅ Means: displayName should not be null (null = empty value).
        // ❌ So even if the field exists but is null, it will be skipped.

        
        let user_already = await UseruserModel.find({}).sort({points:-1}); // 1 = ascending, -1 = descending
        const Leaderboard=user_already.map((user,index)=>{ //user is the current user object from the array. //index is the position of that user in the array (starts at 0).
            return `#${index + 1} Name: ${user.displayname} | Points: ${user.points}`;
        });

//❓ Why I used .map() instead of a for loop or array pushing:
// Because your goal was:

// To take a list of users,

// And convert it into a new list of formatted text lines like:
// "Name: taha | Points: 100"

// This is called transforming an array, and .map() is literally made for this.


        // Join all lines into a single string with line breaks and send
        res.send(Leaderboard.join('\n'));

// for (let i = 0; i < user_already.length; i++) {
// for (let i = 0; i < user_already.length; i++) {
//     res.send(`Name:${user_already[i].displayname} Points:${user_already[i].points}`)
// }
// res.send(user_already)

    } catch (error) {
        res.send(error)
    }
}