import axios from 'axios'

export const loginUser = (username, password) => axios.post('/api/users/login', { username, password })

export const signupUser = (username, password, email, firstname, middlename, lastname, birthday, gender, civilstatus, address, aboutme, photo) => axios.post('/api/users', { username, password, firstname, middlename, lastname, birthday, gender, civilstatus, address, aboutme, photo })

export const isUserExists = (username) => axios.get(`/api/users?query=exists&username=${username}`)

export const getUsersBySearch = (search) => axios.get(`/api/users?query=search&search=${search}`)

export const getUserByUsername = (username) => axios.get(`/api/users?query=profile&username=${username}`)

export const updateUser = (userid, { firstname, middlename, lastname, birthday, gender, civilstatus, address, aboutme, photo }) => axios.put(`/api/users/${userid}`, { firstname, middlename, lastname, birthday, gender, civilstatus, address, aboutme, photo })

export const updateUserPassword = (userid, newpassword) => axios.put(`/api/users/${userid}/newpassword`, { newpassword })

export const verifyUserPassword = (userid, oldpassword, newpassword) => axios.post(`/api/users/${userid}/verifypassword`, { oldpassword, newpassword })

export const getChatData = (from_userid, to_username) => axios.get(`/api/chat?query=chatdata&from=${from_userid}&to=${to_username}`)

export const sendChatMessage = (from_userid, to_username, message, type='text') => axios.post(`/api/chat`, { from_userid, to_username, message, type })

export const uploadImage = ({ formData, userid, file, forProfile=false, onUploadProgress, onUploadComplete }) => {
    const data = formData ? formData : new FormData();
    if (!formData) {
        data.append('userid', userid);
        data.append('file', file);
        data.append('forProfile', forProfile)
    }

    return axios.post('/api/uploadphoto', data, {
        headers: {
            accept: 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        },
        onUploadProgress,
        onUploadComplete
    })
}