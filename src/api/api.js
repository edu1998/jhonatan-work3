import axios from "axios";
const apiUrl = process.env.REACT_APP_BASE_URL_BACKEND;

const instance = axios.create({
    baseURL: apiUrl,
});

axios.defaults.withCredentials = true;
instance.defaults.withCredentials = false;

export async function initAxiosInterceptors(token, language) {

    await instance.interceptors.request.use(config => {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (language) {
            config.headers.lang = language;
        }

        return config;
    });

    await instance.interceptors.response.use(
        response => response,
        error => {
            if (error.response.status === 401) {
                window.location = "/login";
            } else {
                return Promise.reject(error);
            }
        }
    );
}

export function getErrorMessage(error) {
    console.log(error?.message)
    if (error?.response?.data?.message) {
        return error.response.data.message;
    } else if (error?.message) {
        return error.message;
    } else {
        return 'Ha ocurrido un error'
    }
}

export default instance;