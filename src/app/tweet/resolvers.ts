import { Context, CreateTweetInput } from "../../types";
import { prismaClient } from "../../clients/db";
import { Tweet } from "@prisma/client";
import { PutObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import UserService from "../../services/user";
import TweetService from "../../services/tweet";

const s3Config: S3ClientConfig = {
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
};

const s3Client = new S3Client(s3Config);

const queries = {
    getTweets: async () => {
        const tweets = await TweetService.getTweets();
        return tweets;
    },

    getTweet: async (parent: any, { id }: { id: string }) => {
        const tweet = await TweetService.getTweetById(id);
        return tweet;
    },

    getSignedUrlForTweet: async (parent: any, { imageType }: { imageType: string }, context: Context) => {

        if (!context.user) {
            throw new Error("User not authenticated");
        }
        const allowedImageTypes = ["png", "jpeg", "jpg", "webp"];

        if (!allowedImageTypes.includes(imageType)) {
            throw new Error("Invalid image type");
        }

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: `tweets/${context.user.id}-${Date.now()}.${imageType}`, // The key (file path) for the object in the bucket
            ContentType: `image/${imageType}`,
        });

        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        return signedUrl;
    }
}


const mutations = {
    createTweet: async (parent: any, { payload }: { payload: CreateTweetInput }, context: Context) => {
        if (!context.user) {
            throw new Error("User not authenticated");
        }

        const tweet = await TweetService.createTweet({ ...payload, authorId: context.user.id });
        return tweet;
    },
}

const extraResolvers = {
    Tweet: {
        author: async (parent: Tweet) => {
            return await UserService.getUserById(parent.authorId);
        }
    }
}

export const resolvers = {
    mutations,
    extraResolvers,
    queries
}
