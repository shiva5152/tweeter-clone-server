export const types = `#graphql
    type User {
        id: ID!
        firstName: String
        lastName: String
        email: String!
        password: String!
        profileImageUrl: String
        tweets: [Tweet]
        
    }
`