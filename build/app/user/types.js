"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = void 0;
exports.types = `#graphql
    type User {
        id: ID!
        name: String!
        email: String!
        password: String!
        profileImageUrl: String
    }
`;
