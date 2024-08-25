import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import { prismaClient } from '../clients/db';
import { User } from './user';


export async function initServer() {
    const app = express();

    const graphqlServer = new ApolloServer({
        typeDefs: `
            ${User.types}

            type Query {
            ${User.queries}
            }
            `,
        resolvers: {
            Query: {
                ...User.resolvers.queries,
            },
        },
    });
    await graphqlServer.start();

    app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(graphqlServer));
    return app;
}

const app = express();
