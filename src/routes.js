import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

// Containers
import Full from './containers/Full/'
import Simple from './containers/Simple/'

import Login from './views/Pages/Login/'
import Pois_upsert from './views/Components/Pois_upsert/'
import Pois_view from './views/Components/Pois_view/'
import Pois_list from './views/Components/Pois_list/'
import Rating_upsert from './views/Components/Rating_upsert/'
import Rating_list from './views/Components/Rating_list/'
import Rating_mod_list from './views/Components/Rating_mod_list/'
import Dashboard from './views/Dashboard/'
import Page404 from './views/Pages/Page404/'
import Page500 from './views/Pages/Page500/'
import Register from './views/Pages/Register/'
import Users_list from './views/Components/Users_list/'

/*import Charts from './views/Charts/'

import Buttons from './views/Components/Buttons/'
import Cards from './views/Components/Cards/'
import Forms from './views/Components/Forms/'
import Modals from './views/Components/Modals/'
import SocialButtons from './views/Components/SocialButtons/'
import Switches from './views/Components/Switches/'
import Tables from './views/Components/Tables/'
import Tabs from './views/Components/Tabs/'
import FontAwesome from './views/Icons/FontAwesome/'
import SimpleLineIcons from './views/Icons/SimpleLineIcons/'



import Widgets from './views/Widgets/'*/

export default (
  <Router history={hashHistory}>
    <Route path="login" name="Login" component={Login}/>
    <Route path="/" name="Home" component={Full}>
      <Route path="dashboard" name="Dashboard" component={Dashboard}/>
      <Route path="hospitals" name="Presidi Sanitari">
        <IndexRoute name="Lista" component={Pois_list} config={'./configs/config1.json'}/>
        <Route path="create" redirectUrl="hospitals" name="Crea" component={Pois_upsert} config={'./configs/config1.json'} />
        <Route path=":id1/edit" redirectUrl="hospitals" name="Modifica" component={Pois_upsert} form_type="edit" config={'./configs/config1.json'} />
        <Route path=":id1/departments" name="Dipartimenti">
          <IndexRoute name="Lista" component={Pois_list} config={'./configs/config2.json'}/>
          <Route path=":id2/edit" redirectUrl="hospitals/:id1/departments" name="departments_edit" component={Pois_upsert} form_type="edit"  config={'./configs/config2.json'}/>
          <Route path=":id2/units" name="Reparti">
            <IndexRoute name="Lista" component={Pois_list} config={'./configs/config3.json'}/>
            <Route path="create" redirectUrl="hospitals/:id1/departments/:id2/units" name="Crea" component={Pois_upsert} config={'./configs/config3.json'}/>
            <Route path=":id3/edit"  redirectUrl="hospitals/:id1/departments/:id2/units" name="Modifica" component={Pois_upsert} form_type="edit"  config={'./configs/config3.json'}/>
          </Route>
          <Route path="create" redirectUrl="hospitals/:id1/departments" name="Crea" component={Pois_upsert} config={'./configs/config2.json'} />
        </Route>
      </Route>

      <Route path="urps" name="URP">
        <IndexRoute name="URP" component={Pois_list} config={'./configs/config5.json'}/>
        <Route path="create" redirectUrl="urps" name="Crea" component={Pois_upsert} config={'./configs/config5.json'}/>
        <Route path=":id1/edit" redirectUrl="urps" name="Modifica" component={Pois_upsert} form_type="edit"  config={'./configs/config5.json'}/>
      </Route>
      <Route path="cups" name="CUP">
        <IndexRoute name="CUP" component={Pois_list} config={'./configs/config4.json'}/>
        <Route path="create" redirectUrl="cups" name="Crea" component={Pois_upsert} config={'./configs/config4.json'}/>
        <Route path=":id1/edit" redirectUrl="cups" name="Modifica" component={Pois_upsert} form_type="edit"  config={'./configs/config4.json'}/>
      </Route>      
      <Route path="s118" name="118">
        <IndexRoute name="Visualizza" component={Pois_view} config={'./configs/config6.json'}/>
        <Route path="edit" redirectUrl="s118" name="Modifica" component={Pois_upsert} form_type="edit"  config={'./configs/config6.json'}/>
      </Route>
      <Route path="rating/" name="rating">
        
        <Route path=":type/moderate" redirectUrl="rating/:type" name="Modera" component={Rating_mod_list} config={'./configs/config8.json'}/>

        <Route path=":type/create" redirectUrl="rating/:type" name="Crea" component={Rating_upsert} config={'./configs/config7.json'}/>
        <Route path=":type" redirectUrl="rating/:type" name="Crea" component={Rating_list} config={'./configs/config7.json'}/>
        <Route path=":code/edit" redirectUrl="rating/:type" name="Modifica" component={Rating_upsert} form_type="edit"  config={'./configs/config7.json'}/>
      </Route>         
    </Route>
    <Route path="users" name="Utenti" component={Full}>
      <IndexRoute name="Lista" component={Users_list} config={'./configs/config9.json'} />
    </Route>
  </Router>
);
