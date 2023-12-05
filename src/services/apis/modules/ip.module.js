import axios from "axios"
export default {
    getMyIp: async () => {
        return await axios.get(`${import.meta.env.VITE_SERVIER_IP_HOST}`)
    }
}