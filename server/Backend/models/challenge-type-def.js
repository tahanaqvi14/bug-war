import { gql } from 'graphql-tag';

const challenge_typeDefs= gql`
    type challenge{
        function_name:String
        problem_statement:String
    }
    type Query{
        Get_challenge:[challenge]
    }   
`
export default challenge_typeDefs;