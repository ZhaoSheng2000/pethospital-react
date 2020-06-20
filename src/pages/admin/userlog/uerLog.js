import React from 'react'
import { List, Typography } from 'antd';

import moment from "moment"
import {reqTheUer} from "../../../api"

const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
];
export default class UserLog extends React.Component {

    state = {
        user:'',
    };
    componentDidMount() {
        const {id} = this.props.location.state
        reqTheUer({id}).then(res =>{
            console.log(res.data)
            this.setState({
                user:res.data.data[0]
            })
        })
    }

    render() {
        const {user} = this.state
        return (
            <div style={{marginTop:26, padding: 24, minHeight: window.innerHeight - 180,backgroundColor:'#ffffff'}}>
                <List
                    header={<div>{user.name} 的登录日志</div>}
                    bordered
                    dataSource={user.userlog}
                    renderItem={item => (
                        <List.Item>
                            <Typography.Text mark>[TIME] </Typography.Text>&nbsp; {moment(item).format('YYYY-MM-DD hh:mm')}
                        </List.Item>
                    )}
                />
            </div>
        )
    }
}