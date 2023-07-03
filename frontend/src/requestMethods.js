
import  axios from 'axios';

const BASE_URL = "http://localhost:5000/api/";


const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ODNkY2NlYmU1OTllZTcyZWJlMjk0OCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY4NjU4MTAzNywiZXhwIjoxNjg2ODQwMjM3fQ._zP34nV2Cy7ectbKTJgppI0Jlpd8DOIMkgZhSqtSR8c";

export const publicRequest = axios.create({
    baseURL: BASE_URL,
});

export const userRequest = axios.create({
    baseURL: BASE_URL,
    header:{token: `Bearer ${TOKEN}`},
});