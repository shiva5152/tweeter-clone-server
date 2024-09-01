import { User } from "@prisma/client";
import JWT from "jsonwebtoken";
import { JWTUser } from "../types";
const JWT_SECRET = "mysecretkey";

class JWTService {

    public static async generateTokenForUser(user: User): Promise<string> {

        const payload: JWTUser = {
            id: user?.id,
            email: user?.email
        }

        const token = JWT.sign(payload, JWT_SECRET as string, { algorithm: "HS256" });
        return token;
    }

    public static verifyToken(token: string): JWTUser {

        const decoded = JWT.verify(token, JWT_SECRET as string, { algorithms: ["HS256"] });
        return decoded as JWTUser;
    }
}

export default JWTService;