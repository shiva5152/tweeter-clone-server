import { User } from "@prisma/client";
import JWT from "jsonwebtoken";

const JWT_SECRET = "mysecretkey";

class JWTService {

    public static async generateTokenForUser(user: User): Promise<string> {

        const payload = {
            userId: user?.id,
            email: user?.email
        }

        const token = JWT.sign(payload, JWT_SECRET as string);
        return token;
    }
}

export default JWTService;