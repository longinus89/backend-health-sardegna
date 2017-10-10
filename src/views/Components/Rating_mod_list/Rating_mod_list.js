import React, { Component } from 'react';
import Input from '../Input';

class Rating_mod_list extends Component {
	constructor(props) {
		super(props);
		this.getList = this.getList.bind(this);
		this.getConfig = this.getConfig.bind(this);
		this.filterByKeys = this.filterByKeys.bind(this);
		this.changePage = this.changePage.bind(this);
    this.saveAnswer = this.saveAnswer.bind(this);
		this.state = {};

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

  getUrlParams(){
    let params = this.props.params;
    return params;
  }
  
  getLastParam(){
    let params= this.getUrlParams();
    let last_item = {};
    for(var pkey in params){
      last_item['key']=pkey;
      last_item['value']=params[pkey];
    }
    return last_item;
  }

	componentWillReceiveProps(nextProps) {

		let nextConfig=nextProps.route.config;

    console.log("componentWillReceiveProps");

	  this.getConfig(nextConfig, this.getList);
		
	}
	getConfig(config, callback){
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

  replaceParams(url,newParams){

    if(!newParams) newParams = [];

    let params = this.getUrlParams();  
    
    //console.log(url);

    for(var param_key in params){
      let param = params[param_key];

      if(param === "118") param = "s118";
      
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
    var get_url = config['get_url']; 

    get_url = this.replaceParams(get_url);

    //console.log(url);

    var request = new Request(get_url, {
      method: 'GET', 
      mode: 'cors', 
      redirect: 'follow',
      cache: 'no-cache'
    });

    let that = this;

    // Now use it!
    fetch(request).then(function(response) { 

      //console.log(response);

      let json = response.json();
      //console.log(json);

      return json;
    }).then(function(j) {

      //console.log(j);

      that.setState({pdata:j});
      that.forceUpdate();
    }).catch(function(error) {
        console.log(error);
    });

  }

  saveAnswer(data){

    //let code = data.code;
    //let isOk = data.isOk;

    let config = this.state.config;
    let redirectUrl = this.props.route.redirectUrl;

    let edit_url=config['edit_url'];

    //console.log("save");
  
    var request = new Request(edit_url, {
      method: 'POST', 
      mode: 'cors', 
      redirect: 'follow',
      cache: 'no-cache',
      body: JSON.stringify(data)
    });
    
    let that = this;

    // Now use it!
    fetch(request).then(function(response) {

      // Convert to JSON
      return response;
    }).then(function(j) {
       //that.props.router.push(redirectUrl);
    });

  }

  render() {

    let config = this.state.config;
    let pdata = this.state.pdata;
    let page_number = this.state.page_number;

    let rows = [];
    let page_size = 10;
    let pages = [];
    let title = "";
    //let actions = [];
    let id_prefix = "";
    //let get_url = "";

    if(typeof(page_number)==="undefined") page_number = 0;

    if(typeof(config)!=="undefined"){
      page_size = config['page_size'];
      title = config['title'];
      id_prefix = config['id_prefix'];
           
    }

    if(typeof(pdata)!=="undefined"){

      pdata = pdata['data'];


      for(var pkey in pdata){ //per ogni POI

        let min = page_number * page_size;
        let max = min + page_size;

        //console.log(pkey);
        //console.log(min);
        //console.log(max);
        //console.log("-------");

        //devo saltare tutti gli oggetti che non sono nella finestra i-esima di size == page_size
        if(pkey<min || pkey>=max) continue;

        let content = pdata[pkey];
        
        let name = content['name'];
        let fields = content['answers'];

        //console.log(fields);

        if(typeof(fields) === "undefined") continue;

        //let jsx_father = null;

        let tds = [];

        for(var column_key in config['columns']){
          if(typeof(content[column_key])!=="undefined") tds.push(<td key={this.randNumber()}>{content[column_key]}</td>);
        };

        //itero sui field e li filtro togliendo i campi non necessari
        //var field_filtered = fields.filter(this.filterByKeys);

        for(var answer_key in fields){ //per ogni risposta in answers

          tds = [];

          let answer = fields[answer_key]
          let answer_content = answer['answer'];
          let answer_code = answer['code'];
          let answer_isOk = answer['isOk'];

          //console.log("answer_isOk");
          //console.log(answer_isOk);

          let adata = {};
          adata.code = answer_code;

          tds.push(<td key={this.randNumber()}>{name}</td>);
          tds.push(<td key={this.randNumber()}>{answer_content}</td>);
          let input = <Input changeFunction={this.saveAnswer} data={adata} type={'checkbox'} id={this.randNumber()} inputValue={answer_isOk} />;
          tds.push(<td key={this.randNumber()}>{input}</td>);

          let row = <tr key={this.randNumber()}>{tds}</tr>;
          rows.push(row);

        };

        
      
        //<td><span className="badge badge-success">Active</span></td>
      }

      let number_of_pages=Math.floor(pdata.length / page_size);

      for(let i=0;i<=number_of_pages;i++){
        let page_class="page-item";
        
        if(i===page_number) page_class="page-item active";

        pages.push(<li onClick={() => { this.changePage(i) }} key={this.randNumber()} className={page_class}><a className="page-link">{i + 1}</a></li>)  
      }  
    }

    return (
        <div id={"table_mod_rating_list"} key={"table_mod_rating_list"}>
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
                      <th>Struttura</th>
                      <th>Messaggio</th>
                      <th>Pubblicato</th>
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

export default Rating_mod_list;
