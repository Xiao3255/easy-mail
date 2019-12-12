import axios from 'axios';

const http = axios.create({
    baseURL: 'http://easymail.ngrok.ibanzhuan.cn/'
})

export default http