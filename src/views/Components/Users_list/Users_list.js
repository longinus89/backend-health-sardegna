import React, { Component } from 'react';

class Users_list extends Component {
	constructor(props) {
		super(props);
		this.getList = this.getList.bind(this);
		this.getConfig = this.getConfig.bind(this);
		this.filterByKeys = this.filterByKeys.bind(this);
		this.changePage = this.changePage.bind(this);
    this.export_table_to_csv = this.export_table_to_csv.bind(this);
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

  download_csv(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV FILE
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Make sure that the link is not displayed
    downloadLink.style.display = "none";

    // Add the link to your DOM
    document.body.appendChild(downloadLink);

    // Lanzamos
    downloadLink.click();
}

  export_table_to_csv() {
    
    console.log("export_table_to_csv");

    var filename = "table.csv";
    var csv = [];
    var rows = document.querySelectorAll("table tr");

      for (var i = 0; i < rows.length; i++) {
      var row = [], cols = rows[i].querySelectorAll("td, th");
      
          for (var j = 0; j < cols.length; j++) 
              row.push(cols[j].innerText);
          
      csv.push(row.join(","));    
    }

    // Download CSV
    this.download_csv(csv.join("\n"), filename);
  }

  convertDate(newDateString){
    let date = new Date(newDateString);
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let dt = date.getDate();

    let hour = date.getHours();
    let minute = date.getMinutes();


    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }

    if (hour < 10) {
      hour = '0' + hour;
    }

    if (minute < 10) {
      minute = '0' + minute;
    }    

    return dt+"/"+month+"/"+year+" "+hour+":"+minute;
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
    let export_button_text = "";

    let radix = "user"
    let id_prefix = "";

    if(typeof(page_number)==="undefined") page_number = 0;

    if(typeof(config)!=="undefined"){
      page_size = config['page_size'];
      title = config['title'];
      //add_button_text = config['add_button_text'];

      export_button_text = config['export_button_text'];
      //add_button_url = this.replaceParams(add_button_url); 

      let configColumns = config['columns'];

      columns.push(<th key={this.randNumber()}>{configColumns['nickname']['label']}</th>);
      columns.push(<th key={this.randNumber()}>{configColumns['given_name']['label']}</th>);
      columns.push(<th key={this.randNumber()}>{configColumns['family_name']['label']}</th>);
      columns.push(<th key={this.randNumber()}>{configColumns['email']['label']}</th>);
      columns.push(<th key={this.randNumber()}>{configColumns['email_verified']['label']}</th>);
      columns.push(<th key={this.randNumber()}>{configColumns['created_at']['label']}</th>);
    }

    //console.log(columns);

    if(typeof(pdata)!=="undefined"){

      //console.log(pdata);

      //let poi_data = pdata['pois'];
      //let father = pdata['father'];

      //console.log(pdata);

      for(var pkey in pdata){

        let min = page_number * page_size;
        let max = min + page_size;

        //console.log(pkey);
        //console.log(min);
        //console.log(max);
        //console.log("-------");

        //devo saltare tutti gli oggetti che non sono nella finestra i-esima di size == page_size
        if(pkey<min || pkey>=max) continue;

        let content = pdata[pkey];

        let content_attributes = content['Attributes'];
        let email_verified = content_attributes[1]["Value"];
        let nickname = content_attributes[2]["Value"];
        let given_name = content_attributes[3]["Value"];
        let family_name = content_attributes[4]["Value"];
        let email = content_attributes[5]["Value"];

        let content_enabled = content['Enabled'];
        let content_user_createDate = content['UserCreateDate'];

        content_user_createDate = this.convertDate(content_user_createDate);

        let fields = content['fields'];
        let row_code = content['code'];

        let tds = [];

        tds.push(<td key={this.randNumber()}>{nickname}</td>);
        tds.push(<td key={this.randNumber()}>{given_name}</td>);
        tds.push(<td key={this.randNumber()}>{family_name}</td>);
        tds.push(<td key={this.randNumber()}>{email}</td>);
        
        let translate_email_verified = "";

        if(email_verified) translate_email_verified = "Si";
        else translate_email_verified = "No";

        tds.push(<td key={this.randNumber()}>{translate_email_verified}</td>);
        tds.push(<td key={this.randNumber()}>{content_user_createDate}</td>);
        
        let row = <tr key={this.randNumber()}>{tds}</tr>;
        rows.push(row);
      
        //<td><span className="badge badge-success">Active</span></td>
      }

      let number_of_pages=Math.floor((pdata.length - 1) / page_size);

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
            <button type="button" className="btn btn-export btn-primary" onClick={this.export_table_to_csv}>{export_button_text}</button>
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

export default Users_list;
