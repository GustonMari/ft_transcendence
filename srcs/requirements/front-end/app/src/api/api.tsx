import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:3000/api/',
    
    // BUG Why is this not working if the value is true ?
    withCredentials: false,
});