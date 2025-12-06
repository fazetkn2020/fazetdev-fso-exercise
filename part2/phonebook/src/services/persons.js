import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  return axios.get(baseUrl).then(r => r.data)
}

const create = newObject => {
  return axios.post(baseUrl, newObject).then(r => r.data)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject).then(r => r.data)
}

export default { getAll, create, update }
