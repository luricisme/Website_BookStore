import axios from 'axios';

// Tạo instance Axios
const axiosInstance = axios.create({
    baseURL: 'https://localhost:8888',
    timeout: 10000, // Thời gian timeout của các yêu cầu
});

// Request Interceptor: Thêm accessToken vào header mỗi lần gửi yêu cầu
axiosInstance.interceptors.request.use((config) => {
    // Lấy accessToken từ localStorage (hoặc sessionStorage)
    const accessToken = localStorage.getItem('accessToken');
    console.log('accessToken: ', accessToken);
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        console.log('Adding Authorization Header:', config.headers);
    }
    config.withCredentials = true;
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Thêm Interceptor cho response (xử lý lỗi)
axiosInstance.interceptors.response.use((response) => {
    // Thành công thì trả về respond
    return response;
}, async (error) => {
    
    if (error.config.url === '/refresh') {
        console.error('Refresh token request failed.');
        return Promise.reject(error); // Trả lỗi cho catch của get/refresh đầu để xử lý chứ không chạy xuống bị lặp
    }

    // Kiểm tra nếu lỗi là do access token hết hạn (mã lỗi 403)
    if (error.response && error.response.status === 403) {
        console.log('Access token expired, refreshing token...');
        try {
            // Gọi API refresh token
            const refreshResponse = await axiosInstance.get('/refresh', { withCredentials: true });

            const { accessToken } = refreshResponse.data;

            console.log('đã lấy token mới');
            // Lưu lại accessToken mới vào localStorage
            localStorage.setItem('accessToken', accessToken);

            // Retry request ban đầu với accessToken mới
            error.config.headers['Authorization'] = `Bearer ${accessToken}`;
            return axiosInstance(error.config); // Gửi lại request ban đầu
        } catch (refreshError) {
            console.error('Error refreshing access token', refreshError);
            // Nếu refresh token cũng hết hạn hoặc gặp lỗi, yêu cầu người dùng đăng nhập lại
            localStorage.removeItem('accessToken');
            return Promise.reject(refreshError);
        }
    }
    // Nếu không phải lỗi 403, trả về lỗi ban đầu
    return Promise.reject(error);
});

export default axiosInstance;