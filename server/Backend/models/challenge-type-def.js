import { gql } from 'graphql-tag';

const challenge_typeDefs = gql`
    type challenge{
        function_name:String
        problem_statement:String
    }

    type Query{
        Get_challenge:[challenge]
        checking_user_code(input:checking_code!):CodeResponse!
    }

    input checking_code{
        code:String!
    }

    type TestCase {
        input: [Int]
        expected: Int
        output: Int
        passed: Boolean
          message: String
  }

    type CodeResponse {
        success: Boolean!
        message: TestCase
    }    

`
export default challenge_typeDefs;