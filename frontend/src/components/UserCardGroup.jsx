import React from 'react';

import './styles/user-card-group.css';

const axios = require('axios');

class UserCardGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            liveUsers: [],
        };
        this.userAPI = `http://${props.apiBase}:1498`;
    }

    getLiveUsers = async () => {
        let users = await axios.get(`${this.userAPI}/users`);
        const { data } = users.data;
        const session = JSON.parse(localStorage.getItem(this.props.userKey));
        const res = data.filter(usr => usr.id !== session.id);
        this.setState({ liveUsers: res });
    }

    componentDidMount() {
        setInterval(() => {
            this.getLiveUsers();
        }, 1000);
    }

    render () {
        return (
            <React.Fragment>
                <div className="container">
                    {
                        this.state.liveUsers.map(user => (
                                <div className="smol-user-card" key={user.name}>
                                    <img alt="profile-img" src={user.avatar} height={16} loading="lazy" width={16} />
                                    {user.name}
                                </div>
                            ))
                    }
                </div>
            </React.Fragment>
        );
    }
}

export default UserCardGroup;
