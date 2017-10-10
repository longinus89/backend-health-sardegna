import React from 'react';

class Select extends React.Component {
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

  handleChange(e) {

    //console.log(e);

    this.setState({ inputValue: e.target.value });
  }

  displayInput(type, id, inputValue, options) {

      let input = '';
      //console.log(id);
      //console.log(inputValue);

      let options_elem = [];

      for(var option_key in options){
        let option = options[option_key];
        options_elem.push(<option key={option.key} value={option.key}>{option.value}</option>);
      }
      input = <select onChange={this.handleChange} value={inputValue} id={id} name={id} className="form-control">{options_elem}</select>;    

      return input;

  }
  render() {
    
    let type = this.props.type;
    let options = this.props.options;
    let id = this.props.id;
    let inputValue = '';

    if(typeof(this.state.inputValue)!=="undefined") inputValue = this.state.inputValue;
    else inputValue = this.props.inputValue;

    //let placeholder = this.props.placeholder;

    let input_code = this.displayInput(type, id, inputValue, options);
    //console.log(input_code);

    return input_code;
  }
}

export default Select;
