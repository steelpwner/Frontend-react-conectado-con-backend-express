import axiosInstance from 'axios';

const instance = axiosInstance.create({
    baseURL: 'http://localhost:5000'
});

export default instance;