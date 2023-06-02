import axios from 'axios'

export const loginUser = (username, password) => axios.post('/api/users/login', { username, password })

export const signupUser = (username, password, firstname, middlename, lastname, birthday, gender, civilstatus, address, aboutme, photo) => axios.post('/api/users', { username, password, firstname, middlename, lastname, birthday, gender, civilstatus, address, aboutme, photo })

export const isUserExists = (username) => axios.get(`/api/users?query=exists&username=${username}`)

export const getUsersBySearch = (search) => axios.get(`/api/users?query=search&search=${search}`)

export const getUserByUsername = (username) => axios.get(`/api/users?query=profile&username=${username}`)

export const updateUser = (userid, { firstname, middlename, lastname, birthday, gender, civilstatus, address, aboutme, photo }) => axios.put(`/api/users/${userid}`, { firstname, middlename, lastname, birthday, gender, civilstatus, address, aboutme, photo })

export const updateUserPassword = (userid, newpassword) => axios.put(`/api/users/${userid}/newpassword`, { newpassword })

export const verifyUserPassword = (userid, oldpassword, newpassword) => axios.post(`/api/users/${userid}/verifypassword`, { oldpassword, newpassword })

export const getChatConversation = (chatid, userid) => axios.get(`/api/chat?query=conversation&chatid=${chatid}&from_user=${userid}`)

export const getChatSearchData = (userid, to_user_search) => axios.get(`/api/chat?query=search&from_user=${userid}&to_user=${to_user_search}`)

export const getChatData = (userid) => axios.get(`/api/chat?query=chatids&from_user=${userid}`)

export const sendChatMessage = (from_userid, to_username, message) => axios.post(`/api/chat`, { from_userid, to_username, message })

export const sendChatPhoto = (from_userid, to_username, photos=[]) => axios.post(`/api/chat`, { from_userid, to_username, photos })

export const uploadImage = ({ formData, userid, file, filename, forProfile=false, onUploadProgress }) => {
    const data = formData ? formData : new FormData()
    if (!formData) {
        if (userid) { 
            data.append('userid', userid)
        }
        data.append('photo', file, filename)
        data.append('forProfile', !!forProfile)
    } else {
        data.delete('forProfile')
        data.append('forProfile', !!forProfile)
    }

    return axios.post(process.env.NODE_ENV === 'development' ? `http://${window.location.hostname}:3080/api/uploadphoto` : '/api/uploadphoto', data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress
    })
}