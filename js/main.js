

const axiosInstance = axios.create({
    baseURL: 'https://649044a11e6aa71680caeb2e.mockapi.io/',
    timeout: 10000,
});
  
const axiosInstanceStudent = axios.create({
  baseURL: `https://649044a11e6aa71680caeb2e.mockapi.io/teacher/`,
  timeout: 10000,
})