const nodeDiskInfo = require('node-disk-info');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const tokenModel = require('../models/token-model.js');
const {validationResult} = require('express-validator');
const Role = require('../models/Role.js');
const User = require('../models/User.js');
const Alldata = require('../models/alldata-model.js');
const Alldatatwo = require('../models/alldatatwo-model.js');
const Usersforadmin = require('../models/usersforadmin-model.js');
const AlldataWithTime = require('../models/alldata-model-timestamp.js');
const counterModel = require('../models/counter-model.js');
const { faker } = require('@faker-js/faker')

class UserDto {
  username;
  id;
  roles;
  constructor(model) {
    this.username = model.username;
    this.id = model._id;
    this.roles = model.roles;
  }
}

  //функции генерации токенов
  // accessToken
  const generateAccessToken = (user) => {
    return jwt.sign({id: user.id, roles: user.roles},
      process.env.JWT_ACCESS_SECRET,
      {expiresIn: "15m"});
  }
  // refreshToken
  const generateRefreshToken = (user) => {
    return jwt.sign({id: user.id, roles: user.roles},
    process.env.JWT_REFRESH_SECRET,
    {expiresIn: "30d"});
  }
 
  // запись токенов в переменные refreshToken и accessToken
  const generateTokens = async(payload) => {
    const refreshToken = generateRefreshToken(payload);
    const accessToken = generateAccessToken(payload);

    return {accessToken, refreshToken}
  }

  // удаление токена
  const removeToken = async(refreshToken) => {
    const tokenData = await tokenModel.deleteOne({refreshToken})
    return tokenData;
  }

  const validateRefreshToken = (token) => {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }

  const userLogin = async(username, password) => {
    const user = await User.findOne({username})
    if (!user) {
      throw new Error('Пользователь с таким именем не найден')
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if(!isPassEquals) {
      throw new Error('Неверный пароль');
    }
    const userDto = new UserDto(user);
    const tokens = await generateTokens({...userDto});
    const {refreshToken} = tokens;

    const tokenData = await tokenModel.findOne({user: user._id})
    if (tokenData) {
      tokenData.refreshToken = tokens.refreshToken;
      tokenData.save();
      return {...tokens, user: userDto}
      // return tokenData.save();
    }
    await tokenModel.create({user: user._id, refreshToken});
    return {...tokens, user: userDto}
  }

  const userRegistration = async(username, password) => {
    const oldUser = await User.findOne({username})
    if (oldUser) {
      throw new Error(`Пользователь с таким именем уже существует`)
      // throw new Error(`Пользователь с таким именем ${username} уже существует`)
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const userRole = await Role.findOne({value: "TEST"});
    const user = await User.create({username, password: hashPassword, roles: [userRole.value]});

    const userDto = new UserDto(user);
    const tokens = await generateTokens({...userDto});
    const {refreshToken} = tokens;

    const tokenData = await tokenModel.findOne({user: user._id})
    if (tokenData) {
      tokenData.refreshToken = tokens.refreshToken;
      return tokenData.save();
    }
    await tokenModel.create({user: user._id, refreshToken});
    return {...tokens, user: userDto}
  }

  const userRefresh = async(refreshToken) => {
    if (!refreshToken) {
      throw new Error('не авторизован')
    }
    const userData = validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenModel.findOne({refreshToken})
    if (!userData || !tokenFromDb) {
      throw new Error('не авторизован')
    }

    const user = await User.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = await generateTokens({...userDto});

    const tokenData = await tokenModel.findOne({user: user._id})
    if (tokenData) {
      tokenData.refreshToken = tokens.refreshToken;
      // return tokenData.save();
      tokenData.save();
      return {...tokens, user: userDto}
    }
    await tokenModel.create({user: user._id, refreshToken});
    return {...tokens, user: userDto}
  }

  const userCount = async(uData) => {
    const user = await User.findById(uData.id);
    const counterData = await counterModel.findOne({user: user._id});
    if(!counterData || counterData == null) {
      let count = 0;
      const newCounter = await counterModel.create({user: user._id, count});
      return {newCounter}
    }
    return {counterData};
  }

  const getAllUsers = async() => {
    const users = await User.find();
    return users;
  }

  const getAll = async() => {
    const users = await Alldata.find().sort({$natural: -1});
    return users;
  }

  const getAllSystemInfo = async() => {
    const disks = nodeDiskInfo.getDiskInfoSync();
    return disks;
  }

  const getAllPagination = async(req) => {
    const page = req.query.p || 0
    const dataPerPage = req.query.perpage || 5
    // const dataPerPage = req.body.perpage || 5
    const allDocs = await Alldata.countDocuments()
    const totalPages = Math.ceil(allDocs / dataPerPage)
    const paginationalldata = await Alldata
    .find()
    .sort({$natural: -1})
    .skip(Number(page) * dataPerPage)
    .limit(dataPerPage)
    return {paginationalldata, page: page, dataPerPage: dataPerPage, alldocs: allDocs, totalpages: totalPages};
  }

  const getAllSearch = async(req) => {
    const querySearch = req.query.query || ''
    // console.log('querySearch', querySearch)
    const bodySearch = req.query.searchdata || ''
    // let str = `/^.*(?=.*${querySearch}).*$/`
    // console.log('str', str)
    // let strRegex = new RegExp(/^.*(?=.*j).*$/)
    if (querySearch !== '' || bodySearch !== '') {
      const searchalldata = await Alldata
      .find({name: {$regex: new RegExp(querySearch), $options: "i"}})
      .sort({$natural: -1})
      return searchalldata;
    } else {
      const emptyArr = [];
      return emptyArr;
    }
  }

  const getAllSearchPagination = async(req) => {
    const page = req.query.p || 0
    const querySearch = req.query.query || ''
    const dataPerPage = req.query.perpage || 5
    // const dataPerPage = req.body.perpage || 5
    const allDocs = await Alldata.countDocuments()
    if (querySearch !== '') {
      const searchalldata = await Alldata
      .find({name: {$regex: new RegExp(querySearch), $options: "i"}})
      .sort({$natural: -1})
      .skip(Number(page) * dataPerPage)
      .limit(dataPerPage)
      const total = await Alldata.countDocuments({
        name: {$regex: new RegExp(querySearch), $options: "i"}
      })
      const allSearchDocs = searchalldata.length
      const allTotalPage = Math.ceil(total / dataPerPage)
      if (allSearchDocs <= 0) {
        const allSearchDocsNo = false;
        return {paginationalldata: searchalldata, page: page, dataperpage: dataPerPage, totalpages: allTotalPage, query: querySearch, alldocs: allDocs, alltotalpage: allTotalPage, allsearchdocs: allSearchDocs, total: total, allsearchdocsno: allSearchDocsNo};
      } else {
        const allSearchDocsNo = true;
        return {paginationalldata: searchalldata, page: page, dataperpage: dataPerPage, totalpages: allTotalPage, query: querySearch, alldocs: allDocs, alltotalpage: allTotalPage, allsearchdocs: allSearchDocs, total: total, allsearchdocsno: allSearchDocsNo};
      }
    } 
    else if (querySearch === '') {
      const searchalldata = await Alldata
      .find()
      .sort({$natural: -1})
      .skip(Number(page) * dataPerPage)
      .limit(dataPerPage)
      const allSearchDocs = 0;
      const allTotalPage = Math.ceil(allDocs / dataPerPage)
      const allSearchDocsNo = true;
      return {paginationalldata: searchalldata, page: page, dataperpage: dataPerPage, alldocs: allDocs, totalpages: allTotalPage, query: querySearch, allsearchdocs: allSearchDocs, alltotalpage: allTotalPage, allsearchdocsno: allSearchDocsNo};
    } 
    else {
      const emptyArr = [];
      return emptyArr;
    }
  }

  const getAllSearchPaginationtwo = async(req) => {
    const page = req.query.p || 0
    const querySearch = req.query.query || ''
    const dataPerPage = req.query.perpage || 5
    // const dataPerPage = req.body.perpage || 5
    const allDocs = await Alldatatwo.countDocuments()
    if (querySearch !== '') {
      const searchalldata = await Alldatatwo
      .find({name: {$regex: new RegExp(querySearch), $options: "i"}})
      .sort({$natural: -1})
      .skip(Number(page) * dataPerPage)
      .limit(dataPerPage)
      const total = await Alldatatwo.countDocuments({
        name: {$regex: new RegExp(querySearch), $options: "i"}
      })
      const allSearchDocs = searchalldata.length
      const allTotalPage = Math.ceil(total / dataPerPage)
      if (allSearchDocs <= 0) {
        const allSearchDocsNo = false;
        return {paginationalldata: searchalldata, page: page, dataperpage: dataPerPage, totalpages: allTotalPage, query: querySearch, alldocs: allDocs, alltotalpage: allTotalPage, allsearchdocs: allSearchDocs, total: total, allsearchdocsno: allSearchDocsNo};
      } else {
        const allSearchDocsNo = true;
        return {paginationalldata: searchalldata, page: page, dataperpage: dataPerPage, totalpages: allTotalPage, query: querySearch, alldocs: allDocs, alltotalpage: allTotalPage, allsearchdocs: allSearchDocs, total: total, allsearchdocsno: allSearchDocsNo};
      }
    } 
    else if (querySearch === '') {
      const searchalldata = await Alldatatwo
      .find()
      .sort({$natural: -1})
      .skip(Number(page) * dataPerPage)
      .limit(dataPerPage)
      const allSearchDocs = 0;
      const allTotalPage = Math.ceil(allDocs / dataPerPage)
      const allSearchDocsNo = true;
      return {paginationalldata: searchalldata, page: page, dataperpage: dataPerPage, alldocs: allDocs, totalpages: allTotalPage, query: querySearch, allsearchdocs: allSearchDocs, alltotalpage: allTotalPage, allsearchdocsno: allSearchDocsNo};
    } 
    else {
      const emptyArr = [];
      return emptyArr;
    }
  }

  const getAllUsersFor = async(req) => {
    const page = req.query.p || 0
    const querySearch = req.query.query || ''
    const dataPerPage = req.query.perpage || 5
    const allDocs = await Usersforadmin.countDocuments()
    if (querySearch !== '') {
      const searchalldata = await Usersforadmin
      .find({username: {$regex: new RegExp(querySearch), $options: "i"}})
      .sort({$natural: -1})
      .skip(Number(page) * dataPerPage)
      .limit(dataPerPage)
      const total = await Usersforadmin.countDocuments({
        name: {$regex: new RegExp(querySearch), $options: "i"}
      })
      const allSearchDocs = searchalldata.length
      const allTotalPage = Math.ceil(total / dataPerPage)
      if (allSearchDocs <= 0) {
        const allSearchDocsNo = false;
        return {paginationalldata: searchalldata, page: page, dataperpage: dataPerPage, totalpages: allTotalPage, query: querySearch, alldocs: allDocs, alltotalpage: allTotalPage, allsearchdocs: allSearchDocs, total: total, allsearchdocsno: allSearchDocsNo};
      } else {
        const allSearchDocsNo = true;
        return {paginationalldata: searchalldata, page: page, dataperpage: dataPerPage, totalpages: allTotalPage, query: querySearch, alldocs: allDocs, alltotalpage: allTotalPage, allsearchdocs: allSearchDocs, total: total, allsearchdocsno: allSearchDocsNo};
      }
    } 
    else if (querySearch === '') {
      const searchalldata = await Usersforadmin
      .find()
      .sort({$natural: -1})
      .skip(Number(page) * dataPerPage)
      .limit(dataPerPage)
      const allSearchDocs = 0;
      const allTotalPage = Math.ceil(allDocs / dataPerPage)
      const allSearchDocsNo = true;
      return {paginationalldata: searchalldata, page: page, dataperpage: dataPerPage, alldocs: allDocs, totalpages: allTotalPage, query: querySearch, allsearchdocs: allSearchDocs, alltotalpage: allTotalPage, allsearchdocsno: allSearchDocsNo};
    } 
    else {
      const emptyArr = [];
      return emptyArr;
    }
  }

  const createUser = async(user, rbody) => {
    const newSingleUser = await AlldataWithTime.create({
      user: user._id,
      author: user.username,
      name: rbody.name,
      email: rbody.email,
      age: rbody.age,
      desc: rbody.desc});
    return newSingleUser;
  }

  const createRandomUsers = async(user) => {
    function RandomUsers() {
      const firstName = faker.internet.userName();
      const email = faker.internet.email({ firstName });
      const agetest = faker.number.int().toString().substring(0, 2);
      const age = Number(agetest);
      const descdefault = `I'm ${firstName}`;
    
      return {
      user: user._id,
      author: user.username,
      name: firstName,
      email,
      age: age,
      desc: descdefault
      };
    }
    
    const randomusers = faker.helpers.multiple(RandomUsers, {
      count: 4,
    });
    
    const newManyUsers= await AlldataWithTime.create(randomusers);
    return newManyUsers;
  }

  const getUser = async(id) => {
    const singleUser = await Alldata.findById({_id:id});
    return singleUser;
  }

  const getUserTwo = async(id) => {
    const singleUser = await Alldatatwo.findById({_id:id});
    return singleUser;
  }

  const updateUser = async(id, req) => {
    const updateDataUser = await AlldataWithTime.findByIdAndUpdate({_id:id}, {
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      desc: req.body.desc,
    });
    return updateDataUser;
  }

  const deleteUser = async(id) => {
    const deleteDataUser = await Alldata.findByIdAndDelete({_id:id});
    return deleteDataUser;
  }

  const deleteUserfrom = async(id) => {
    const deleteDataUser = await Usersforadmin.findByIdAndDelete({_id:id});
    return deleteDataUser;
  }

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(res.status(400).send('Ошибка при валидации'))
      }
      const {username, password} = req.body;
      try {
        const regData = await userRegistration(username, password);
        res.cookie('refreshToken', regData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json(regData);
      } catch (error) {
        return next(res.status(400).send(error.message))
      }
    } catch (error) {
      next(error);
    }
  }
  
  async login(req, res, next) {
    try {
      const {username, password} = req.body;
      try {
        const ourUser = await userLogin(username, password);
        let dataOnClient = {};
        const {refreshToken, accessToken, user} = ourUser;
        res.cookie('refreshToken', refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json({...dataOnClient, accessToken, user});
      } catch (error) {
        return next(res.status(400).send(error.message))
      }
      // console.log(ourUser.accessToken, ourUser.user.id, ourUser.user.username)
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const refreshData = await userRefresh(refreshToken);
      res.cookie('refreshToken', refreshData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      let dataOnClient = {};
      const {accessToken, user} = refreshData;
      return res.json({...dataOnClient, accessToken, user});
    } catch (error) {
      next(error);
    }
  }

  async getcount(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      // const refreshData = await userRefresh(refreshToken);
      const userData = validateRefreshToken(refreshToken);
      const user = await User.findById(userData.id);
      let dataOnClient = {};
      // const {user} = refreshData;
      const ourCount = await userCount(user);
      const count = ourCount.counterData.count;
      return res.json({...dataOnClient, count});
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const token = await removeToken(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
      // return res.json('рефреш токен удален успешно');
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await getAllUsers();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getOther(req, res, next) {
    try {
      return res.json('other data...')
    } catch (error) {
      next(error);
    }
  }

  async createRoles(req, res) {
    try {
      const userRole = new Role();
      const adminRole = new Role({value: "ADMIN"});
      await userRole.save();
      await adminRole.save();
      res.json('ok')
    } catch (err) {
      console.log(err)
    }
  }

  async getAllData(req, res, next) {
    try {
      const allData = await getAll();
      return res.json(allData);
    } catch (error) {
      next(error);
    }
  }

  async getSystemDataInfo(req, res, next) {
    try {
      const discsinfodata = await getAllSystemInfo();
      return res.json(discsinfodata);
    } catch (error) {
      next(error);
    }
  }

  async getAllPaginationData(req, res, next) {
    try {
      const paginationalldata = await getAllPagination(req);
      return res.json({all: paginationalldata});
    } catch (error) {
      next(error);
    }
  }

  async getAllSearchData(req, res, next) {
    try {
      const searchalldata = await getAllSearch(req);
      if (searchalldata == null || searchalldata == '') {
        return next(res.status(400).send('Ничего не найдено'))
      }
      return res.json(searchalldata);
    } catch (error) {
      next(error);
    }
  }

  async getAllSearchAndPagination(req, res, next) {
    try {
      const searchalldata = await getAllSearchPagination(req);
      if (searchalldata == null || searchalldata == '') {
        return next(res.status(400).send('Ничего не найдено'))
      } 
      return res.json({all: searchalldata});
    } catch (error) {
      next(error);
    }
  }

  async getAllSearchAndPaginationtwo(req, res, next) {
    try {
      const searchalldata = await getAllSearchPaginationtwo(req);
      if (searchalldata == null || searchalldata == '') {
        return next(res.status(400).send('Ничего не найдено'))
      } 
      return res.json({all: searchalldata});
    } catch (error) {
      next(error);
    }
  }

  async getAllUsersForAdmin(req, res, next) {
    try {
      const getallusers = await getAllUsersFor(req);
      if (getallusers == null || getallusers == '') {
        return next(res.status(400).send('Ничего не найдено'))
      } 
      return res.json({all: getallusers});
    } catch (error) {
      next(error);
    }
  }

  async createSingleUser(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const userData = validateRefreshToken(refreshToken);
      const user = await User.findById(userData.id);
      const newUser = await createUser(user, req.body);
      return res.json(newUser);
    } catch (error) {
      next(error)
    }
  }
  
  async createManyUsers(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const userData = validateRefreshToken(refreshToken);
      const user = await User.findById(userData.id);
      const newUsers = await createRandomUsers(user);
      return res.json(newUsers);
    } catch (error) {
      next(error)
    }
  }

  async getSingleUser(req, res, next) {
    try {
      const id = req.params.id;
      const singleUser = await getUser(id)
      return res.json(singleUser)
    } catch (error) {
      next(error)
    }
  }

  async getSingleUserTwo(req, res, next) {
    try {
      const id = req.params.id;
      const singleUser = await getUserTwo(id)
      return res.json(singleUser)
    } catch (error) {
      next(error)
    }
  }

  async updateSingleUser(req, res, next) {
    try {
      const id = req.params.id;
      const {refreshToken} = req.cookies;
      const userData = validateRefreshToken(refreshToken);
      if(userData == null) {
        return next(res.status(400).send('Токен не валиден'))
      }
      const userDataId = await AlldataWithTime.findById({_id: id});
      let hasRole = false;
      userData.roles.forEach((role) => {
        if(role === process.env.ROLE_USER || role === process.env.ROLE_TEST) {
          hasRole = true
        }
      })
      if (hasRole) {
        if (userData.id !== userDataId.user) {
          return next(res.status(403).send('У вас нет прав на обновление данного пользователя'))
        }
      }
      const updateData = await updateUser(id, req)
      return res.json(updateData)
    } catch (error) {
      next(error)
    }
  }


  async deleteSingleUser(req, res, next) {
    try {
      const id = req.params.id;
      const {refreshToken} = req.cookies;
      const userData = validateRefreshToken(refreshToken);
      if(userData == null) {
        return next(res.status(400).send('Токен не валиден'))
      }
      const userDataId= await AlldataWithTime.findById({_id: id});
      let hasRole = false;
      userData.roles.forEach((role) => {
        if(role === process.env.ROLE_USER || role === process.env.ROLE_TEST) {
          hasRole = true
        }
      })
      if (hasRole) {
        if (userData.id !== userDataId.user) {
          return next(res.status(403).send('У вас нет прав на удаление данного пользователя'))
        }
      }
      const deleteData = await deleteUser(id)
      return res.json(deleteData)
    } catch (error) {
      next(error)
    }
  }

  async deleteSingleUserfromusers(req, res, next) {
    try {
      const id = req.params.id;
      const {refreshToken} = req.cookies;
      const userData = validateRefreshToken(refreshToken);
      if(userData == null) {
        return next(res.status(400).send('Токен не валиден'))
      }
      let hasRole = false;
      userData.roles.forEach((role) => {
        if(role === process.env.ROLE_ADMIN) {
          hasRole = true
        }
      })
      if (!hasRole) {
          return next(res.status(403).send('У вас нет прав на удаление данного пользователя'))
      }
      const deleteData = await deleteUserfrom(id)
      return res.json(deleteData)
    } catch (error) {
      next(error)
    }
  }

}

module.exports = new UserController();
