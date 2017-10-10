import React, { Component } from 'react';

class Pois_list extends Component {
	constructor(props) {
		super(props);
		this.getList = this.getList.bind(this);
		this.getConfig = this.getConfig.bind(this);
		this.filterByKeys = this.filterByKeys.bind(this);
		this.changePage = this.changePage.bind(this);
		this.state = {};
		this.delete = this.delete.bind(this);

		//this.forceUpdate();
	}

	randNumber(min, max){
		if(!min) min=1000;
		if(!max) max=10000000000000000000000;
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	filterByKeys(item) {

		let config = this.state.config;
		let columns = config['columns'];

		if (typeof(columns[item["key"]])!=="undefined") {
		  return true;
		} 
		return false; 
	}

	componentWillMount() {
		let config=this.props.route.config;
		this.getConfig(config,this.getList);
	}
	componentWillReceiveProps(nextProps) {
		let config=this.props.route.config;
		let nextConfig=nextProps.route.config;

		// You don't have to do this check first, but it can help prevent an unneeded render
		if (nextConfig !== config) {
		  //super(nextProps);
      this.setState({page_number:0});
      this.getConfig(nextConfig, this.getList);
		}
	}

	getConfig(config,callback){
		let that = this;

		fetch(config).then(function(response) {
		  if (!response.ok) {
		    throw Error(response.statusText);
		  }
		  let json = response.json();
		  return json;
		}).then(function(j){
		  that.setState({
		    config: j
		  });
		  callback();
		});
	}

	changePage(page_id){
		console.log(page_id);
		this.setState({page_number: page_id});
		//return false;
	}

	delete(id){
      let that = this;
	    let config = this.state.config;
	    let url = config['delete_url'];
	    //let radix = config['radix'];
	    let poi_delete_label = config['poi_delete_label'];
	    //console.log(config);

	    if(confirm("Confermi di voler cancellare " +poi_delete_label+"? ")){

        let id_prefix = config['id_prefix'];
        let newParam = {};
        newParam[id_prefix] = id;
        url = this.replaceParams(url,newParam); 

		    var request = new Request(url, {
		      method: 'GET', 
		      //mode: 'no-cors', 
		      //redirect: 'follow',
		      cache: 'no-cache'
		    });

		    // Now use it!
		    fetch(request).then(function(response) { 

		      if (!response.ok) {
		        throw Error(response.statusText);
		      }

		      //console.log("11111");
		      let json = response.json();
		      //console.log("22222");
		      //console.log(json);
		      return json;
		    }).then(function(j) {
		      if(j.code===200){
		      	that.getList();
		      }else{
		        //console.log("Errore "+j.code);
		      }
		    }).catch(function(error) {
		        console.log(error);
		    });
		}

	}

  getUrlParams(){
    let params = this.props.params;
    //console.log(params);
    return params;
  }

  replaceParams(url,newParams){

    if(!newParams) newParams = [];

    let params = this.getUrlParams();  
    
    //console.log(url);

    for(var param_key in params){
      let param = params[param_key];
      url = url.replace(":"+param_key,param); 
    }
    //console.log(url);

    //console.log(newParams);

    for(param_key in newParams){
      let param = newParams[param_key];
      url = url.replace(":"+param_key,param);
    }
    return url;
  }

  getList(url){
    
    let config = this.state.config;
    if(!url) url=config['get_url'];

    let radix = config['radix'];
    url = url.replace(":type",radix);
    url = this.replaceParams(url); 

    var request = new Request(url, {
      method: 'GET', 
      mode: 'cors', 
      redirect: 'follow',
      cache: 'no-cache'
    });

    let that = this;

    // Now use it!
    fetch(request).then(function(response) { 

      if (!response.ok) {
        throw Error(response.statusText);
      }

      //console.log("11111");
      let json = response.json();
      //console.log("22222");
      //console.log(json);
      return json;
    }).then(function(j) {
      if(j.code===200){

        let pdata = j.data;

        that.setState({pdata:pdata});
        that.forceUpdate();
      }else{
        //console.log("Errore "+j.code);
      }
    }).catch(function(error) {
        console.log(error);
    });

  }

  render() {

    let config = this.state.config;
    let pdata = this.state.pdata;
    let page_number = this.state.page_number;

    let rows = [];
    let columns = [];
    let page_size = 10;
    let pages = [];
    let title = "";
    let add_button_url = "";
    let add_button_text = "";
    let actions = [];
    let radix = this.props.route.radix;
    let id_prefix = "";

    if(typeof(page_number)==="undefined") page_number = 0;

    if(typeof(config)!=="undefined"){
      page_size = config['page_size'];
      title = config['title'];
      add_button_text = config['add_button_text'];

      add_button_url = config['add_button_url'];
      add_button_url = this.replaceParams(add_button_url); 

      actions = config['actions'];

      for(var column_key in config['columns']){
        let column_content = config['columns'][column_key];
        let label = column_content.label;

        columns.push(<th key={this.randNumber()}>{label}</th>);
      } 

      id_prefix = config['id_prefix'];

    }

    //console.log(columns);

    if(typeof(pdata)!=="undefined"){

      //console.log(pdata);

      let poi_data = pdata['pois'];
      let father = pdata['father'];

      console.log(poi_data);

      for(var pkey in poi_data){

        let min = page_number * page_size;
        let max = min + page_size;

        //console.log(pkey);
        //console.log(min);
        //console.log(max);
        //console.log("-------");

        //devo saltare tutti gli oggetti che non sono nella finestra i-esima di size == page_size
        if(pkey<min || pkey>=max) continue;

        let content = poi_data[pkey];
        let fields = content['fields'];
        let row_code = content['code'];
        let jsx_father = null;

        let tds = [];

        for(column_key in config['columns']){
          if(typeof(content[column_key])!=="undefined") tds.push(<td key={this.randNumber()}>{content[column_key]}</td>);
          else if(column_key==="father") jsx_father = <td key={this.randNumber()}>{father['name']}</td>;
        };

        /*for(var field_key in fields){
          let rand_key = parseInt(Math.random()*10);
          for(var column_key in config['columns']){
            let rand_key = parseInt(Math.random()*10);
            tds.push(<td key={this.randNumber()}>{fields[field_key][column_key]}</td>); 
          };
        };*/
        
        //itero sui field e li filtro togliendo i campi non necessari
        var field_filtered = fields.filter(this.filterByKeys);

        for(var field_key in field_filtered){
          tds.push(<td key={this.randNumber()}>{field_filtered[field_key]['value']}</td>);
          //console.log(fields);
        };

        let jsx_actions = [];

        //console.log(field_filtered);

        for(var akey in actions){
    			let action = actions[akey];
    			let action_url = action.url;

          let newParam = {};
          newParam[id_prefix] = row_code;

          action_url = this.replaceParams(action_url,newParam); 
              			
    			if(action.type !== "delete") jsx_actions.push(<a key={this.randNumber()} href={action_url}><button type="button" className={action['class']}>{action['label']}</button></a>) 
    			else jsx_actions.push(<a onClick={() => { this.delete(row_code) }} key={this.randNumber()}><button type="button" className={action['class']}>{action['label']}</button></a>)    
        }

        if(jsx_father!=null) tds.push(jsx_father);
        
        tds.push(<td key={this.randNumber()}>{jsx_actions}</td>);
        let row = <tr key={this.randNumber()}>{tds}</tr>;
        rows.push(row);
      
        //<td><span className="badge badge-success">Active</span></td>
      }

      let number_of_pages=Math.floor((poi_data.length - 1) / page_size);

      for(let i=0;i<=number_of_pages;i++){
        let page_class="page-item";
        
        if(i===page_number) page_class="page-item active";

        pages.push(<li onClick={() => { this.changePage(i) }} key={this.randNumber()} className={page_class}><a className="page-link">{i + 1}</a></li>)  
      }  
    }

    /*if(typeof(field_filtered)!=="undefined"){
      //tds.push(<td key={this.randNumber()}>{field["value"]}</td>);  
    }*/

    /*let models = this.state.models;
    let rows = [];
    let radix = this.props.route.radix;    
    let poi_type_label = '';

    if(radix=='hospital'){
      poi_type_label = 'Presidio ospedaliero';
    }else if(radix=='department'){
      poi_type_label = 'Dipartimento';
    }

    //console.log(models);

    if(models!=null && typeof(models)!=="undefined"){

      let hospital_fields = models[radix];
      let final_radix = radix + "_";

      //console.log(hospital_fields);

      for(var key in hospital_fields){
        let field = hospital_fields[key];
        //console.log(field);
        let model = this.getInput(field, final_radix + key);
        rows.push(model);
      }   
    }*/



    return (
        <div id={"table_" + radix + "_list"} key={"table_" + radix + "_list"}>
        <div className="row">
          <div className="col-lg-12 add-button">
            <a href={add_button_url}><button type="button" className="btn btn-primary">{add_button_text}</button></a>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header">
                <i className="fa fa-align-justify"></i>{title}
              </div>
              <div className="card-block">
                <table className="table table-bordered table-striped table-sm">
                  <thead>
                    <tr>
                      {columns}
                    </tr>
                  </thead>
                  <tbody>
                    {rows}
                  </tbody>
                </table>
                <nav>
                  <ul className="pagination">
                    {pages} 
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
        </div>
    )
  }
}

export default Pois_list;
