export const types = `#graphql

    input CreateTweetInput {
        content: String!
        imageUrl: String
    }

    type Tweet {
        id: ID!
        content: String!
        imageUrl: String
        authorId: ID!
        author: User!  
    }
`