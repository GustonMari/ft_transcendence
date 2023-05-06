const g_emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

function _check_username(username: string): void {
    const regex = /^[a-zA-Z0-9_-]{3,16}$/;
    if (!regex.test(username) || username.length > 40) {
      throw new Error("invalid username");
    }
}

function _check_email(email: string): void {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      throw new Error("invalid email");
    }
  }

export  function check_password(password: string): void {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/;
    if (password.length < 8 || password.length > 50 || !regex.test(password)) {
      throw new Error("Le mot de passe doit comporter entre 8 et 50 caractères, au moins une lettre minuscule, une lettre majuscule et un chiffre.");
    }
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
        check_password(password);
    } else if (type === 'register') {
        _check_username(username);
        _check_email(email);
        check_password(password);
        if (password !== passwordConfirm) {
            throw new Error('Passwords do not match');
        }
    }
}