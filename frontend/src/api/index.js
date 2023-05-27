import axios from 'axios'
export const loginUser = (username, password) => axios.post('/api/users/login', { username, password })
export const signupUser = (username, password, email, firstname, middlename, lastname, birthday, gender, civilstatus, address, aboutme, photo) => axios.post('/api/users')
export const isUserExists = (username) => axios.get(`/api/users?query=exists&username=${username}`)
export const isEmailExists = (email) => axios.get(`/api/users?query=exists&email=${email}`)
export const getUser = (username) => axios.get(`/api/users?query=profile&username=${username}`)
export const updateUser = (userid, { firstname, middlename, lastname, birthday, address, photo }) => axios.put(`/api/users/${userid}`, { firstname, middlename, lastname, birthday, address, photo })
export const updateUserPassword = (userid, newpassword) => axios.put(`/api/users/${userid}/newpassword`, { newpassword })
export const verifyUserPassword = (userid, password) => axios.post(`/api/users/${userid}/verifypassword`, { password })
export const getChatData = (from_userid, to_username) => axios.get(`/api/chat?query=chatdata&from=${from_userid}&to=${to_username}`)
export const sendChatMessage = (from_userid, to_username, message, type='text') => axios.post(`/api/chat`, { from_userid, to_username, message, type })
export const uploadImage = (userid, file, what="profile", { onUploadProgress, onUploadComplete }) => {
    const data = new FormData();
    data.append('userid', userid);
    data.append('file', file);
    data.append('what', what)

    return axios.post('/api/uploadphoto', data, {
        headers: {
            ['accept']: 'application/json',
            ['Accept-Language']: 'en-US,en;q=0.8',
            ['Content-Type']: `multipart/form-data; boundary=${data._boundary}`,
        },
        onUploadProgress,
        onUploadComplete
    })
}