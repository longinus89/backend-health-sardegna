import React, { Component } from 'react';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';

import Breadcrumbs from 'react-breadcrumbs';

class Full extends Component {


  constructor(props) {
    super(props);
    this.checkLocalAuth = this.checkLocalAuth.bind(this);
    this.state = {};

    //document.addEventListener('mousewheel', function(){}, {passive: true});
  }

  checkLocalAuth(){
    
    console.log("checkLocalAuth");

    let localItem = localStorage.getItem("authAccountBE");

    console.log(localItem);

    if(typeof(localItem)==="undefined" || localItem === null){
      this.props.router.push("/login");
    } 

  }

  render() {

    this.checkLocalAuth();

    return (
      <div className="app">
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Breadcrumbs
              wrapperElement="ol"
              wrapperClass="breadcrumb"
              itemClass="breadcrumb-item"
              separator=""
              routes={this.props.routes}
              params={this.props.params}
            />
            <div className="container-fluid">
              {this.props.children}
            </div>
          </main>
          <Aside />
        </div>
        <Footer />
      </div>
    );
  }
}

export default Full;
