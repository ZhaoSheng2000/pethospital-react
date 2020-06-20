import React from 'react'
import {Link, Route, Switch} from "react-router-dom"

import {Dropdown, Layout, Menu,message} from "antd"
import {
    UserOutlined,
    DownOutlined,
    MedicineBoxOutlined,
    GitlabOutlined
} from '@ant-design/icons';


import DoctorList from "../../user/doctorlist/doctorList"
import CustomerList from "../customerlist/customerList"
import PetList from "../petlist/petList"
import OwnersPets from "../ownerspets/ownersPets"

import './user.less'

const {Header, Content, Footer, Sider} = Layout;


export default class User extends React.Component {

    state = {
        userinfo:''
    };

    componentDidMount() {
        let content = JSON.parse(localStorage.getItem('userInfo'))
        if (!content) {
            message.warning('请先登录')
            this.props.history.push('/login')
        } else {
            this.setState({
                userinfo: content
            })
        }
    }

    render() {
        const {userinfo} = this.state
        return (
            <div>
                <Layout style={{minHeight: '100vh'}}>
                    <Sider  collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                        <div className="myLogo">
                            {!this.state.collapsed ?
                                <h1 style={{paddingLeft: 40, fontSize: 20, color: "white"}}>pet Hospital</h1>
                                : null
                            }
                        </div>
                        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                            <Menu.Item key="1" icon={<MedicineBoxOutlined />}>
                                <Link to={'/users/doctorlist'}>医生列表</Link>
                            </Menu.Item>
                            <Menu.Item key="2" icon={<UserOutlined />}>
                                <Link to={'/users/customerlist'}>客户列表</Link>
                            </Menu.Item>
                            <Menu.Item key="3" icon={<GitlabOutlined />}>
                                <Link to={'/users/petlist'}>宠物列表</Link>
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
                            <a className="ant-dropdown-link" href={'#'}>
                                {userinfo.name}<DownOutlined/>
                            </a>
                        </Dropdown>
                        </span>

                        </Header>
                        <Content style={{margin: '0 16px'}}>
                            <Switch>
                                <Route path={'/users/doctorlist'} component={DoctorList}/>
                                <Route path={'/users/customerlist'} component={CustomerList}/>
                                <Route path={'/users/petlist'} component={PetList}/>
                                <Route path={'/users/ownerspets'} component={OwnersPets}/>
                                <Route component={DoctorList}/>
                            </Switch>
                        </Content>
                        <Footer style={{textAlign: 'center'}}>Pet Hospital ©2020 Created by Zhao Sheng</Footer>
                    </Layout>
                </Layout>
            </div>
        )
    }
}