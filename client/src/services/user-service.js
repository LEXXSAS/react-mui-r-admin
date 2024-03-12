import $api from "../http";

export default class UserService {
  static fetchUsers(query, currentPage, pageQty) {
    return $api.get(`/searchqueryall?query=${query}&p=${currentPage - 1}&perpage=${pageQty}`)
  }
  static fetchUserstwo(query, currentPage, pageQty) {
    return $api.get(`/searchqueryalltwo?query=${query}&p=${currentPage - 1}&perpage=${pageQty}`)
  }
  static fetchSystemData() {
    return $api.get(`/getsysteminfo`)
  }
  static fetchUsersforadmin(query, currentPage, pageQty) {
    return $api.get(`/getallusersfor?query=${query}&p=${currentPage - 1}&perpage=${pageQty}`)
  }
  static createUser(name, email, age, desc) {
    return $api.post('/createuser', {name, email, age, desc})
  }
  static fetchSingleUser(id) {
    return $api.get('/getuser/'+id)
  }
  static fetchSingleUsertwo(id) {
    return $api.get('/getusertwo/'+id)
  }
  static updateSingleUser(id, name, email, age, desc) {
    return $api.put('/updateuser/'+id, {name, email, age, desc})
  }
  static deleteSingleUser(id) {
    return $api.delete('/deleteuser/'+id)
  }
  static deleteSingleUserfromusers(id) {
    return $api.delete('/deleteuserfrom/'+id)
  }
}
