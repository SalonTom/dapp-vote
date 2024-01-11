export default class UserUtils {
    
    static checkUserConnected() {
        console.log(localStorage.getItem("user_address"), window.ethereum._state.accounts);
        if (!(window.ethereum._state.accounts.includes(localStorage.getItem("user_address")))) {
            UserUtils.logout();
        }
    }

    static logout() {
        localStorage.clear();
        window.location.reload();
    }
}