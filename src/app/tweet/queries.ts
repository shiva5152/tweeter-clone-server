export const queries = `#graphql
    getTweets: [Tweet]
    getTweet(id: ID!): Tweet
    getSignedUrlForTweet(imageType: String!): String
`