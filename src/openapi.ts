import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { Errors } from "@/lib/server/error";
import { contracts } from "@/lib/server/openapi/contracts";

extendZodWithOpenApi(z);

const HEADER = {
    openapi: "3.0.0",
    info: {
        title: "Seedbank API",
        version: "2.0.0",
        description: "Internal API reference for Seedbank.",
    },
};

const registry = new OpenAPIRegistry();

const errorSchema = registry.register("Error", z.object({
    success: z.literal(false),
    error: z.string(),
}));

registry.registerComponent("securitySchemes", "UserIdAuth", {
    type: "apiKey",
    in: "header",
    name: "x-user-id",
});

for (const contract of contracts) {
    const responses: Record<number, any> = {
        200: {
            description: "Successful operation",
            content: {
                "application/json": {
                    schema: z.object({ success: z.literal(true), data: contract.response }),
                },
            },
        },
    };

    for (const errorCode of contract.errors) {
        const errorDefinition = Errors[errorCode];
        responses[errorDefinition.status] = {
            description: errorCode,
            content: {
                "application/json": {
                    schema: errorSchema,
                },
            },
        };
    }

    const isAuthErrorMissing = contract.auth && !responses[401];
    if (isAuthErrorMissing) {
        responses[401] = {
            description: "UNAUTHORIZED",
            content: {
                "application/json": {
                    schema: errorSchema,
                },
            },
        };
    }

    const pathParams = [...contract.path.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]);
    const hasPathParams = pathParams.length > 0;

    const requestConfig: any = {};
    if (contract.body) {
        requestConfig.body = { content: { "application/json": { schema: contract.body } } };
    }
    if (hasPathParams) {
        requestConfig.params = z.object(
            pathParams.reduce((accumulator, param) => ({ ...accumulator, [param]: z.string() }), {})
        );
    }

    const hasRequestConfig = Object.keys(requestConfig).length > 0;

    registry.registerPath({
        method: contract.method,
        path: contract.path,
        tags: [contract.tag],
        summary: contract.summary,
        security: contract.auth ? [{ UserIdAuth: [] }] : undefined,
        request: hasRequestConfig ? requestConfig : undefined,
        responses,
    });
}

const generator = new OpenApiGeneratorV3(registry.definitions);

export const spec = generator.generateDocument(HEADER);