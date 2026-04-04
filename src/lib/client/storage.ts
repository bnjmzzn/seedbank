const KEYS = {
    TOKEN: 'token',
    TOS_PENDING: 'tos',
};

export const storage = {
    getToken: () => typeof window !== 'undefined' ? localStorage.getItem(KEYS.TOKEN) : null,
    setToken: (token: string) => localStorage.setItem(KEYS.TOKEN, token),
    removeToken: () => localStorage.removeItem(KEYS.TOKEN),

    getTosPending: () => localStorage.getItem(KEYS.TOS_PENDING) === 'true',
    setTosPending: (val: boolean) => localStorage.setItem(KEYS.TOS_PENDING, String(val)),
    removeTosPending: () => localStorage.removeItem(KEYS.TOS_PENDING),

    clearAuth: () => {
        localStorage.removeItem(KEYS.TOKEN);
    }
};