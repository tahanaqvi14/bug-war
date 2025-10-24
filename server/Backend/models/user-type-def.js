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

    
    type Match {
        matchId: ID!
        players: [user!]!
    }
    
    type question{
        problem_statement:String!
        function_name:String!
    }

    type Query {
        LeaderBoard_Info: [user!]!
        FindUserForProfile:user
        Main_menu:user
    }

    type CreateUserResponse {
        success: Boolean!
        message: String!
    }


    type TestResult {
        input: [String!]!
        expected: String!
        output: String!
        passed: Boolean!
    }

    type RunResult {
        results: [TestResult!]!
        logs: [String!]!
        error: String
    }

    input createuser{
        displayname:String!
        username:ID!
        password:String!
    }

    input loginuser{
        username:ID!
        password:String!
    }

    input updateuser{
        newdisplayname:String!
    }
    
    input inputformatchsaving{
        usernames:String!
    }

    type Mutation{
        user_creation(input:createuser!):CreateUserResponse!
        user_login(input:loginuser!):CreateUserResponse!
        Update(input:updateuser):user
        logout:CreateUserResponse!
        finduser_and_savematch(input: [inputformatchsaving!]!): Match!


        runCode(code: String!): RunResult!

    }
`
export default typeDefs;