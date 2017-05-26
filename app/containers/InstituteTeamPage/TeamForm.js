import React, { Component } from 'react'
import {connect} from 'react-redux';
import {Field, reduxForm, formValueSelector} from 'redux-form/immutable';
import {RadioButton} from 'material-ui/RadioButton';
import MenuItem from 'material-ui/MenuItem';
import { createStructuredSelector } from 'reselect';
import { createInstitute } from '../DashboardPage/actions';
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
import gql from 'graphql-tag'
import Notifications, {notify} from 'react-notify-toast';


var userID = localStorage.getItem('userID');

var age = [{"id": 1, "value": "Under 15"}, {"id": 2, "value": "Under 18"}, {"id": 3, "value": "20+"}];
var players = [{"id": 1, "value": "Jhon"}, {"id": 2, "value": "Marko"}, {"id": 3, "value": "Feder"}];
// validation functions
const required = value => (value == null ? 'Required' : undefined);

class TeamForm extends Component {
  static propTypes = {
    createTeam: React.PropTypes.func
  }

  submitTeamForm = async () => {
    //const {description, imageUrl} = this.state
    await this.props.createTeam({variables: {name: this.props.TeamName,
                    ageGroup: this.props.AgeGroup,
                   instituteId: userID,
                   teamSport: this.props.TeamSport,
                   playerCount: parseInt(this.props.PlayersCount),
                   teamCoach: this.props.TeamCoach
                    }
                 }).then(()=>location.reload()).catch((res)=>notify.show(JSON.stringify(res.message), 'error'))
  }

  componentWillMount() {
    this.props.GetCoachListQuery;
    this.props.GetSportsQuery;
  }

  render() {
    const {loading, error, repos, handleSubmit, pristine, reset, submitting} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <Field
            name="team_name"
            component={TextField}
            hintText="Team Name"
            floatingLabelText="Team Name"
            validate={required}
          />
        </div>
        <div>
          <Field
            name="age_group"
            component={SelectField}
            hintText="Age Group"
            floatingLabelText="Age Group"
            validate={required}
          >
            {age.map(agemapping => (<MenuItem value={agemapping.value} primaryText={agemapping.value} key={agemapping.id} />))}
          </Field>
        </div>
        {this.props.SportsList.allSports ? <div>
                          <Field
                            name="team_sport"
                            component={SelectField}
                            hintText="Sport"
                            floatingLabelText="Sport"
                            validate={required}
                          >
                            {this.props.SportsList.allSports.map(sport => (<MenuItem value={sport.id} primaryText={sport.name} key={sport.id} />))}
                          </Field>
                        </div>
                :""}
        <div>
          <Field
            name="players_count"
            component={TextField}
            hintText="No. of Players"
            floatingLabelText="No. of Players"
            validate={required}
          />
        </div>
        {players ? <div>
                          <Field
                            name="team_players"
                            multiple={true}
                            component={SelectField}
                            hintText="Add Players"
                            floatingLabelText="Add Players"
                            validate={required}>
                            {players.map(sport => (<MenuItem value={sport.value} primaryText={sport.value} key={sport.id} />))}
                          </Field>
                        </div>
                :""}
        {this.props.CoachList.allCoaches ? <div>
                          <Field
                            name="team_coach"
                            component={SelectField}
                            hintText="Assign Coach"
                            floatingLabelText="Assign Coach"
                            validate={required}
                          >
                            {this.props.CoachList.allCoaches.map(coach => (<MenuItem value={coach.id} primaryText={coach.user.firstName} key={coach.id} />))}
                          </Field>
                        </div>
                :""}
        <div>
          <RaisedButton label="Submit" disabled={submitting} onClick={()=>this.submitTeamForm()} primary={true} />
          <RaisedButton label="Clear" onClick={reset} disabled={pristine || submitting} secondary={true} />
        </div>
      </form>
    );
  }
}

const selector = formValueSelector('team_form');

TeamForm = connect(state => ({
  TeamName: selector(state, 'team_name'),
  AgeGroup: selector(state, 'age_group'),
  TeamSport: selector(state, 'team_sport'),
  PlayersCount: selector(state, 'players_count'),
  TeamPlayers: selector(state, 'team_players'),
  TeamCoach: selector(state, 'team_coach'),
}))(TeamForm);

TeamForm = reduxForm({
  form: 'team_form',
})(TeamForm);


TeamForm.propTypes = {
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  coach: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  onSubmitForm: React.PropTypes.func,
};

const addMutation = gql`
  mutation createTeam ($name: String!, $teamSport: ID!, $teamCoach: ID!, $playerCount: Int!) {
   createTeam(instituteId: $instituteId, sportId: $teamSport, coachId: $teamCoach, managerId: "cj32whu1xpomj01800euaosy8", name: $name, season: 2015, ageGroup: 5, totalNumberOfAthelets: $playerCount) {
    id
  }
  }
`
const GetCoachListQuery = gql`query GetCoachListQuery {
  allCoaches(filter: {institute: {id: "cj32wbdg7mg3a01460zdkcxoi"}}) {
    id
    user { id email firstName lastName }
  }
}`

const GetSportsQuery = gql`query GetSportsQuery {
  allSports {
    id
    name
  }
}`

const TeamFormMutation = compose(
  graphql(addMutation, {name: 'createTeam'}),
  graphql(GetCoachListQuery, {name: 'CoachList'}),
  graphql(GetSportsQuery, {name: 'SportsList'})
)(TeamForm)

export default TeamFormMutation;
