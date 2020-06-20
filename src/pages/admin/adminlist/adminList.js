import React from 'react'
import { Col, Row, Card, Avatar, Button, Drawer, Form, Input, message} from "antd"
import { PlusOutlined} from '@ant-design/icons';

import moment from "moment"
import {reqAdminList,reqAddAdmin} from "../../../api"

const {Meta} = Card;

export default class AdminList extends React.Component {

    state = {
        adminlist: [],
        visible:false,
        name:'',
        username:'',
        password:''
    };

    componentDidMount() {
        reqAdminList().then(res => {
            console.log(res.data)
            this.setState({
                adminlist: res.data.data
            })
        })
    }

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };
    nameChange = ({target: {value}}) => {
        this.setState({name: value});
    };
    usernameChange = ({target: {value}}) => {
        this.setState({username: value});
    };
    pwdChange = ({target: {value}}) => {
        this.setState({password: value});
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    onSubmit = () =>{
        const {name,username,password} = this.state
        if (!name){
            message.warning('昵称不能为空')
        }else if (! username){
            message.warning('账号不能为空')
        }else if (! password){
            message.warning('密码不能为空')
        }else {
            reqAddAdmin({name,username,password}).then(res =>{
                if (res.data.success===1){
                    message.success('添加成功')
                    this.setState({
                        visible: false,
                    });
                    reqAdminList().then(res => {
                        this.setState({
                            adminlist: res.data.data
                        })
                    })
                }else if (res.data.success===0){
                    message.warning('账号已被注册')
                }else {
                    message.error('未知错误')
                }
            })
        }
    }

    render() {
        const {adminlist,name,username,password} = this.state
        return (
            <div>
                <div style={{margin: '26px 26px 0px 26px'}}>
                    <Button type="primary" shape="round" icon={<PlusOutlined />} size={32} onClick={this.showDrawer}>
                        添加管理员
                    </Button>
                </div>
                <div
                    style={{padding: 24, minHeight: window.innerHeight - 180}}>
                    <Row gutter={[24, 16]}>
                        {
                            adminlist.map((name, index) => {
                                return (
                                    <Col span={6} key={index}>
                                        <Card>
                                            <Meta
                                                avatar={<Avatar style={{backgroundColor:"#1fa67c"}} size={40}>{name.name.slice(0,1)}</Avatar>}
                                                title={`${name.name}`}
                                                description={<span>注册时间:<br/>{moment(name.date).format('YYYY-MM-DD')}</span>}
                                            />
                                        </Card>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </div>
                <Drawer
                    title="添加新账户"
                    width={360}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    bodyStyle={{ paddingBottom: 80 }}
                    footer={
                        <div
                            style={{
                                textAlign: 'right',
                            }}
                        >
                            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                                Cancel
                            </Button>
                            <Button onClick={this.onSubmit}  type="primary">
                                Submit
                            </Button>
                        </div>
                    }
                >
                    <Form layout="vertical" hideRequiredMark>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="name"
                                    label="昵称"
                                    rules={[{ required: true, message: '请输入昵称' }]}
                                >
                                    <Input placeholder="请输入昵称"  value={name} onChange={this.nameChange}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="username"
                                    label="账号"
                                    rules={[{ required: true, message: '请输入账号' }]}
                                >
                                    <Input placeholder="请输入账号" value={username} onChange={this.usernameChange}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="password"
                                    label="密码"
                                    rules={[{  required: true, message: '请输入密码' }]}
                                >
                                    <Input.Password value={password} placeholder="请输入密码" onChange={this.pwdChange} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Drawer>
            </div>
        )
    }
}