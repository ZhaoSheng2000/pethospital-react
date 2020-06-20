import axios from 'axios'
//admin登录
export const reqAdminLogin = ({username, password}) => axios.post('/api/admin/login', {username, password})
//getadmin
export const reqAdminList = () => axios.get('/api/admin/getadmin')
//addadmin
export const reqAddAdmin = ({name, username, password}) => axios.post('/api/admin/addadmin', {name, username, password})
//getusers
export const reqGetUsers = () => axios.get('/api/admin/getusers')
//get the user
export const reqTheUer = ({id}) => axios.post('/api/admin/theuser', {id})
//adduser
export const reqAddUser = ({name, email, password}) => axios.post('/api/admin/adduser', {name, email, password})
//deluser
export const reqDelUser = ({id}) => axios.post('/api/admin/deluser', {id})
//getdoctor
export const reqGetDoctors = () => axios.get('/api/users/doctors')
//deldoctor
export const reqDelDoctor = ({id}) => axios.post('/api/admin/deldoctor', {id})
//adddoctor
export const reqAddDoctor = ({name, age, email, label}) => axios.post('/api/admin/adddoctor', {name, age, email, label})
//updoctor
export const reqUpDoctor = ({id, name, age, label}) => axios.post('/api/admin/updoctor', {id, name, age, label})

//user
//login
export const reqUserLogin = ({email, password}) => axios.post('/api/users/login', {email, password})
//getcustomer
export const reqCustomers = () => axios.get('/api/users/getowners')
//addcustoer
export const reqAddCustomer = ({name,gender,phone}) =>axios.post('/api/users/addowner',{name,gender,phone})
//upcustomer
export const reqUpCustomer = ({id,name,gender,phone}) =>axios.post('/api/users/upowner',{id,name,gender,phone})
//delcustomer
export const reqDelCustomer = ({id}) =>axios.post('/api/users/delowner',{id})
//getpets
export const reqGetPets = () =>axios.get('/api/users/getpets')
//delpets
export const reqDelPets = ({id}) =>axios.post('/api/users/delpet',{id})
//addpet
export const reqAddPet = ({name,gender,type,birth}) =>axios.post('/api/users/addpet',{name,gender,type,birth})
//uppet
export const reqUpPet = ({id,name,gender,type,birth}) =>axios.post('/api/users/uppet',{id,name,gender,type,birth})
//theowners
export const reqTheOwner = ({id}) =>axios.post('/api/users/theowner',{id})
//ownerspets
export const reqOwnersPets = ({id}) =>axios.post('/api/users/ownerspets',{id})
//petwithowner
export const reqPetWithOwner = ({userid,petid}) =>axios.post('/api/users/petwithowner',{userid,petid})
//getthepet
export const reqThePet = ({id}) =>axios.post('/api/users/getthepet',{id})
//petvisit
export const reqPetvisit = ({id,remark}) =>axios.post('/api/users/addvisit',{id,remark})
