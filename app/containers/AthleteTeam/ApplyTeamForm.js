import React, { Component } from 'react'
import {connect} from 'react-redux';
import {Field, reduxForm, formValueSelector} from 'redux-form/immutable';
import {RadioButton} from 'material-ui/RadioButton';
import MenuItem from 'material-ui/MenuItem';
import { createStructuredSelector } from 'reselect';
import H2 from 'components/H2';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {AutoComplete as MUIAutoComplete} from 'material-ui';
import {
  AutoComplete,
  Checkbox,
  DatePicker,
  TimePicker,
  RadioButtonGroup,
  SelectField,
  Slider,
  TextField,
  Toggle
} from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton'
import CenteredSection from '../../containers/HomePage/CenteredSection'
import { graphql, compose } from 'react-apollo'
import IconButton from 'material-ui/IconButton';
import gql from 'graphql-tag'
import SearchIcon from 'material-ui/svg-icons/action/search';
import Paper from 'material-ui/Paper';

const style = {
  height: 300,
  width: 300,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};

const errors = {}

const required = value => (value == null ? 'Required' : undefined);
// validation functions
const validate = values => {
  
  errors.search_team = required(values.search_team)
  return errors
}


class ApplyTeamForm extends Component {
  static propTypes = {
    applyTeam: React.PropTypes.func
  }

   submitSearchTeams = async () => {
    await this.props.applyTeam({variables: {search: this.props.SearchText}
                 }).then(()=>console.log('form submitted------'))
  }

  applyTeam = async (index) => {
    await this.props.applyTeam({variables: {athleteId: this.props.userData.athlete.id,
                athleteMessage: this.props.athleteMessage,
                teamId: this.props.TeamsList.allTeams[index].id}
                 }).then(()=>this.props.TeamsList)
  }

  render() {
    const {loading, error, handleSubmit, pristine, reset, submitting, userData} = this.props;
    return (
      <CenteredSection>
      <H2>
      <form onSubmit={handleSubmit}>
        <div>
          <Field
            name="search_team"
            fullWidth={true}
            component={TextField}
            hintText="Search Team"
            floatingLabelText="Search Team"
            validate={required}
          />
        </div>
        <div>
          <IconButton onTouchTap={()=>this.submitSearchTeams()} disabled={errors.search_team != null} tooltip="Search Team">
          <SearchIcon />
        </IconButton>
          <RaisedButton label="Clear" onTouchTap={reset} disabled={pristine || submitting} secondary={true} />
        </div>
      </form>
      </H2>
      {this.props.TeamsList.allTeams ? this.props.TeamsList.allTeams.map((team,index)=>(
      <Paper  style={style} zDepth={3} key={team.id}>
        <h3>Team Name: {team.name}</h3>
        <h4>
         <div>Age Group: {team.ageGroup}</div>
         <br/>
         <div>Sport: {team.sport ? team.sport.name : 'Not Available'}</div>
         <br/>
         <div>No. of Players: {team.totalNumberOfAthelets}</div>
         <br/>
         <div>Coach: {team.coach.firstName} {team.coach.lastName}</div>
        </h4>
        <div>
        <RaisedButton label="Apply" disabled={team.atheletTeams.length > 0 ? (team.atheletTeams[0].status == 'INSTITUTEPENDING' || team.atheletTeams[0].status == 'ATHELETPENDING'  ? true : false) : false} onTouchTap={()=>this.applyTeam(index)} primary={true} />
        </div>
      </Paper>)) : ''}
      </CenteredSection>
    );
  }
}

const getAllTeams = gql`query getAllTeams {
  allTeams {
    id
    atheletTeams{
      status
    }
    name
    season
    ageGroup
    totalNumberOfAthelets
    createdAt
    sport { id name }
    coach { id user { id email firstName lastName }}
    manager { id user { id email firstName lastName }}
  }
}`

const applyTeamMutation = gql`
  mutation applyTeam ($athleteId: ID, $teamId: ID){
   createAtheletTeam(
    athleteId: $athleteId
    teamId: $teamId
    athleteMessage: "Please Accept"
    status:INSTITUTEPENDING
  ) {
    id
  }
  }
`

const selector = formValueSelector('search_team_form');

ApplyTeamForm = connect(state => ({
  SearchText: selector(state, 'search_team'),
  athleteMessage: selector(state, 'athleteMessage')
}))(ApplyTeamForm);

ApplyTeamForm = reduxForm({
  form: 'search_team_form',
  validate
})(ApplyTeamForm);

const ApplyTeamFormMutation = compose(
  graphql(applyTeamMutation, {name: 'applyTeam'}),
  graphql(getAllTeams, { name: 'TeamsList' })
)(ApplyTeamForm)

export default ApplyTeamFormMutation;
