import React from 'react';
import './styles/user-card.css';

class UserCard extends React.Component {
    static getDerivedStateFromProps(props, state) {
        if (window.localStorage) {
            return {
                userInfo: JSON.parse(localStorage.getItem(props.userKey))
            };
        } else {
            console.error("There's no session storage");
        }
        return null;
    }

    constructor(props) {
        super(props);
        this.state = {
            userInfo: undefined,
        };
    }

    render () {
        return(
            <React.Fragment>
                <div className="user-card">
                    <img
                        className="avatar-image"
                        loading="lazy"
                        alt="avatar"
                        src={this.state.userInfo.avatar}
                        height={64}
                        width={64}
                    />
                    <div className="user-text">
                        <div className="user-name">
                          {this.state.userInfo.name}
                        </div>
                        <div className="user-id">
                          <span style={{
                              fontWeight: '700',
                              fontSize: '11px',
                          }}>User ID: </span>
                          {this.state.userInfo.id}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default UserCard;
