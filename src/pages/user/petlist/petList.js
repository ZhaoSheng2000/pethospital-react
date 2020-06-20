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
    Radio, Tag
} from "antd"
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';

import {reqGetPets, reqDelPets, reqAddPet, reqUpPet} from "../../../api"
import moment from "moment"
import './petlist.less'

const {Meta} = Card;

export default class PetList extends React.Component {

    state = {
        petlist: [],
        visible: false,
        mvisible: false,
        changeid: ''
    };

    componentDidMount() {
        reqGetPets().then(res => {
            this.setState({
                petlist: res.data.data
            })
        })
    }

    confirm = (id) => {
        console.log(id)
        reqDelPets({id}).then(res => {
            message.success('删除成功');
            reqGetPets().then(res => {
                this.setState({
                    petlist: res.data.data
                })
            })
        })
    }


    onClose = () => {
        this.setState({
            visible: false,
        });
    }
    onChange = (e) => {
        const {name, gender, type, birth} = e
        const {changeid} = this.state
        console.log(e, changeid)
        reqUpPet({id: changeid, name, gender, type, birth}).then(res => {
            console.log(res.data)
            if (res.data.data.n===1){
                message.success('修改信息成功')
                this.setState({
                    mvisible: false
                })
                reqGetPets().then(res => {
                    this.setState({
                        petlist: res.data.data
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


    render() {
        const {petlist, mvisible, confirmLoading} = this.state
        return (
            <div>
                <div
                    style={{padding: 24, minHeight: window.innerHeight - 180}}>
                    <Row gutter={[24, 16]}>
                        {
                            petlist.map((name, index) => {
                                return (
                                    <Col span={8} key={index}>
                                        <Card
                                            actions={[
                                                <Tooltip title={'修改资料'}>
                                                    <EditOutlined key="edit" onClick={() => this.showModal(name._id)}/>
                                                </Tooltip>,
                                                <Popconfirm
                                                    title="您确定要删除？"
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
                                                        <Tag color={"blue"} key={index}>{name.type}</Tag><br/>
                                                        性别：{name.gender === 1 ? '女' : '男'}<br/>
                                                        出生日期:{moment(name.birth).format('YYYY-MM-DD ')}<br/>
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
                                    label="姓名"
                                    rules={[{required: true, message: '请输入姓名'}]}
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
                                    <Radio.Group>
                                        <Radio value={0}>男</Radio>
                                        <Radio value={1}>女</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="type"
                                    label="类型"
                                    rules={[{required: true, message: '请输入宠物类型'}]}
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="birth"
                                    label="生日"
                                    rules={[{required: true, message: '请输入宠物出生日期'}]}
                                >
                                    <Input placeholder={"例：2020-01-01"}/>
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
            </div>
        )
    }
}