import { prismaClient } from "../clients/db";
import { CreateTweetInput } from "../types";

class TweetService {
    public static async createTweet(input: CreateTweetInput) {
        const tweet = await prismaClient.tweet.create({
            data: {
                content: input.content,
                imageUrl: input.imageUrl,
                author: {
                    connect: {
                        id: input.authorId
                    }
                }
            }
        });
        return tweet;
    }
    public static getTweets() {
        return prismaClient.tweet.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
    }
    public static getTweetById(id: string) {
        return prismaClient.tweet.findUnique({ where: { id } });
    }
}

export default TweetService;