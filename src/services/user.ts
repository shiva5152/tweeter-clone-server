import axios from "axios";
import { prismaClient } from "../clients/db";
import JWTService from "./jwt";
import { GoogleTokenResult } from "../types";

class UserService {
    public static async verifyGoogleAuthToken(token: string) {
        const googleToken = token;
        console.log(googleToken);
        const googleOauthURL = new URL("https://www.googleapis.com/oauth2/v3/tokeninfo");
        googleOauthURL.searchParams.append("id_token", googleToken);

        const { data } = await axios.get<GoogleTokenResult>(googleOauthURL.toString(), {
            responseType: 'json'
        });

        const user = await prismaClient.user.findUnique({
            where: { email: data.email }
        })

        if (!user) {
            await prismaClient.user.create({
                data: {
                    email: data.email,
                    firstName: data.given_name,
                    lastName: data.family_name,
                    profileImageUrl: data.picture
                }
            })
        }

        const userInDb = await prismaClient.user.findUnique({ where: { email: data.email } });
        if (!userInDb) {
            throw new Error("User not found");
        }

        const userToken = await JWTService.generateTokenForUser(userInDb);

        return userToken;
    }
    public static getUserById(id: string) {
        return prismaClient.user.findUnique({ where: { id } });
    }
}

export default UserService;