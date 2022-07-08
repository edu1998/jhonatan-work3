export function jwtExp(token) {
    if (!(typeof token === 'string')) {
        return null;
    }

    const split = token.split('.');

    if (split.length < 2) {
        return null;
    }

    try {
        const jwt = JSON.parse(atob(token.split('.')[1]));
        if (jwt && jwt.exp && Number.isFinite(jwt.exp)) {
            return jwt.exp * 1000;
        } else {
            return null;
        }
    } catch (e) {
        return null;
    }
};

export function isExpired(token) {
    const exp = jwtExp(token);
    if (!exp) {
        return false;
    }

    const expired = Date.now() > exp;

    if (expired) {
        localStorage.removeItem('persist:root');
    }

    return expired;
};