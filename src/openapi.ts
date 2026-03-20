// thanks claude ai :)

export const spec = {
    openapi: "3.0.0",
    info: {
        title: "Seedbank API",
        version: "1.0.0",
        description: "gambling sim",
    },
    servers: [
        { url: "http://localhost:3000", description: "Local" },
        { url: "https://seedbank-xi.vercel.app", description: "Production" },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            Success: {
                type: "object",
                properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "object" },
                },
            },
            Error: {
                type: "object",
                properties: {
                    success: { type: "boolean", example: false },
                    code: { type: "string" },
                },
            },
        },
    },
    paths: {
        "/api/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Register a new user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["username", "password"],
                                properties: {
                                    username: { type: "string", maxLength: 20, example: "alice" },
                                    password: { type: "string", maxLength: 100, example: "hunter2" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: "Registered successfully" },
                    400: { description: "INVALID_BODY", content: { "application/json": { schema: { "$ref": "#/components/schemas/Error" } } } },
                    409: { description: "USERNAME_TAKEN", content: { "application/json": { schema: { "$ref": "#/components/schemas/Error" } } } },
                },
            },
        },
        "/api/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Login and receive a JWT",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["username", "password"],
                                properties: {
                                    username: { type: "string", example: "alice" },
                                    password: { type: "string", example: "hunter2" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Login successful",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: {
                                            type: "object",
                                            properties: {
                                                token: { type: "string" },
                                                user: {
                                                    type: "object",
                                                    properties: {
                                                        id: { type: "string" },
                                                        username: { type: "string" },
                                                        balance: { type: "integer" },
                                                        created_at: { type: "string" },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: { description: "INVALID_CREDENTIALS", content: { "application/json": { schema: { "$ref": "#/components/schemas/Error" } } } },
                },
            },
        },
        "/api/users/{username}/profile": {
            get: {
                tags: ["Users"],
                summary: "Get a user profile",
                parameters: [
                    { name: "username", in: "path", required: true, schema: { type: "string" } },
                ],
                responses: {
                    200: {
                        description: "User profile",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: {
                                            type: "object",
                                            properties: {
                                                username: { type: "string" },
                                                balance: { type: "integer" },
                                                rank: { type: "integer" },
                                                created_at: { type: "string" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    404: { description: "USER_NOT_FOUND", content: { "application/json": { schema: { "$ref": "#/components/schemas/Error" } } } },
                },
            },
        },
        "/api/users/{username}/history": {
            get: {
                tags: ["Users"],
                summary: "Get a user's transaction history",
                parameters: [
                    { name: "username", in: "path", required: true, schema: { type: "string" } },
                    { name: "limit", in: "query", schema: { type: "integer", default: 20, maximum: 100 } },
                    { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
                ],
                responses: {
                    200: {
                        description: "History entries",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    change: { type: "integer" },
                                                    reason: { type: "string" },
                                                    created_at: { type: "string" },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    404: { description: "USER_NOT_FOUND", content: { "application/json": { schema: { "$ref": "#/components/schemas/Error" } } } },
                },
            },
        },
        "/api/leaderboard": {
            get: {
                tags: ["Users"],
                summary: "Get top 20 users by balance",
                responses: {
                    200: {
                        description: "Leaderboard",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    rank: { type: "integer" },
                                                    username: { type: "string" },
                                                    balance: { type: "integer" },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        "/api/daily": {
            post: {
                tags: ["Game"],
                summary: "Claim daily seeds (once per 24 hours)",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: "Daily claimed",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: {
                                            type: "object",
                                            properties: {
                                                claimed: { type: "integer", example: 100 },
                                                balance: { type: "integer" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    401: { description: "UNAUTHORIZED", content: { "application/json": { schema: { "$ref": "#/components/schemas/Error" } } } },
                    429: { description: "COOLDOWN_ACTIVE — includes remaining ms", content: { "application/json": { schema: { "$ref": "#/components/schemas/Error" } } } },
                },
            },
        },
        "/api/play": {
            post: {
                tags: ["Game"],
                summary: "Play a game",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["game", "bet"],
                                properties: {
                                    game: {
                                        type: "string",
                                        enum: ["GAME:COINFLIP", "GAME:DICE", "GAME:COLOR", "GAME:BOMB", "GAME:RACE"],
                                        example: "GAME:COINFLIP",
                                    },
                                    bet: { type: "integer", minimum: 5, example: 50 },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Game result",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: {
                                            type: "object",
                                            properties: {
                                                won: { type: "boolean" },
                                                delta: { type: "integer" },
                                                balance: { type: "integer" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: { description: "INVALID_BODY / INSUFFICIENT_BALANCE", content: { "application/json": { schema: { "$ref": "#/components/schemas/Error" } } } },
                    401: { description: "UNAUTHORIZED", content: { "application/json": { schema: { "$ref": "#/components/schemas/Error" } } } },
                },
            },
        },
        "/api/transfer": {
            post: {
                tags: ["Economy"],
                summary: "Transfer seeds to another user",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["toUsername", "amount"],
                                properties: {
                                    toUsername: { type: "string", example: "bob" },
                                    amount: { type: "integer", minimum: 1, maximum: 100000000, example: 500 },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Transfer successful",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: {
                                            type: "object",
                                            properties: {
                                                transferred: { type: "integer" },
                                                balance: { type: "integer" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: { description: "INVALID_BODY / INSUFFICIENT_BALANCE / SELF_TRANSFER / TRANSFER_LIMIT", content: { "application/json": { schema: { "$ref": "#/components/schemas/Error" } } } },
                    401: { description: "UNAUTHORIZED", content: { "application/json": { schema: { "$ref": "#/components/schemas/Error" } } } },
                    404: { description: "USER_NOT_FOUND", content: { "application/json": { schema: { "$ref": "#/components/schemas/Error" } } } },
                },
            },
        },
        "/api/steal": {
            post: {
                tags: ["Economy"],
                summary: "Attempt to steal seeds from another user",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["fromUsername", "amount"],
                                properties: {
                                    fromUsername: { type: "string", example: "bob" },
                                    amount: { type: "integer", minimum: 1, maximum: 100000000, example: 200 },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Steal attempt result",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        success: { type: "boolean", example: true },
                                        data: {
                                            type: "object",
                                            properties: {
                                                success: { type: "boolean", description: "Whether the steal succeeded" },
                                                delta: { type: "integer", description: "Change to stealer's balance" },
                                                balance: { type: "integer" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: { description: "INVALID_BODY / INSUFFICIENT_BALANCE / SELF_STEAL / STEAL_LIMIT", content: { "application/json": { schema: { "$ref": "#/components/schemas/Error" } } } },
                    401: { description: "UNAUTHORIZED", content: { "application/json": { schema: { "$ref": "#/components/schemas/Error" } } } },
                    404: { description: "USER_NOT_FOUND", content: { "application/json": { schema: { "$ref": "#/components/schemas/Error" } } } },
                },
            },
        },
    },
} as const;
