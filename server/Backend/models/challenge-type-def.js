import { gql } from 'graphql-tag';

const challenge_typeDefs = gql`

    type challenge{
        function_name:String
        problem_statement:String
        id_number:Int
        testcases: [testcase]
    }

    type testcase {
        case: [Int!]!
        expected: Int!
    }

        
    input checking_code{
        code:String!
        challengeid:Int!
    }

    type TestCaseResult {
        case: [Int!]!
        expected: Int!
        output: Int
        passed:Boolean!
    }

    type TestCase {
        results: [TestCaseResult]
        passed: Boolean
        message: String
        consolelogs: [String]
    }

    type CodeResponse {
        success: Boolean!
        message: TestCase
    }

    type Query{
        Get_challenge:[challenge]
        checking_user_code(input:checking_code!):CodeResponse!
    }
    `
    export default challenge_typeDefs;