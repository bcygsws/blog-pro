/**
 * @name:token操作
 * @description:将获取的token存储到localStorage本地存储中
 *
 * */



// 1.存储token
function setToken(token: string) {
    window.localStorage.setItem('MY_TOKEN', token);
}
// 2.获取token

function getToken() {
    return window.localStorage.getItem('MY_TOKEN');
}


// 3.根据存储键，清除localStorage中存储内容
function clear(key: string) {
    window.localStorage.removeItem(key);
}

export {
    getToken,
    setToken,
    clear
}