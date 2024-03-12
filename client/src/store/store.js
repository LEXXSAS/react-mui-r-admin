import { runInAction, makeAutoObservable } from "mobx";
import AuthService from "../services/AuthService";
import axios from 'axios';
import $apirefresh from "../interceptor";
import { API_URL } from "../http";

export default class Store {
  constructor() {
    makeAutoObservable(this);
  }

  user = {};
  usersData = [];
  usersDataTwo = [];
  systemData = [];
  usersDatafor = [];
  state = "pending";
  isLoad = false;
  noadmin = false;
  errors = {};
  isAuth = false;
  isLoading = false;
  isError = false;
  isCount = 0;
  alertError = false;
  newAlertError = {};
  noAuthError = false;
  udata = {};
  updata = {};
  udelete = {};
  query = '';
  querytwo = '';
  currentPage = 1;
  currentPagetwo = 1;
  pageQty = 5;
  pageQtyTwo = 5;
  totalPage = Number(0);
  totalPageTwo = Number(0);
  allDocs = 0;
  allDocstwo = 0;
  allSearchDocs = 0;
  allSearchDocsTwo = 0;
  searchLoading = false;
  allsearchdocsno = true;
  allsearchdocsnotwo = true;
  total = '';
  used = '';
  available = '';
  
  setQuery(q) {
    this.query = q;
  }
  setQuerytwo(q) {
    this.querytwo = q;
  }
  setTotal(q) {
    this.total = q;
  }
  setUsed(q) {
    this.used = q;
  }
  setAvailable(q) {
    this.available = q;
  }
  setCurrentPage(cPage) {
    this.currentPage = cPage;
  }
  setCurrentPageTwo(cPage) {
    this.currentPagetwo = cPage;
  }
  setPageQty(pq) {
    this.pageQty = pq;
  }
  setTotalPage(tp) {
    this.totalPage = tp;
  }
  setTotalPagetwo(tp) {
    this.totalPageTwo = tp;
  }
  setAllDocs(alld) {
    this.allDocs = alld;
  }
  setAllDocstwo(alld) {
    this.allDocstwo = alld;
  }
  setAllSearchDocs(sdocs) {
    this.allSearchDocs = sdocs;
  }
  setAllSearchDocstwo(sdocs) {
    this.allSearchDocsTwo = sdocs;
  }

  setUdata(ud) {
    this.udata = ud;
  }

  setUpdata(upd) {
    this.updata = upd;
  }

  setUDelete(udel) {
    this.udelete = udel;
  }

  setAuth(bool) {
    this.isAuth = bool;
  }

  setLoading(bool) {
    this.isLoading = bool;
  }

  setLoad(bool) {
    this.isLoad = bool;
  }

  setUser(user) {
    this.user = user;
  }

  settertUsers(data) {
    this.usersData = data;
  }

  settertUserstwo(data) {
    this.usersDataTwo = data;
  }

  settertSystemInfo(sys) {
    this.systemData = sys;
  }

  settertUsersforadmin(data) {
    this.usersDatafor = data;
  }

  setIsError(bool) {
    this.isError = bool;
  }

  setErrors(e) {
    this.errors = e;
  }

  setNoAuthError(bool) {
    this.noAuthError = bool;
  }

  setCount(c) {
    this.isCount = c;
  }

  setAlert(bool) {
    this.alertError = bool;
  }

  setNewAlertError(nae) {
    this.newAlertError = nae;
  }

  setSearchLoading(bool) {
    this.searchLoading = bool;
  }

  setAllSearchDocsNo(bool) {
    this.allsearchdocsno = bool;
  }
  setAllSearchDocsNotwo(bool) {
    this.allsearchdocsnotwo = bool;
  }

  setNoAdmin(bool) {
    this.noadmin = bool;
  }

  async login(username, password) {
    this.user = {};
    this.isAuth = false;
    try {
      const response = await AuthService.login(username, password);
      runInAction(() => {
        localStorage.setItem('token', response.data.accessToken);
        this.isAuth = true;
        this.user = response.data.user;
      })
    } catch (e) {
      alert(e.response.data)
      console.log(e.response.data);
    }
  }

  async registration(username, password) {
    try {
      const response = await AuthService.registration(username, password);
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e) {
      alert(e.response.data)
      console.log((e).response?.data?.message);
    }
  }

  async logout() {
    try {
      const response = await AuthService.logout();
      console.log('logout ', response.data)
      localStorage.removeItem('token');
      this.setAuth(false);
      this.setUser({});
    } catch (e) {
      console.log((e).response?.data?.message);
    }
  }

  async createRandomUsers() {
    try {
      const response = await $apirefresh.post(`${API_URL}/createmanyusers`, {withCredentials: true})
      console.log('пользователи добавлены', response.data)
    } catch (e) {
      console.log((e).response?.data?.message);
      alert((e).response?.data?.message)
    }
  }

  // for get result from vps ubuntu
  async getServerDiscInfo() {
    this.setLoading(true);
    try {
      const response = await $apirefresh.get(`${API_URL}/getsysteminfo`, {withCredentials: true})
      runInAction(() => {
        this.systemData = response.data;
        if (response.data.length > 0) {
          for (let i = 0; i < response.data.length; i++) {
            if ((response.data[i]._blocks /1024 /1024).toFixed(0) > 0 && response.data[i]._filesystem === '/dev/vda1') {
                let a = 'доступно: ' + (response.data[i]._available /1024 /1024).toFixed(0) + "gb";
                let t = 'всего: ' + (response.data[i]._blocks /1024 /1024).toFixed(0) + "gb";
                let u = 'использовано: ' + (response.data[i]._used /1024 /1024).toFixed(0) + "gb";
                this.setAvailable(a)
                this.setTotal(t)
                this.setUsed(u)
            }
          }
        }
        console.log('данные о сервере', response.data)
      })
    } catch (e) {
      console.log((e).response?.data?.message);
    } finally {
      this.setLoading(false);
    }
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      const response = await $apirefresh.get(`${API_URL}/refresh`, {withCredentials: true})
      console.log('refresh ok')
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setNoAuthError(false)
      this.setUser(response.data.user);
      console.log('store.noAuthError checkAuth ', this.noAuthError)
    } catch (e) {
      console.log((e).response?.data?.message);
      this.setNoAuthError(true)
    } finally {
      this.setLoading(false);
    }
  }

  async getUserCount() {
    try {
      const responseCount = await axios.get(`${API_URL}/getcount`, {withCredentials: true})
      console.log(responseCount.data.count)
      this.setCount(responseCount.data.count)
      console.log('get count ok')
    } catch (e) {
      console.log((e).responseCount?.data?.message);
    } 
  }
}
