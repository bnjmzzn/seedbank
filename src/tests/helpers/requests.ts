interface MakeRequestOptions {
    method?: string;
    body?: unknown;
    userId?: string;
    searchParams?: Record<string, string>;
}

export function makeRequest(options: MakeRequestOptions = {}): Request {
    const method = options.method ?? "GET";
    const headers = new Headers();

    if (options.userId !== undefined) {
        headers.set("x-user-id", options.userId);
    }

    let url = "http://localhost/api/test";
    if (options.searchParams) {
        const params = new URLSearchParams(options.searchParams);
        url = `${url}?${params.toString()}`;
    }

    const init: RequestInit = { method, headers };

    if (options.body !== undefined) {
        headers.set("Content-Type", "application/json");
        init.body = JSON.stringify(options.body);
    }

    return new Request(url, init);
}

export function makeParams<T extends Record<string, string>>(params: T): { params: Promise<T> } {
    return { params: Promise.resolve(params) };
}