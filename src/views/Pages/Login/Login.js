import React, { Component } from 'react';

///

class Login extends Component {
  constructor(props) {
    super(props);
    this.checkAuth = this.checkAuth.bind(this);
    this.state = {};

    //document.addEventListener('mousewheel', function(){}, {passive: true});
  }

  randNumber(min, max){
    if(!min) min=1000;
    if(!max) max=10000000000000000000000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  checkAuth(){


    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if(username==="" || password===""){
      this.setState({error:true, errorText:"Username e password sono campi obbligatori.", rand: this.randNumber()});
      return false;
    }

    //localStorage.setItem('state', 'off');

    var inputs = [];
    let url = '';
    let redirectUrl = '/hospitals';
    url="http://api.ilportaledellasanitainsardegna.it/" + "api/user/auth/check";

    let requestData = {
      username: username,
      password: password 
    }

    var request = new Request(url, {
      method: 'POST', 
      mode: 'cors', 
      redirect: 'follow',
      cache: 'no-cache',
      body: JSON.stringify(requestData)
    });
    
    let that = this;

    //console.log(this);

    // Now use it!
    fetch(request).then(function(response) { 
      // Convert to JSON
      return response.json();
    }).then(function(j) {

      console.log(j);

      if(j.code===200){
        localStorage.setItem("authAccountBE", "ok");
        that.setState({isLoadingButton:false});
        that.props.router.push(redirectUrl);
      }else{
        that.setState({isLoadingButton:false,error:true,errorText:"Username e/o password errati", rand:that.randNumber()});
      }
    });

  }


  render() {

    var errorText = "";

    console.log(this.state);

    if(typeof(this.state.error)!=="undefined"){
      errorText = this.state.errorText;
    }

    return (
      <div className="container container-login">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card-group mb-0">
              <div className="card p-4">
                <div className="card-block">
                  <h1>Login</h1>
                  <p className="text-muted">Effettua il login al Pannello di Controllo di Check-Sanità Sardegna</p>
                  <div className="input-group mb-3">
                    <span className="input-group-addon"><i className="icon-user"></i></span>
                    <input id="username" type="text" className="form-control" placeholder="Username"/>
                  </div>
                  <div className="input-group mb-4">
                    <span className="input-group-addon"><i className="icon-lock"></i></span>
                    <input id="password" type="password" className="form-control" placeholder="Password"/>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <button type="button" onClick={this.checkAuth} className="btn btn-primary px-4">Login</button>
                    </div>
                  </div>
                  <div className="row errorRow">
                    <div className="col-12">
                      {errorText}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
