import React from "react";
import io from "socket.io-client";
import { v1, v4 } from "uuid";
import GenerateName from "./name-generator";
import randomColor from "randomcolor";
import UserCardGroup from './components/UserCardGroup';
import UserCard from "./components/UserCard";

import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorValue: '',
      isUserSet: false,
    };
    this.APIBase = this.props.localhost;
    this.userAPI = `http://${this.APIBase}:1498`;
    this.socket = io(`http://${this.APIBase}:4040`);
    this.defaultImage = 'default_profile.svg';
    this.avatarAPI = "https://avatars.dicebear.com/v2/avataaars/";
    this.userID = v4();
    this.userName = GenerateName();
    this.userAvatar = this.defaultImage;
    this.userColor = randomColor({
      luminosity: "bright"
    });
    this.userKey = "user-info";
  }

  avatarMaker = () => {
    const options = "?options[mouth][]=smile&options[eyes][]=happy";
    const fileFormat = ".svg";
    const imageID = v1();
    const img = `${this.avatarAPI}${imageID}${fileFormat}${options}`;
    return img;
  };

  getInitData = async () => {
    let redisData = null;
    let data = await fetch(`http://${this.APIBase}:1498/init`);
    redisData = await data.text();
    console.log(redisData);
    if (redisData !== null) {
      this.setState({ editorValue: redisData });
    }
  } 

  sessionHandler() {
    let localSt = false;
    if (window.localStorage) {
      console.log("You've got session storage!");
      localSt = true;
    } else {
      console.error("No session storage support!");
      return;
    }
    this.userAvatar = this.avatarMaker() || this.defaultImage;
    const userObject = {
      id: `${this.userID}`,
      name: `${this.userName}`,
      avatar: `${this.userAvatar}`,
      color: `${this.userColor}`
    };

    if (localSt) {
      localStorage.setItem(this.userKey, JSON.stringify(userObject));
      fetch(`${this.userAPI}/users`, { method: 'POST', headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify(userObject) });
      this.setState({ isUserSet: true });
    }
  }

  textChange = e => {
    e.preventDefault();

    this.setState({
      editorValue: e.target.value
    });
  };

  attachKeyUpListener = e => {
    e.preventDefault();
    this.socket.send(this.state.editorValue);
  };

  componentDidMount() {
    if (!this.state.isUserSet) {
      this.sessionHandler();
      this.getInitData();
    }
  
    this.socket.on("message", data => {
      this.setState({
        editorValue: data
      });
    });
  }

  componentWillUnmount() {
    // api call to remove the current user from the array
  }

  render() {
    return (
      <React.Fragment>
        <div className="app">
          <div className="header">Collaborative Text Editor</div>
          <div className="page-content">
            <div
              className="client-content"
              style={{
                border: `1px solid ${this.userColor}`,
                backgroundColor: `${this.userColor}15`
              }}
            >
              <div className="left-panel">
                <UserCard userKey={this.userKey} />
              </div>
              <div className="right-panel">
                  <span>Shared With</span>
                  <UserCardGroup userKey={this.userKey} apiBase={this.APIBase} />
              </div>
            </div>
            <div className="text-content">
              <textarea
                className="edit-area"
                onChange={this.textChange}
                onKeyUp={this.attachKeyUpListener}
                placeholder="Enter text here..."
                value={this.state.editorValue}
                rows={15}
                style={{
                  caretColor: `${this.userColor}`
                }}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
