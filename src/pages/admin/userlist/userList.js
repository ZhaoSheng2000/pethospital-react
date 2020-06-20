import React from 'react'
import {Col, Row, Card, Avatar, Button, Drawer, Form, Input, message, Popconfirm} from "antd"

import {
    PlusOutlined,
} from '@ant-design/icons';

import moment from "moment"
import {reqGetUsers, reqAddUser,reqDelUser} from "../../../api"

const {Meta} = Card;

export default class UserList extends React.Component {

    state = {
        userlist: [],
        visible: false,
        name: '',
        email: '',
        password: ''
    };

    componentDidMount() {
        reqGetUsers().then(res => {
            console.log(res.data)
            this.setState({
                userlist: res.data.data
            })
        })
    }

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };
    onClose = () => {
        this.setState({
            visible: false,
        });
    }
    onSubmit = (e) => {
        console.log(e)
        const {name, email, password} = e
        reqAddUser({name, email, password}).then(res => {
            console.log(res.data)
            if (res.data.success === 1) {
                message.success('添加成功')
                this.setState({
                    visible: false
                });
                reqGetUsers().then(res => {
                    console.log(res.data)
                    this.setState({
                        userlist: res.data.data
                    })
                })
            } else if (res.data.success === 0) {
                message.warning('邮箱已被占用')
            } else {
                message.error('未知错误')
            }
        })

    }
    confirm = (id) => {
        reqDelUser({id}).then(res =>{
            console.log(res.data)
            message.success('删除成功');
            reqGetUsers().then(res => {
                console.log(res.data)
                this.setState({
                    userlist: res.data.data
                })
            })
        })
    }
    onLog=(id)=>{
        console.log(id)
        this.props.history.push({pathname:'/admin/userlog', state:{id}})
    }

    render() {
        const {userlist, name, email, password} = this.state
        return (
            <div>
                <div style={{margin: '26px 26px 0px 26px'}}>
                    <Button type="primary" shape="round" icon={<PlusOutlined/>} size={32} onClick={this.showDrawer}>
                        添加员工
                    </Button>
                </div>
                <div
                    style={{padding: 24, minHeight: window.innerHeight - 180}}>
                    <Row gutter={[24, 16]}>
                        {
                            userlist.map((name, index) => {
                                return (
                                    <Col span={8} key={index}>
                                        <Card hoverable onClick={()=>this.onLog(name._id)}>
                                            <Meta
                                                avatar={<Avatar style={{backgroundColor: "#1fa67c"}}
                                                                size={40}>{name.name.slice(0, 1)}</Avatar>}
                                                title={<span>{name.name}
                                                    <Popconfirm
                                                        title="您确定要删除此员工？"
                                                        onConfirm={() =>this.confirm(name._id)}
                                                        okText="Yes"
                                                        cancelText="No"
                                                    >
                                                        <a href="#" style={{float: "right"}}>Delete</a>
                                                    </Popconfirm>
                                                </span>
                                                }
                                                description={
                                                    <span>
                                                        邮箱:{name.email}<br/>
                                                    注册时间：{moment(name.date).format('YYYY-MM-DD HH:mm')}
                                                    </span>
                                                }
                                            />
                                        </Card>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </div>
                <Drawer
                    title="添加新员工"
                    width={360}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    bodyStyle={{paddingBottom: 80}}
                    footer={
                        <div
                            style={{
                                textAlign: 'right',
                            }}
                        >
                            <Button onClick={this.onClose} style={{marginRight: 8}}>
                                Cancel
                            </Button>
                        </div>
                    }
                >
                    <Form layout="vertical" hideRequiredMark onFinish={this.onSubmit}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="name"
                                    label="昵称"
                                    rules={[{required: true, message: '请输入昵称'}]}
                                >
                                    <Input placeholder="请输入昵称" value={name}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="email"
                                    label="邮箱"
                                    rules={[{type: "email", required: true, message: '请输入正确的邮箱'}]}
                                >
                                    <Input type={"email"} placeholder="请输入邮箱" value={email}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="password"
                                    label="密码"
                                    rules={[{required: true, min: 6, message: '密码至少6位'}]}
                                >
                                    <Input.Password value={password} placeholder="请输入密码"/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block>
                                        确 认
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Drawer>
            </div>
        )
    }
}