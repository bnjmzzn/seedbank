import { ApiReference } from "@scalar/nextjs-api-reference";
import { spec } from "@/openapi";

export const GET = ApiReference({
    content: JSON.stringify(spec),
    hiddenClients: true,
    defaultHttpClient: {
        targetKey: "js",
        clientKey: "fetch"
    },
    layout: "modern",
    theme: "fastify",
    defaultOpenAllTags: true,
    hideTestRequestButton: true,
    hideDarkModeToggle: true,
    favicon: "/icon.svg",
    metaData: {
        title: "Seedbank API",
    },
    agent: {
        disabled: true,
    },
    hideModels: true,
});