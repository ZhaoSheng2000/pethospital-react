import React from 'react'
import {
    Avatar,
    Card,
    Divider,
    Table,
    Tag,
    Space,
    Button,
    Form,
    Row,
    Col,
    Input,
    Radio,
    Drawer,
    message,
    Modal,
    List,
    Typography,
} from "antd"
import {
    PlusOutlined,
} from '@ant-design/icons';
import moment from "moment"
import {reqTheOwner, reqOwnersPets, reqAddPet, reqPetWithOwner, reqPetvisit, reqThePet} from "../../../api"

const {Meta} = Card;
const {Column} = Table;
const {TextArea} = Input



const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
];

export default class OwnersPets extends React.Component {

    state = {
        userinfo: {
            name: '',
            date: '',
            gender: '',
            phone: ''
        },
        petlist: [],
        visible: false,
        userid: '',
        modal: false,
        visitmodal: false,
        title: '',
        currentpet: '',
        visitRecords: ''

    };

    componentDidMount() {
        const {id} = this.props.location.state
        this.setState({
            userid: id
        })
        reqTheOwner({id}).then(res => {
            this.setState({
                userinfo: res.data.data[0]
            })
        })
        reqOwnersPets({id}).then(res => {
            this.setState({
                petlist: res.data.data[0].petlist
            })
        })
    }

    showDrawer = () => {
        this.setState({
            visible: true
        });
    };

    onClose = () => {
        this.setState({
            visible: false
        });
    }
    onSubmit = (e) => {
        const {name, gender, type, birth} = e
        reqAddPet({name, gender, type, birth}).then(res => {
            console.log(res.data.data.id)
            const petid = res.data.data.id
            const {userid} = this.state
            reqPetWithOwner({userid, petid}).then(r => {
                console.log(r.data)
                if (r.data.data.n === 1) {
                    message.success('添加成功')
                    this.setState({
                        visible: false,
                    });
                }
            })
            reqTheOwner({id: userid}).then(res => {
                this.setState({
                    userinfo: res.data.data[0]
                })
            })
        })

    }

    addVisit = (id) => {
        this.setState({
            modal: true,
            currentpet: id
        });
    }

    showVisit = (id) => {
        this.setState({
            visitmodal: true,
        });
        reqThePet({id}).then(res => {
            this.setState({
                visitRecords: res.data.data[0].visitRecords
            })
        })

    }
    handleOk = () => {
        const {currentpet, title} = this.state
        if (title === '') {
            message.warning('内容不能为空')
        } else {
            reqPetvisit({id: currentpet, remark: title}).then(res => {
                console.log(res.data)
                if (res.data.success === 1) {
                    message.success('添加宠物访问记录成功')
                    this.setState({
                        modal: false,
                        title: ''
                    });
                }
            })
        }

    };
    handleCancel = () => {
        this.setState({
            modal: false,
            visitmodal: false
        });
    };
    titleChange = ({target: {value}}) => {
        this.setState({title: value});
    };

    render() {
        const {userinfo, petlist, title,visitRecords} = this.state
        return (
            <div>
                <div style={{
                    marginTop: 24,
                    padding: 24,
                    minHeight: window.innerHeight - 180,
                    backgroundColor: '#ffffff'
                }}>
                    <Divider orientation="left">客户信息</Divider>
                    <Card style={{width: 400}}>
                        <Meta
                            avatar={<Avatar style={{backgroundColor: "#1fa67c"}}
                                            size={40}>{userinfo.name.slice(0, 1)}</Avatar>}
                            title={<span>{userinfo.name}
                                                </span>
                            }
                            description={
                                <span>
                                                        性别：{userinfo.gender === 1 ? '女' : '男'}<br/>
                                                        手机:{userinfo.phone}<br/>
                                                    注册时间：{moment(userinfo.date).format('YYYY-MM-DD HH:mm')}
                                                    </span>
                            }
                        />
                    </Card>
                    <Divider orientation="left">客户宠物列表</Divider>
                    <div style={{margin: '26px 26px 26px 26px'}}>
                        <Button type="primary" shape="round" icon={<PlusOutlined/>} size={32} onClick={this.showDrawer}>
                            添加客户所属宠物
                        </Button>
                    </div>
                    <Table dataSource={petlist} rowKey={record => record._id} pagination={false}>
                        <Column title="姓名" dataIndex="name"/>
                        <Column
                            title="性别"
                            dataIndex="gender"
                            render={(type, index) => (
                                type === 0 ? '男' : '女'
                            )}
                        />
                        <Column
                            title="类型"
                            dataIndex="type"
                            render={(type, index) => (
                                <Tag color={"blue"} key={index}>{type}</Tag>
                            )}
                        />
                        <Column
                            title="出生日期"
                            dataIndex="birth"
                            render={(type, index) => (
                                moment(type).format("YYYY-MM-DD")
                            )}
                        />
                        <Column align={'right'}
                                title="操作"
                                render={(text) => (
                                    <Space size="middle">
                                        <a onClick={() => this.addVisit(text._id)}>添加访问记录</a>
                                        <a onClick={() => this.showVisit(text._id)}>历史记录</a>
                                    </Space>
                                )}
                        />
                    </Table>
                </div>

                <Modal
                    title="填写访问记录"
                    visible={this.state.modal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <TextArea rows={4} value={title} onChange={this.titleChange}/>
                </Modal>

                <Modal
                    title="历史访问记录"
                    visible={this.state.visitmodal}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <List
                        bordered
                        dataSource={visitRecords}
                        renderItem={item => (
                            <List.Item>
                                <Typography.Text mark>[{moment(item.time).format('YYYY-MM-DD hh:mm')}]</Typography.Text> {item.remark}
                            </List.Item>
                        )}
                    />
                </Modal>

                <Drawer
                    title={'添加新宠物'}
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