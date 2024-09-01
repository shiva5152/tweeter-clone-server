import { response } from "express";
import axios from "axios";
import { prismaClient } from "../../clients/db";
import JWTService from "../../services/jwt";
import { Context } from "../../types";
import { User } from "@prisma/client";
import UserService from "../../services/user";

const queries = {
    verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
        const authToken = await UserService.verifyGoogleAuthToken(token);
        return authToken;
    },
    getCurrentUser: async (parent: any, args: any, context: Context) => {
        const id = context.user?.id;
        if (!id) {
            return null;
        }
        const user = await UserService.getUserById(id);
        return user;
    },
    getUserById: async (parent: any, { id }: { id: string }) => {
        const user = await prismaClient.user.findUnique({
            where: { id }
        });
        return user;
    }
};

const extraResolvers = {
    User: {
        tweets: async (parent: User) => {
            return await prismaClient.tweet.findMany({
                where: { authorId: parent.id }
            });
        }
    }
}


export const resolvers = { queries, extraResolvers };