import React from 'react'
import {connect} from 'react-redux'
import {Form, Input, Button, Card, Radio, message} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {reqAdminLogin,reqUserLogin} from "../../api";


class Login extends React.Component {
    state = {
        identity: 1
    };
    onFinish = (e) => {
        if (e.identity === 1){
            reqAdminLogin({
                username: e.username,
                password: e.password
            }).then(r => {
                if (r.data.success === 1){
                    message.success('登录成功')
                    let userInfo = {
                        identity: e.identity,
                        userinfo: r.data.data[0]
                    }
                    localStorage.setItem('userInfo',JSON.stringify(userInfo))
                    this.props.history.push('/admin')
                } else {
                    message.error('账号或密码错误！')
                }
            });
        } else {
            reqUserLogin({email:e.username,password:e.password}).then(res =>{
                console.log(res.data)
                if (res.data.success===1){
                    message.success('登录成功')
                    let userInfo = {
                        identity: e.identity,
                        name: res.data.name,
                        id:res.data.id,
                        token:res.data.token
                    }
                    localStorage.setItem('userInfo',JSON.stringify(userInfo))
                    this.props.history.push('/users')
                }else if (res.data.success===2){
                    message.warning('用户不存在')
                }else if (res.data.success===0){
                    message.error('密码错误')
                }else {
                    message.error('未知错误')
                }
            })
        }

    };


    render() {
        return (
            <div style={{
                backgroundSize: 'cover',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: window.innerHeight,
                backgroundImage: "url(" + require("./loginbg2.jpg") + ")",
            }}
            >
                <Card
                    title='账号登陆'
                    style={{
                        width: 380,
                    }}>
                    <Form
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{required: true, message: '请输入您的用户名！'}]}
                        >
                            <Input prefix={<UserOutlined/>} placeholder="Username"/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{required: true, message: '请输入您的密码！'}]}
                        >
                            <Input
                                prefix={<LockOutlined/>}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item
                            name="identity"
                            rules={[{required: true, message: ' 请选择您的身份！'}]}
                        >
                            <Radio.Group value={this.state.identity}>
                                <Radio value={1}>我是管理员</Radio>
                                <Radio value={2}>我是员工</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                登 录
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {}
)(Login)