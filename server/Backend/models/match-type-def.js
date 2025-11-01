import { gql } from 'graphql-tag';

const match_typeDefs = gql`
    type Participant {
        username: String!
        points: Int
    }

    type Match {
        matchId: String!
        participants: [Participant!]!
        winner: String
        matchDate: String
        status:String
    }


    
    input ParticipantInput {
        username: String!
        points: Int
    }
        
    input MatchInput {
        participants: [ParticipantInput!]!
        winner: String
    }
        

    type Mutation {
        createMatch(input: MatchInput!): Match!
        updateWinner(matchId: String!, winner: String!): Match!
    }

    type Query{
        Get_matchinfo:[Match]
    }
`
export default match_typeDefs;