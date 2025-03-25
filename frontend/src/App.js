import { Component } from "react";

class App extends Component {
  state = { username: "", password: "" };

  registerdLog = async () => {
    const { username, password } = this.state;
    const apiurls = "http://localhost:4000/register";
    const dats = { username, password };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dats),
    };
    const getRespon = await fetch(apiurls, options);
    const getData = await getRespon.json();
    console.log(getRespon);
  };

  loginCheck = async () => {
    const { username, password } = this.state;
    console.log(password);
    const apiurls = "http://localhost:4000/login";

    const options = {
      method: "POST",
      body: JSON.stringify({ username, password }),
    };
    const getLogde = await fetch(apiurls, options);
    const getlogvalu = await getLogde.json();
    console.log(getlogvalu);
  };

  changeUsers = (event) => {
    this.setState({ username: event.target.value });
  };

  changePass = (event) => {
    this.setState({ password: event.target.value });
  };

  render() {
    return (
      <div>
        <form>
          <div>
            <p>Username</p>
            <input id="noted" onChange={this.changeUsers} type="text" />
          </div>
          <div>
            <p>Password</p>
            <input id="noteds" onChange={this.changePass} type="password" />
          </div>
          <div>
            <button onClick={this.registerdLog}>Sign up</button>
            <button onClick={this.loginCheck}>Login</button>
          </div>
        </form>
      </div>
    );
  }
}

export default App;
