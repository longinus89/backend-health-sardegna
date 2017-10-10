import React, { Component } from 'react';
import Input from '../Input';
import Textarea from '../Textarea';
import Select from '../Select';

class Pois_upsert extends Component {
  constructor(props) {
    super(props);
    this.savePOI = this.savePOI.bind(this);
    this.getConfig = this.getConfig.bind(this);
    this.getPOIModels = this.getPOIModels.bind(this);
    this.preSaveButton = this.preSaveButton.bind(this);
    this.state = {};
    this.handleBackClick = this.handleBackClick.bind(this);

    //document.addEventListener('mousewheel', function(){}, {passive: true});

  }

  componentWillMount() {

    //console.log("componentWillMount");

    let config=this.props.route.config;
    this.getConfig(config,this.getPOIModels);
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
  randNumber(min, max){
    if(!min) min=1000;
    if(!max) max=10000000000000000000000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getUrlParams(){
    let params = this.props.params;
    console.log(params);
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

  replaceParams(url,newParams){

    if(!newParams) newParams = [];

    let params = this.getUrlParams();  
    
    console.log(url);

    for(var param_key in params){
      let param = params[param_key];
      url = url.replace(":"+param_key,param); 
    }
    console.log(url);
    console.log(newParams);

    for(param_key in newParams){
      let param = newParams[param_key];
      url = url.replace(":"+param_key,param);
    }
    return url;
  }


  getPOIModels(url){

    let config = this.state.config;
    if(!url) url=config['model_url'];

    var request = new Request(url, {
      method: 'GET', 
      mode: 'cors', 
      redirect: 'follow',
      cache: 'no-cache'/*,
      headers: new Headers({
        'Content-Type': 'application/json'
      })*/
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

      //console.log("222222");

      if(j.code===200){

        let models = j.data;
        //console.log(j.data);
        that.setState({models:models});
      }else{
        //console.log("Errore "+j.code);
      }
    }).catch(function(error) {
        console.log(error);
    });

  }

  preSaveButton(){
    this.setState({isLoadingButton:true});
  }

  savePOI(){

    let form_type = this.props.route.form_type;   

    let config = this.state.config;
    let redirectUrl = this.props.route.redirectUrl;

    /*if(typeof(poi_code)==="undefined"){
      poi_code = config['entity_static_ID']; //ID statico per recuperare una risorsa prestabilita, come il 118
      if(typeof(poi_code)==="undefined") poi_code=0;
    } */

    var elements = document.getElementById("poi_form").querySelectorAll("input,select,textarea");
    var inputs = [];
    let url = '';
    let requestData = '';
    let father_code = 0;
   // console.log(elements)

    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        /* Effettuo i controlli sugli input */
        /*if (element.type === "text" && element.value === "")
            console.log("it's an empty textfield")*/

        var currentValue = element.value.trim();

        if(element.type === "text"){
          inputs.push({ key:element.name, value: currentValue });
        }else if(element.type === "file"){
          var h_elem = elements[i].name + "_hidden";
          inputs.push({ key:element.name, value: document.getElementById(h_elem).value });
        }else if(element.tagName === "SELECT"){
          inputs.push({ key:element.name, value: currentValue });
        }else if(element.tagName === "TEXTAREA"){
          inputs.push({ key:element.name, value: currentValue });
        }
    }

    //console.log(inputs);

    //console.log(models);
    if(form_type==="edit"){
      url=config['edit_url'];
      url = this.replaceParams(url); 

      requestData = {
        fields: inputs,
        type: config['radix']
      }
    }else{
      url=config['create_url'];
      url = this.replaceParams(url);

      let temp = this.getLastParam();
      console.log(temp);
      
      if(typeof(temp)!=="undefined" && Object.keys(temp).length !== 0) father_code = temp["value"];

      requestData = {
        father_code: father_code,
        fields: inputs,
        type: config['radix']
      }
    }

    if(typeof(config['entity_static_ID'])!=="undefined"){
      let newParam = {};
      newParam["id"] = config['entity_static_ID'];
      url = this.replaceParams(url,newParam);
    } 

    var request = new Request(url, {
      method: 'POST', 
      mode: 'cors', 
      redirect: 'follow',
      cache: 'no-cache',
      body: JSON.stringify(requestData)
    });
    
    let that = this;

    // Now use it!
    fetch(request).then(function(response) { 
      // Convert to JSON
      return response.json();
    }).then(function(j) {
      if(j.code===200){

        //let fields = j.data;
        //console.log(j.data);
        that.setState({isLoadingButton:false});

        redirectUrl=that.replaceParams(redirectUrl);

        that.props.router.push(redirectUrl);
      }else{
        that.setState({isLoadingButton:false});
      }
    });

  }

  handleChangeImage(evt) {
      var reader = new FileReader();
      var file = evt.target.files[0];

      evt.persist();

      reader.onload = function(upload) {
          //console.log(evt.target);
          //console.log(evt.target.id);
          //console.log(upload);
          document.getElementById(evt.target.id + "_hidden").value = upload.currentTarget.result;
          //console.log(document.getElementById(evt.target.id+"_hidden").value);

      };
      reader.readAsDataURL(file);
  }

  getPOI(){  
    let config = this.state.config;
    let url=config['get_single_url'];
    let entity_static_ID = "";
    let id_prefix=config['id_prefix'];

    if(typeof(id_prefix)==="undefined"){
      entity_static_ID = config['entity_static_ID']; //ID statico per recuperare una risorsa prestabilita, come il 118
    }
    
    if(entity_static_ID!==""){
      let newParam = {};
      newParam["id"] = entity_static_ID;
      url = this.replaceParams(url,newParam);
    }else{
      url = this.replaceParams(url);
    }  

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

        //console.log(pdata);

        that.setState({pdata:pdata});
        //that.forceUpdate();
      }else{
        //console.log("Errore "+j.code);
      }
    }).catch(function(error) {
        console.log(error);
    });
  }

  onChange(e) {
    //let input_key = e.input_key;
    this.setState({ values: e.target.value });
  }

  getInput(field,key) {

      let input = null;
      //let options = [];
      //let hidden = '';
      let inputValue = '';
      if(typeof(this.state.pdata)!=="undefined"){

        let poi_data = this.state.pdata['fields'];

        var result = poi_data.filter(function(field) {
          return field.key === key;
        });

        if(result && result.length > 0) inputValue = result[0]['value'];
      }
    
      /*let type = this.props.type;
      let key = this.props.key;
      let input_value = this.props.input_value;
      let label = this.props.label;
      let placeholder = this.props.placeholder;
      let help = this.props.help;*/

      //let key = this.randNumber();

      if(field.type==="text" || field.type==="link" || field.type==="telnum" || field.type==="email" || field.type==="image"){ 
        input = <Input type={field.type} id={key} inputValue={inputValue} placeholder={field.placeholder}/>
      }else if(field.type==="textarea"){ 
        input = <Textarea id={key} inputValue={inputValue} placeholder={field.placeholder} />
      }else if(field.type==="select"){
        let field_options = field.options;
        input = <Select id={key} inputValue={inputValue} options={field_options} />
      }else if(field.type==="complex"){
        let rows = [];
        let sub_fields = field.fields;

        for(var key_2 in sub_fields){
          let sub_field = sub_fields[key_2];
          //console.log(field);
          let sub_field_model = this.getInput(sub_field, key + "_" + key_2);
          rows.push(sub_field_model);
        }

        return (<div key={key} className="form-group row">
                  <label className="col-md-3 form-control-label" htmlFor="text-input">{field.label}</label>
                  <div className="col-md-11 offset-md-1">
                    {rows}
                  </div>
                </div>);
      }

      return (<div key={key} className="form-group row">
                    <label className="col-md-3 form-control-label" htmlFor="text-input">{field.label}</label>
                    <div className="col-md-9">
                      {input}
                      <span className="help-block">{field.help}</span>
                    </div>
                  </div>);

  }

  handleBackClick() {

    if(confirm("Sei sicuro di voler annullare? Perderai tutte le modifiche.")){
      let redirectUrl = this.props.route.redirectUrl;
      redirectUrl=this.replaceParams(redirectUrl);
      this.props.router.push(redirectUrl);
    }
  }

  render() {

    let models = this.state.models;
    let rows = [];
    let config = this.state.config;
    let isLoadingButton = this.state.isLoadingButton;    
    let poi_type_label = '';
    let radix = '';
    let form_label = '';
    let saveButton = "";
    let form_type = this.props.route.form_type;   
    let resetButton = "";
    //let id_prefix = "";
    //let father_id_prefix = "";

    //console.log(models);
    if(form_type==="edit"){
      form_label = "Modifica";
      resetButton = <button className="btn btn-sm btn-danger" onClick={ this.handleBackClick }><i className="fa fa-ban"></i> Annulla</button>;
    }else{
      form_label = "Crea";
      resetButton = <button type="reset" className="btn btn-sm btn-danger"><i className="fa fa-ban"></i> Cancella campi</button>;
    }

    if(models!==null && typeof(models)!=="undefined"){
      if(typeof(config)!=="undefined"){
        radix = config['radix'];
        poi_type_label = config['entity_name'];
        //id_prefix=config['id_prefix'];
        //father_id_prefix=config['father_id_prefix'];

      }

      let hospital_fields = models[radix];
      let final_radix = radix + "_";

      for(var key in hospital_fields){
        let field = hospital_fields[key];

        let model = this.getInput(field, final_radix + key);
        rows.push(model);
      }

      let form_type = this.props.route.form_type;   
      let buttonLable = "Crea";

      if(form_type==="edit"){
        //let id = this.props.params.id;
        if(typeof(this.state.pdata)==="undefined") this.getPOI();
        buttonLable = "Modifica";
      }

      if(isLoadingButton!=="undefined" && isLoadingButton===true){
        saveButton = <button disabled={true} className="btn btn-sm btn-primary"><i className="fa fa-refresh fa-spin"></i> {buttonLable}</button>;
        this.savePOI();
      }else{
        saveButton = <button onClick={() => { this.preSaveButton() }} className="btn btn-sm btn-primary"><i className="fa fa-dot-circle-o"></i> {buttonLable}</button>;
      }

    }

    return (
      <div className="animated fadeIn">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <strong>{form_label}</strong> {poi_type_label}
              </div>
              <div className="card-block">
                <form id="poi_form" action="" method="post" encType="multipart/form-data" className="form-horizontal">
                  {rows}
                </form>
              </div>
              <div className="card-footer">
                {saveButton}
                {resetButton}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Pois_upsert;
