import React, { Component } from 'react';
import Input from '../Input';
import Textarea from '../Textarea';
import Select from '../Select';

class Pois_view extends Component {
  constructor(props) {
    super(props);
    this.getConfig = this.getConfig.bind(this);
    this.getPOIModels = this.getPOIModels.bind(this);
    this.state = {};

    //document.addEventListener('mousewheel', function(){}, {passive: true});

  }

  componentWillMount() {
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
    let id = config['entity_static_ID']; //ID statico per recuperare una risorsa prestabilita, come il 118

    url = url.replace(":id",id); 

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

      if(field.type==="text" || field.type==="link" || field.type==="telnum" || field.type==="email" || field.type==="image"){ 
        input = <Input readonly={true} type={field.type} key={key} id={key} inputValue={inputValue} placeholder={field.placeholder}/>
      }else if(field.type==="textarea"){ 
        input = <Textarea readonly={true} key={key} id={key} inputValue={inputValue} placeholder={field.placeholder} />
      }else if(field.type==="select"){
        let field_options = field.options;
        input = <Select readonly={true} key={key} id={key} inputValue={inputValue} options={field_options} />
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
  render() {

    let models = this.state.models;
    let rows = [];
    let config = this.state.config;    
    let poi_type_label = '';
    let radix = '';
    let form_label = '';

    form_label = "Visualizza";

    if(models!==null && typeof(models)!=="undefined"){
      if(typeof(config)!=="undefined"){
        radix = config['radix'];
        poi_type_label = config['entity_name'];
      }

      let hospital_fields = models[radix];
      let final_radix = radix + "_";

      for(var key in hospital_fields){
        let field = hospital_fields[key];

        let model = this.getInput(field, final_radix + key);
        rows.push(model);
      }
  
      if(typeof(this.state.pdata)==="undefined") this.getPOI();
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
                <button onClick={() => { this.savePOI() }} className="btn btn-sm btn-primary"><i className="fa fa-dot-circle-o"></i> Submit</button>
                <button type="reset" className="btn btn-sm btn-danger"><i className="fa fa-ban"></i> Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Pois_view;
