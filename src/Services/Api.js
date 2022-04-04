import axios from 'axios'

const API_GATEWAY = ' http://localhost:8081'

const getKeys = (onSuccess, onError) => axios.get(`${API_GATEWAY}/keys.json`)
    .then(({data}) => onSuccess(data))
    .catch(({response}) => onError(response))

const getStatistics = (query, onSuccess, onError) => axios.get(`${API_GATEWAY}/${query.key}`)
    .then(({data}) => onSuccess(data))
    .catch(({response}) => {
        showAlert(response)
        onError(response)
    })

const showAlert = ({data, status}) => {
    window.alert(`status: ${status}\n${JSON.stringify(data)}`)
}
export default {
    getKeys,
    getStatistics
}