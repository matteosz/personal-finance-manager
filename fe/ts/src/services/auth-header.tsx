export default function authHeader() {
    const token = localStorage.getItem('token');
    if (token === null) {
        return {};
    } 

    const user = JSON.parse(token);
    if (user && user.accessToken) {
        return { Authorization: 'Bearer ' + user.accessToken };

    }
    return {};
}