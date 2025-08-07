import { gql } from 'graphql-tag';


const typeDefs = gql`
    type user{
        displayname:String!
        username:ID!
        password:String!
        points:Int
        sub_name:String
        challenges_completed:[String!]
        totalWins:Int
        total_matches:Int
    }
    type Query {
        LeaderBoard_Info: [user!]!
        FindUserForProfile:user

    }
    input createuser{
        displayname:String!
        username:ID!
        password:String!
    }
    input updateuser{
        newdisplayname:String!
        newpassword:String!
    }

    type CreateUserResponse {
        success: Boolean!
        message: String!
    }


    type Mutation{
        user_creation(input:createuser!):CreateUserResponse!
        Update(input:updateuser):user
    }
`
export default typeDefs;
