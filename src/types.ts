export type Context = {
    user?: JWTUser;
};

export type JWTUser = {
    id: string;
    email: string;
}

export type CreateTweetInput = {
    content: string;
    imageUrl?: string;
    authorId: string;
}

export type GoogleTokenResult = {
    iss?: string;
    nbf?: string;
    aud?: string;
    sub?: string;
    email: string;
    email_verified: string;
    azp?: string;
    name?: string;
    picture?: string;
    given_name: string;
    family_name?: string;
    iat?: string;
    exp?: string;
    jti?: string;
    alg?: string;
    kid?: string;
    typ?: string;
}

