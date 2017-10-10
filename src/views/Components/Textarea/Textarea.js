import React from 'react';

class Textarea extends React.Component {
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

  displayInput(type, id, inputValue, placeholder, readonly) {

      let input = <textarea readOnly={readonly} onChange={this.handleChange} id={id} name={id} rows="9" className="form-control" value={inputValue} placeholder={placeholder}></textarea>

      return input;

  }
  render() {
    
    let type = this.props.type;
    let id = this.props.id;
    let readonly = this.props.readonly;
    let inputValue = '';

    if(typeof(this.state.inputValue)!=="undefined") inputValue = this.state.inputValue;
    else inputValue = this.props.inputValue;

    if(typeof(readonly)==="undefined") readonly = false;

    let placeholder = this.props.placeholder;

    let input_code = this.displayInput(type, id, inputValue, placeholder, readonly);
    //console.log(input_code);

    return input_code;
  }
}

export default Textarea;
