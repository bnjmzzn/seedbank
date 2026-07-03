const KEYS = {
    TOKEN: 'token',
};

export const storage = {
    getToken: () => typeof window !== 'undefined' ? localStorage.getItem(KEYS.TOKEN) : null,
    setToken: (token: string) => localStorage.setItem(KEYS.TOKEN, token),
    removeToken: () => localStorage.removeItem(KEYS.TOKEN),

    clearAuth: () => {
        localStorage.removeItem(KEYS.TOKEN);
    }
};