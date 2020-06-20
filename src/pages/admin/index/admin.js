import React from 'react'
import {Link, Route, Switch} from "react-router-dom";
import {message, Layout, Menu, Dropdown} from "antd"
import {
    UserOutlined,
    DownOutlined,
    MedicineBoxOutlined
} from '@ant-design/icons';

import './admin.less'
import AdminList from "../adminlist/adminList"
import UserList from "../userlist/userList"
import DoctorList from "../doctorlist/doctorList"
import UserLog from "../userlog/uerLog"

const {Header, Content, Footer, Sider} = Layout;


export default class Admin extends React.Component {

    state = {
        collapsed: false,
        userinfo: ''
    };

    componentDidMount() {
        let content = JSON.parse(localStorage.getItem('userInfo'))
        if (!content) {
            message.warning('请先登录')
            this.props.history.push('/login')
        } else if (content.identity===2){
            message.warning('当前账号无权限访问该页面，请切换账号后重试')
            this.props.history.push('/login')
        }else {
            this.setState({
                userinfo: content.userinfo
            })
        }
    }

    onCollapse = collapsed => {
        this.setState({collapsed});
    };

    render() {
        const {userinfo} = this.state
        return (
            <Layout style={{minHeight: '100vh'}}>
                <Sider  collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <div className="myLogo">
                        {!this.state.collapsed ?
                            <h1 style={{paddingLeft: 40, fontSize: 20, color: "white"}}>pet Hospital</h1>
                            : null
                        }
                    </div>
                    <Menu theme="dark" defaultSelectedKeys={['6']} mode="inline">
                        <Menu.Item key="6" icon={<UserOutlined/>}>
                            <Link to={'/admin/adminlist'}>管理员列表</Link>
                        </Menu.Item>
                        <Menu.Item key="8" icon={<UserOutlined/>}>
                            <Link to={'/admin/userlist'}>员工列表</Link>
                        </Menu.Item>
                        <Menu.Item key="9" icon={<MedicineBoxOutlined />}>
                            <Link to={'/admin/doctorlist'}>医生列表</Link>
                        </Menu.Item>
                    </Menu>

                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{paddingLeft: 20}}>
                        <span style={{fontSize: 22}}>宠物医院管理后台</span>
                        <span style={{float: "right"}}> 欢迎您，
                            <Dropdown overlay={
                                <Menu>
                                    <Menu.Item danger onClick={() => {
                                        localStorage.removeItem('userInfo');
                                        this.props.history.push('/login')
                                    }}>退出登录</Menu.Item>
                                </Menu>}>
                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                {userinfo.name}<DownOutlined/>
                            </a>
                        </Dropdown>
                        </span>

                    </Header>
                    <Content style={{margin: '0 16px'}}>


                        <Switch>
                            <Route path={'/admin/adminlist'} component={AdminList}/>
                            <Route path={'/admin/userlist'} component={UserList}/>
                            <Route path={'/admin/userlog'} component={UserLog}/>
                            <Route path={'/admin/doctorlist'} component={DoctorList}/>
                            <Route component={AdminList}/>
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>Pet Hospital ©2020 Created by Zhao Sheng</Footer>
                </Layout>
            </Layout>
        )
    }
}