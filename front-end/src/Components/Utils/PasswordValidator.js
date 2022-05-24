export const passwordValidator = (pw, pw2) => {
    // console.log(pw);
    // console.log(pw2);
    if (!pw && pw2) {
        return "*Password cannot be empty";
    } else if (!pw2 && pw) {
        return "*Confirm password cannot be empty";
    } else if (pw && pw2) {
        if (pw != pw2) {
            return "*Passwords does not match";
        } else if (pw.length < 6) {
            return "*Password must be longer than 6 characters";
        }
    } 

    return "";
}