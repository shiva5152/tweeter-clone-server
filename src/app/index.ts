import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import { User } from './user';
import { Tweet } from './tweet';
import { Context } from '../types';
import JWTService from '../services/jwt';




export async function initServer() {
    const app = express();

    const graphqlServer = new ApolloServer<Context>({
        typeDefs: `
            ${User.types}
            ${Tweet.types}

            type Query {
            ${User.queries}
            ${Tweet.queries}
            }

            type Mutation {
                ${Tweet.mutations}
            }
            `,
        resolvers: {
            Query: {
                ...User.resolvers.queries,
                ...Tweet.resolvers.queries
            },
            Mutation: {
                ...Tweet.resolvers.mutations,
            },
            ...Tweet.resolvers.extraResolvers,
            ...User.resolvers.extraResolvers
        },
    });
    await graphqlServer.start();

    app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(graphqlServer, {
        context: async ({ req }) => {
            const authHeader = req.headers.authorization || '';
            const token = authHeader.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : null;
            let user = null;
            if (token) {
                try {
                    user = JWTService.verifyToken(token);
                } catch (e) {
                    console.error('Invalid token', e);
                }
            }
            return { user };
        }
    }));
    return app;
}

const app = express();
