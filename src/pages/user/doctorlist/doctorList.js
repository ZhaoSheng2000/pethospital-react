import React from 'react'

import {
    Avatar,
    Button,
    Card,
    Col,
    Drawer,
    Form,
    Input,
    InputNumber,
    message,
    Popconfirm,
    Row,
    Tag,
    Tooltip,
    Modal
} from "antd"
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';

import {reqDelDoctor, reqGetDoctors, reqAddDoctor, reqUpDoctor} from "../../../api"
import moment from "moment"
import './doctorlist.less'

const {Meta} = Card;

export default class DoctorList extends React.Component {

    state = {
        doctorlist: [],
        visible: false,
        tags: [],
        inputVisible: false,
        inputValue: '',
        editInputIndex: -1,
        editInputValue: '',
        mvisible: false,
        confirmLoading: false,
        changeid:''
    };

    componentDidMount() {
        reqGetDoctors().then(res => {
            console.log(res.data)
            this.setState({
                doctorlist: res.data.data
            })
        })
    }

    confirm = (id) => {
        reqDelDoctor({id}).then(res => {
            console.log(res.data)
            message.success('删除成功');
            reqGetDoctors().then(res => {
                console.log(res.data)
                this.setState({
                    doctorlist: res.data.data
                })
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
            visible: false,
        });
    }
    onSubmit = (e) => {
        const {name, age, email} = e
        const {tags} = this.state
        console.log(tags)
        reqAddDoctor({name, age, email, label: tags}).then(res => {
            console.log(res.data)
            if (res.data.success === 1) {
                message.success('添加成功')
                this.setState({
                    visible: false
                });
                reqGetDoctors().then(res => {
                    console.log(res.data)
                    this.setState({
                        doctorlist: res.data.data
                    })
                })
            } else if (res.data.success === 0) {
                message.warning('邮箱已被占用')
            } else {
                message.error('未知错误')
            }

        })
    }
    onChange =(e)=>{
        const {name, age} = e
        const {tags,changeid} = this.state
        reqUpDoctor({id:changeid,name,age,label:tags}).then(res =>{
            if (res.data.success===1){
                message.success('修改信息成功')
                this.setState({
                    mvisible:false
                })
                reqGetDoctors().then(res => {
                    console.log(res.data)
                    this.setState({
                        doctorlist: res.data.data
                    })
                })
            }else {
                message.error('修改失败')
            }
        })


    }
    handleClose = removedTag => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        console.log(tags);
        this.setState({tags});
    };

    showInput = () => {
        this.setState({inputVisible: true}, () => this.input.focus());
    };

    handleInputChange = e => {
        this.setState({inputValue: e.target.value});
    };

    handleInputConfirm = () => {
        const {inputValue} = this.state;
        let {tags} = this.state;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        console.log(tags);
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
    };

    handleEditInputChange = e => {
        this.setState({editInputValue: e.target.value});
    };

    handleEditInputConfirm = () => {
        this.setState(({tags, editInputIndex, editInputValue}) => {
            const newTags = [...tags];
            newTags[editInputIndex] = editInputValue;

            return {
                tags: newTags,
                editInputIndex: -1,
                editInputValue: '',
            };
        });
    };

    saveInputRef = input => {
        this.input = input;
    };

    saveEditInputRef = input => {
        this.editInput = input;
    };


    showModal = (id) => {
        this.setState({
            mvisible: true,
            changeid:id
        });
    };

    handleCancel = () => {
        this.setState({
            mvisible: false,
        });
    };


    render() {
        const {doctorlist, tags, inputVisible, inputValue, editInputIndex, editInputValue,mvisible,confirmLoading} = this.state
        return (
            <div>
                <div style={{margin: '26px 26px 0px 26px'}}>
                    <Button type="primary" shape="round" icon={<PlusOutlined/>} size={32} onClick={this.showDrawer}>
                        添加医生
                    </Button>
                </div>
                <div
                    style={{padding: 24, minHeight: window.innerHeight - 180}}>
                    <Row gutter={[24, 16]}>
                        {
                            doctorlist.map((name, index) => {
                                return (
                                    <Col span={8} key={index}>
                                        <Card
                                            actions={[
                                                <EditOutlined key="edit" onClick={() =>this.showModal(name._id)}/>,
                                                <Popconfirm
                                                    title="您确定要删除此医生？"
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
                                                        {
                                                            name.label.map((label, index) => {
                                                                return (
                                                                    <Tag color={"blue"} key={index}>{label}</Tag>
                                                                )
                                                            })
                                                        }<br/>
                                                        年龄：{name.age}<br/>
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
                                    name="age"
                                    label="年龄"
                                    rules={[{required: true, message: '请输入正确的年龄'}]}
                                >
                                    <InputNumber/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name='label'
                                    label='专业技能'
                                >
                                    <>
                                        {tags.map((tag, index) => {
                                            if (editInputIndex === index) {
                                                return (
                                                    <Input
                                                        ref={this.saveEditInputRef}
                                                        key={tag}
                                                        size="small"
                                                        className="tag-input"
                                                        value={editInputValue}
                                                        onChange={this.handleEditInputChange}
                                                        onBlur={this.handleEditInputConfirm}
                                                        onPressEnter={this.handleEditInputConfirm}
                                                    />
                                                );
                                            }

                                            const isLongTag = tag.length > 20;

                                            const tagElem = (
                                                <Tag
                                                    className="edit-tag"
                                                    key={tag}
                                                    closable={index !== -1}
                                                    onClose={() => this.handleClose(tag)}
                                                >
              <span
                  onDoubleClick={e => {
                      if (index !== 0) {
                          this.setState({editInputIndex: index, editInputValue: tag}, () => {
                              this.editInput.focus();
                          });
                          e.preventDefault();
                      }
                  }}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </span>
                                                </Tag>
                                            );
                                            return isLongTag ? (
                                                <Tooltip title={tag} key={tag}>
                                                    {tagElem}
                                                </Tooltip>
                                            ) : (
                                                tagElem
                                            );
                                        })}
                                        {inputVisible && (
                                            <Input
                                                ref={this.saveInputRef}
                                                type="text"
                                                size="small"
                                                className="tag-input"
                                                value={inputValue}
                                                onChange={this.handleInputChange}
                                                onBlur={this.handleInputConfirm}
                                                onPressEnter={this.handleInputConfirm}
                                            />
                                        )}
                                        {!inputVisible && (
                                            <Tag className="site-tag-plus" onClick={this.showInput}>
                                                <PlusOutlined/> New Tag
                                            </Tag>
                                        )}
                                    </>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block >
                                        确 认 修 改
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>                </Modal>



                <Drawer
                    title={'添加新医生'}
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
                                    name="age"
                                    label="年龄"
                                    rules={[{required: true, message: '请输入正确的年龄'}]}
                                >
                                    <InputNumber/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name='label'
                                    label='专业技能'
                                >
                                    <>
                                        {tags.map((tag, index) => {
                                            if (editInputIndex === index) {
                                                return (
                                                    <Input
                                                        ref={this.saveEditInputRef}
                                                        key={tag}
                                                        size="small"
                                                        className="tag-input"
                                                        value={editInputValue}
                                                        onChange={this.handleEditInputChange}
                                                        onBlur={this.handleEditInputConfirm}
                                                        onPressEnter={this.handleEditInputConfirm}
                                                    />
                                                );
                                            }

                                            const isLongTag = tag.length > 20;

                                            const tagElem = (
                                                <Tag
                                                    className="edit-tag"
                                                    key={tag}
                                                    closable={index !== -1}
                                                    onClose={() => this.handleClose(tag)}
                                                >
              <span
                  onDoubleClick={e => {
                      if (index !== 0) {
                          this.setState({editInputIndex: index, editInputValue: tag}, () => {
                              this.editInput.focus();
                          });
                          e.preventDefault();
                      }
                  }}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </span>
                                                </Tag>
                                            );
                                            return isLongTag ? (
                                                <Tooltip title={tag} key={tag}>
                                                    {tagElem}
                                                </Tooltip>
                                            ) : (
                                                tagElem
                                            );
                                        })}
                                        {inputVisible && (
                                            <Input
                                                ref={this.saveInputRef}
                                                type="text"
                                                size="small"
                                                className="tag-input"
                                                value={inputValue}
                                                onChange={this.handleInputChange}
                                                onBlur={this.handleInputConfirm}
                                                onPressEnter={this.handleInputConfirm}
                                            />
                                        )}
                                        {!inputVisible && (
                                            <Tag className="site-tag-plus" onClick={this.showInput}>
                                                <PlusOutlined/> New Tag
                                            </Tag>
                                        )}
                                    </>
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
                                    <Input type={"email"}/>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block onClick={this.onSubmit}>
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