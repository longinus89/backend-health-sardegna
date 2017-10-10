import React from 'react';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = { };

    //document.addEventListener('mousewheel', function(){}, {passive: true});

  }

  componentWillMount() {
    //let config=this.props.route.config;
    //this.getConfig(config,this.getPOIModels);
  }

  randNumber(min, max){
    if(!min) min=1000;
    if(!max) max=10000000000000000000000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  handleChange(e) {

    //console.log(e.target.checked);

    this.setState({ inputValue: e.target.value });
    if(typeof(this.props.changeFunction) !== "undefined"){
      let data = this.props.data; 
      data.value = e.target.checked;
      this.props.changeFunction(data);
      
    }
    //console.log("1111");
    //this.props.changeFunction();
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

  loadRemoteImage(filename){

    let that = this;

    fetch(filename).then(function(response){ 
      console.log(response); 
      return response.json(); 
    }).then(function(json){
       console.log(json);
       that.setState({ inputValue: json.content });
    });
  }

  removeImage(id){
    if(confirm("Vuoi cancellere l'immagine?")){
      var elem = document.getElementById(id + "_overlay_wrapper");
      elem.style["visibility"] = "hidden";
    
      var elem = document.getElementById(id + "_hidden");
      elem.value = "";

      var elem = document.getElementById(id + "_is_deleted");
      elem.value = "1";

    }


  }

  displayInput(type, id, inputValue, placeholder) {

      let input = '';
      let hidden = '';
      let preview = '';
      let overlay = '';
      let preview_wrapper = "";
      let is_deleted = "";
      let alert = "";
      //let randomKey = this.randNumber();
      //console.log(id);
      //console.log(inputValue);

      if(type==="text"){ 
        input = <input key={id} onChange={this.handleChange} type="text" id={id} name={id} value={inputValue} className="form-control" placeholder={placeholder}/>
        return input;
      }else if(type==="link"){ 
        input = <input key={id} onChange={this.handleChange} type="text" id={id} name={id} value={inputValue} className="form-control" placeholder={placeholder}/>
        return input;
      }else if(type==="number"){ 

        //console.log(inputValue);
        if(inputValue === "" || typeof(inputValue) === "undefined") inputValue = 0; 

        input = <input key={id} onChange={this.handleChange} type="number" min="0" max="1000" id={id} name={id} value={inputValue} className="form-control form-control-number" placeholder={placeholder}/>
        return input;
      }else if(type==="telnum"){ 
        input = <input key={id} onChange={this.handleChange} type="text" id={id} name={id} value={inputValue} className="form-control" placeholder={placeholder}/>
        return input;
      }else if(type==="email"){ 
        input = <input key={id} onChange={this.handleChange} type="text" id={id} name={id} value={inputValue} className="form-control" placeholder={placeholder}/>
        return input;
      }else if(type==="checkbox"){ 

        //console.log(inputValue);

        let subInput = '';

        if(inputValue === true) subInput = <input key={id} onChange={this.handleChange} id={id} name={id} type="checkbox" className="switch-input" defaultChecked={true}/>
        else subInput = <input key={id} onChange={this.handleChange}  id={id} name={id} type="checkbox" className="switch-input" />

        input =<label className="switch switch-text switch-primary">
                  {subInput}
                  <span className="switch-label" data-on="Si" data-off="No"></span>
                  <span className="switch-handle"></span>
                </label>;

        return input;
      }else if(type==="image"){ 
        
        let elements = [];

        input = <input key={id} onChange={this.handleChangeImage} type="file" id={id} name={id} />;
        hidden = <input key={id+"_h"} type="hidden" id={id + '_hidden'}  value={inputValue} name={id + '_hidden'}/>;
        if(inputValue!==null && inputValue!==""){ 
          preview = <img key={id+"_prev"} id={id+"_prev"} src={inputValue} className={'poi_image_preview'} />;
          overlay = <div key={id+"_overlay"} className='image-overlay' id={id+"_overlay"} onClick={() => this.removeImage(id)} ></div>;
          alert = <div className="image-delete-alert">Clicca per cancellare</div>
          preview_wrapper = <div key={id+"_overlay_wrapper"} id={id+"_overlay_wrapper"} className="preview_wrapper">{alert}{preview}{overlay}</div>
          is_deleted = <input key={id + "_is_deleted"} type="hidden" value="0" id={id + "_is_deleted"} name={id + "_is_deleted"} />;
        }
        elements.push(input);         
        elements.push(hidden);
        elements.push(preview_wrapper);
        elements.push(is_deleted);
        //console.log(elements);
        


        let output = <div>{elements}</div>

        return output;

      }

      

  }
  render() {
    
    let type = this.props.type;
    let id = this.props.id;
    let inputValue = '';

    if(typeof(this.state.inputValue)!=="undefined") inputValue = this.state.inputValue;
    else inputValue = this.props.inputValue;

    let placeholder = this.props.placeholder;

    let input_code = this.displayInput(type, id, inputValue, placeholder);
    if(type === "image" && inputValue !== null && inputValue !== ""){
      this.loadRemoteImage(inputValue);
    }

    //console.log(input_code);

    //console.log(typeof(input_code));

    return input_code;
  }
}

export default Input;
