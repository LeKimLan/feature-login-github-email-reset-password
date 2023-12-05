import axios from 'axios'
import utils from '@utils'
export default {
    register: async function(user) {
        return await axios.post(`${import.meta.env.VITE_SERVER_HOST}/users`, user)
    },
    findByEmailOrUserName: async function(loginId) {
        if(utils.validate.isEmail(loginId)) {
            return await axios.get(`${import.meta.env.VITE_SERVER_HOST}/users?email=${loginId}`)
        }else {
            return await axios.get(`${import.meta.env.VITE_SERVER_HOST}/users?userName=${loginId}`)
        }
    },
    update: async function(userId, data) {
        return await axios.patch(`${import.meta.env.VITE_SERVER_HOST}/users/${userId}`, data)
    },
}