import { ApiReference } from "@scalar/nextjs-api-reference";
import { spec } from "@/openapi";

export const GET = ApiReference({
    content: JSON.stringify(spec),
    hiddenClients: true,
    defaultHttpClient: {
        targetKey: "js",
        clientKey: "fetch"
    },
    layout: "classic",
    theme: "moon",
});