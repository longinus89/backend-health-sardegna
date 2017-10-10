import React, { Component } from 'react';
import { Link } from 'react-router'

class Sidebar extends Component {

  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
  }

  // secondLevelActive(routeName) {
  //   return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
  // }

  render() {
    return (

      <div className="sidebar">
        <nav className="sidebar-nav">
          <ul className="nav">
            <li className="nav-item">
              <Link className="nav-link" activeClassName="active"><i className="icon-speedometer"></i> Dashboard <span className="badge badge-info">NEW</span></Link>
            </li>
            <li className="nav-title">
              Menù
            </li>
            <li className={this.activeRoute("/users")}>
              <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-puzzle"></i> Utenti</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <Link to={'/users'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Lista Utenti</Link>
                </li>
              </ul>
            </li>
            <li className={this.activeRoute("/hospitals")}>
              <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-puzzle"></i> Presidi ospedalieri</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <Link to={'/hospitals'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Lista presidi</Link>
                </li>
                <li className="nav-item">
                  <Link to={'/hospitals/create'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Aggiungi presidio</Link>
                </li>
              </ul>
            </li>
            <li className={this.activeRoute("/cups")}>
              <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-puzzle"></i> Cup regionali</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <Link to={'/cups'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Lista cup</Link>
                </li>
                <li className="nav-item">
                  <Link to={'/cups/create'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Aggiungi cup</Link>
                </li>
              </ul>
            </li>
            <li className={this.activeRoute("/urps")}>
              <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-puzzle"></i> Urp regionali</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <Link to={'/urps'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Lista urp</Link>
                </li>
                <li className="nav-item">
                  <Link to={'/urps/create'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Aggiungi urp</Link>
                </li>
              </ul>
            </li>
            <li className={this.activeRoute("/s118")}>
              <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-puzzle"></i> Servizio 118</a>
              <ul className="nav-dropdown-items">
                <li className="nav-item">
                  <Link to={'/s118'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Vedi 118</Link>
                </li>
                <li className="nav-item">
                  <Link to={'/s118/edit'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Modifica 118</Link>
                </li>
              </ul>
            </li>
            <li className={this.activeRoute("/rating")}>
              <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-puzzle"></i> Rating</a>
              <ul className="nav-dropdown-items">
                <li className={this.activeRoute("/rating/unit")}>
                  <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-puzzle"></i> Reparti</a>
                  <ul className="nav-dropdown-items">
                    <li className="nav-item">
                      <Link to={'/rating/unit'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Reparti</Link>
                    </li>
                    <li className="nav-item">
                      <Link to={'/rating/unit/moderate'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Modera Reparti</Link>
                    </li>
                  </ul>
                </li>
                <li className={this.activeRoute("/rating/cup")}>
                  <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-puzzle"></i> CUP</a>
                  <ul className="nav-dropdown-items">
                    <li className="nav-item">
                      <Link to={'/rating/cup'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> CUP</Link>
                    </li>
                    <li className="nav-item">
                      <Link to={'/rating/cup/moderate'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Modera CUP</Link>
                    </li>
                  </ul>
                </li>
                <li className={this.activeRoute("/rating/urp")}>
                  <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-puzzle"></i> URP</a>
                  <ul className="nav-dropdown-items">
                    <li className="nav-item">
                      <Link to={'/rating/urp'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> URP</Link>
                    </li>
                    <li className="nav-item">
                      <Link to={'/rating/urp/moderate'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Modera URP</Link>
                    </li>
                  </ul>
                </li>
                <li className={this.activeRoute("/rating/118")}>
                  <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick.bind(this)}><i className="icon-puzzle"></i> 118</a>
                  <ul className="nav-dropdown-items">
                    <li className="nav-item">
                      <Link to={'/rating/118'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> 118</Link>
                    </li>
                    <li className="nav-item">
                      <Link to={'/rating/urp/moderate'} className="nav-link" activeClassName="active"><i className="icon-puzzle"></i> Modera 118</Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}

export default Sidebar;
