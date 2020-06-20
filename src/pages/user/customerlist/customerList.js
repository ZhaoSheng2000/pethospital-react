import React from 'react'

import {
    Avatar,
    Button,
    Card,
    Col,
    Drawer,
    Form,
    Input,
    message,
    Popconfirm,
    Row,
    Modal,
    Tooltip,
    Radio
} from "antd"
import {
    PlusOutlined,
    EditOutlined,
    GitlabOutlined,
    DeleteOutlined
} from '@ant-design/icons';

import {reqCustomers,reqAddCustomer,reqUpCustomer,reqDelCustomer} from "../../../api"
import moment from "moment"
import './customerlist.less'

const {Meta} = Card;

export default class CustomerList extends React.Component {

    state = {
        customerlist: [],
        visible: false,
        mvisible: false,
        changeid: ''
    };

    componentDidMount() {
        reqCustomers().then(res => {
            this.setState({
                customerlist: res.data.data
            })
        })
    }

    confirm = (id) => {
        console.log(id)
        reqDelCustomer({id}).then(res =>{
            message.success('删除成功');
            reqCustomers().then(res => {
                this.setState({
                    customerlist: res.data.data
                })
            })
        })
        // reqDelDoctor({id}).then(res => {
        //     console.log(res.data)
        //     message.success('删除成功');
        //     reqGetDoctors().then(res => {
        //         console.log(res.data)
        //         this.setState({
        //             doctorlist: res.data.data
        //         })
        //     })
        // })
    }
    showDrawer = () => {
        this.setState({
            visible: true
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    }
   onSubmit = (e) => {
       const {name,gender,phone} = e
       reqAddCustomer({name,gender,phone}).then(res =>{
           if (res.data.success===1){
               message.success('添加成功')
               this.setState({
                   visible: false
               });
               reqCustomers().then(res => {
                   console.log(res.data)
                   this.setState({
                       customerlist: res.data.data
                   })
               })
           }else if (res.data.success===0){
               message.warning('手机号已被占用')
           }else {
               message.warning('网络错误')
           }
       })
    }
    onChange = (e) => {
        const {name, gender, phone} = e
        const { changeid} = this.state
        console.log(e,changeid)
        reqUpCustomer({id:changeid,name,gender,phone}).then(res =>{
            if (res.data.success===1){
                message.success('修改信息成功')
                this.setState({
                    mvisible: false
                })
                reqCustomers().then(res => {
                    this.setState({
                        customerlist: res.data.data
                    })
                })
            }else {
                message.error('未知错误')
            }
        })
    }


    showModal = (id) => {
        this.setState({
            mvisible: true,
            changeid: id
        });
    };

    handleCancel = () => {
        this.setState({
            mvisible: false,
        });
    };
    onDetail=(id)=>{
        this.props.history.push({pathname:"/users/ownerspets",state:{id:id}})
    }


    render() {
        const {customerlist, mvisible, confirmLoading} = this.state
        return (
            <div>
                <div style={{margin: '26px 26px 0px 26px'}}>
                    <Button type="primary" shape="round" icon={<PlusOutlined/>} size={32} onClick={this.showDrawer}>
                        添加客户
                    </Button>
                </div>
                <div
                    style={{padding: 24, minHeight: window.innerHeight - 180}}>
                    <Row gutter={[24, 16]}>
                        {
                            customerlist.map((name, index) => {
                                return (
                                    <Col span={8} key={index}>
                                        <Card
                                            actions={[
                                                <Tooltip title={'修改资料'}>
                                                    <EditOutlined key="edit" onClick={() => this.showModal(name._id)}/>
                                                </Tooltip>,
                                                <Tooltip title={'客户宠物'}>
                                                    <GitlabOutlined key="pet" onClick={() => this.onDetail(name._id)}/>
                                                </Tooltip>,
                                                <Popconfirm
                                                    title="您确定要删除该客户？"
                                                    onConfirm={() => this.confirm(name._id)}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <DeleteOutlined key={'del'}/>
                                                </Popconfirm>
                                            ]}
                                        >
                                            <Meta
                                                avatar={<Avatar style={{backgroundColor: "#1fa67c"}}
                                                                size={40}>{name.name.slice(0, 1)}</Avatar>}
                                                title={<span>{name.name}
                                                </span>
                                                }
                                                description={
                                                    <span>
                                                        性别：{name.gender === 1 ? '女' : '男'}<br/>
                                                        手机:{name.phone}<br/>
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
                <Modal
                    title="修改资料"
                    visible={mvisible}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    width={400}
                    footer={null}
                >
                    <Form layout="vertical" hideRequiredMark onFinish={this.onChange}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="name"
                                    label="昵称"
                                    rules={[{required: true, message: '请输入昵称'}]}
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="gender"
                                    label="性别"
                                    rules={[{required: true, message: '请选择性别'}]}
                                >
                                    <Radio.Group >
                                        <Radio value={0}>男</Radio>
                                        <Radio value={1}>女</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="phone"
                                    label="手机"
                                    rules={[{ required: true, message: '请输入手机号'}]}
                                >
                                    <Input type={"number"} style={{width:200}}/>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block>
                                        确 认 修 改
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>


                <Drawer
                    title={'添加新客户'}
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
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="gender"
                                    label="性别"
                                    rules={[{required: true, message: '请选择性别'}]}
                                >
                                    <Radio.Group >
                                        <Radio value={0}>男</Radio>
                                        <Radio value={1}>女</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="phone"
                                    label="手机"
                                    rules={[{ required: true, message: '请输入手机号'}]}
                                >
                                    <Input type={"number"} style={{width:200}}/>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block>
                                        确 认 添 加
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