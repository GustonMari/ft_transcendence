const g_emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

function _check_username (username: string): true {
    if (username.length < 3) {
        throw new Error("Username must be at least 3 characters long");
    }
    if (username.length > 20) {
        throw new Error("Username must be at most 20 characters long");
    }
    if (!g_emailRegex.test(username)) {
        throw new Error('Please enter a valid email address.');
    }
    return true;
}

function _check_email (email: string): void {
    if (!g_emailRegex.test(email)) {
        throw new Error('Please enter a valid email address.');
    }
}

function _check_password (password: string): void {
}

export function check_form({
    username,
    email,
    password,
    passwordConfirm,
    type,
} : {
    username: string,
    email: string,
    password: string,
    passwordConfirm: string | undefined,
    type: string,
}): void {
    if (type === 'login') {
        _check_username(username);
        _check_password(password);
    } else if (type === 'register') {
        _check_username(username);
        _check_email(email);
        _check_password(password);
        if (password !== passwordConfirm) {
            throw new Error('Passwords do not match');
        }
    }
}