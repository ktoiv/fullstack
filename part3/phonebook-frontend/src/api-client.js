import axios from 'axios'


const baseUrl = '/api/persons/'

const getAll = () => {
    return axios.get(baseUrl)
        .then(response => response.data)
}

const createPerson = person => {
    return axios.post(baseUrl, person)
        .then(resp => resp.data)
}

const updatePerson = person => {
    return axios.put(baseUrl + person.id, person)
        .then(resp => resp.data)
}

const deletePerson = id => {
    return axios.delete(baseUrl + id)
        .then(resp => resp.data)
}


export {getAll, createPerson, updatePerson, deletePerson}