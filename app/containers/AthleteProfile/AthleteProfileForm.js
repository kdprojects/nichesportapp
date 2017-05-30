import React, { Component } from 'react'
import {connect} from 'react-redux';
import {Field, reduxForm, formValueSelector} from 'redux-form/immutable';
import {RadioButton} from 'material-ui/RadioButton';
import MenuItem from 'material-ui/MenuItem';
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
import { graphql, compose } from 'react-apollo'
import IconButton from 'material-ui/IconButton';
import gql from 'graphql-tag'
import H3 from 'components/H3';
import countryList from 'components/countryList'
import timezoneList from 'components/timezoneList'
import PublishIcon from 'material-ui/svg-icons/editor/publish';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import PlusIcon from 'material-ui/svg-icons/social/plus-one';
import Avatar from 'material-ui/Avatar'
import Notifications, {notify} from 'react-notify-toast';
import EducationHistoryForm from './EducationHistoryForm'

var userId = localStorage.getItem('userID');

var genders = [{"id": 1, "value": "Male"}, {"id": 2, "value": "Female"}, {"id": 3, "value": "Other"}];
// validation functions
const errors = {}

const required = value => (value == null ? 'Required' : undefined);
const email = value =>
  (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email'
    : undefined);

const validate = values => {
  errors.firstName = required(values.firstName)
  errors.lastName = required(values.lastName)
  errors.country = required(values.country)
  errors.dob = required(values.dob)
  errors.gender = required(values.gender)
  errors.address = required(values.address)
  errors.timezone = required(values.timezone)
  errors.mobileNumber = required(values.mobileNumber)
  errors.height = required(values.height)
  errors.weight = required(values.weight)
  errors.bio = required(values.bio)
  errors.email = email(values.email || '')
  if (!values.email) {
    errors.email = 'Required'
  } else if (email(values.email)) {
    errors.email = 'Invalid Email'
  }
  return errors
}

class AthleteProfileForm extends Component {
  static propTypes = {
    updateUser: React.PropTypes.func,
    updateAthlete: React.PropTypes.func,
    updateAthleteSport: React.PropTypes.func,
    initialize: React.PropTypes.func.isRequired
  }

   submitAthleteProfileForm = async () => {
    await this.props.updateUser({variables: {firstName: this.props.firstName,
                    lastName: this.props.lastName,
                    userId: userId,
                    email: this.props.email,
                    country: this.props.country,
                    dob: this.props.dob,
                    gender: this.props.gender,
                    address: this.props.address,
                    timezone: this.props.timezone,
                    mobileNumber: this.props.mobileNumber,
                    height: parseInt(this.props.height),
                    weight: parseInt(this.props.weight),
                    bio: this.props.bio
                     }
                 }).then(()=>console.log('form submitted------'))
  }

  submitAthleteEducationForm = async () => {
    await this.props.updateAthlete({variables: {graduationName: this.props.graduationName,
                    graduationProgramLength: this.props.graduationProgramLength,
                    athleteId: this.props.userData.athlete.id,
                    graduationUniversity: this.props.graduationUniversity,
                    graduationYear: parseInt(this.props.graduationYear),
                    highSchoolName: this.props.highSchoolName,
                    highSchoolUniversity: this.props.highSchoolUniversity,
                    highSchoolYear: parseInt(this.props.highSchoolYear)
                     }
                 }).then(()=>console.log('form submitted------'))
  }

  submitSportForm = async () => {
    await this.props.updateAthleteSport({variables: {SportPlayed: this.props.SportPlayed,
                    SportYear: this.props.SportYear,
                    athleteId: this.props.userData.athlete.id,
                     }
                 }).then(()=>console.log('form submitted------'))
  }
  
  componentDidMount() {
    const { userData } = this.props;
    this.props.initialize({firstName: userData.firstName, lastName: userData.lastName, email: userData.email,
     country: userData.country, dob: userData.dob, gender: userData.gender, address: userData.address,
      mobileNumber: userData.mobileNumber, timezone: userData.timeZone, height: userData.height, weight: userData.weight, bio: userData.bio, 
      graduationName: userData.athlete.graduation, graduationProgramLength: userData.athlete.graduationProgramLength, 
      graduationUniversity: userData.athlete.graduationUniversity, graduationYear: userData.athlete.graduationYear,
      highSchoolName: userData.athlete.hightSchool, highSchoolUniversity: userData.athlete.hightSchoolUniversity, highSchoolYear: userData.athlete.hightSchoolYear })
  }
  render() {

    const { pristine, reset, submitting, sportsList, userData } = this.props;
    return (
      <form>
       <Avatar size={100} src="https://upload.wikimedia.org/wikipedia/commons/f/fc/Kapil_Dev_at_Equation_sports_auction.jpg" />
        <div>
        <IconButton tooltip="Upload Profile Picture">
          <PublishIcon />
        </IconButton>
        </div>
      <div>
      <H3>Personal Info
      <IconButton tooltip="Edit Profile Info">
          <EditIcon />
        </IconButton>
      </H3>
        <div>
          <Field
            name="firstName"
            component={TextField}
            hintText="First Name"
            floatingLabelText="First Name"
            validate={required}
          />
          <Field
            name="lastName"
            component={TextField}
            hintText="Last Name"
            floatingLabelText="Last Name"
            validate={required}
          />
        </div>
        <div>
          <Field
            name="country"
            component={SelectField}
            maxHeight={200}
            hintText="Country"
            floatingLabelText="Country"
            validate={required}
          >
            {countryList.map(country => (<MenuItem value={country[1]} primaryText={country[0]} key={country[1]} />))}
          </Field>
          <Field
            name="dob"
            component={DatePicker}
            hintText="DOB"
            floatingLabelText="DOB"
            validate={required}
          />
        </div>
         <div>
          <Field
            name="gender"
            component={SelectField}
            hintText="Gender"
            floatingLabelText="Gender"
            validate={required}
          >
            {genders.map(gender => (<MenuItem value={gender.value} primaryText={gender.value} key={gender.id} />))}
          </Field>
        </div>
        <div>
          <Field
            name="address"
            component={TextField}
            hintText="Address"
            multiLine={true}
            floatingLabelText="Address"
            validate={required}
          />
        </div>
        <div>
          <Field
            name="timezone"
            component={SelectField}
            maxHeight={200}
            autoWidth={true}
            hintText="Timezone"
            floatingLabelText="Timezone"
            validate={required}
          >
            {timezoneList.map(timezone => (<MenuItem value={timezone.text} primaryText={timezone.text} key={timezone.offset+timezone.value} />))}
          </Field>
        </div>
        <div>
          <Field
            name="email"
            component={TextField}
            hintText="Email"
            floatingLabelText="Email"
            validate={[required, email]}
          />
        </div>
        <div>
          <Field
            name="mobileNumber"
            component={TextField}
            hintText="Mobile Number"
            floatingLabelText="Mobile Number"
            validate={required}
          />
        </div>
        <div>
          <Field
            name="height"
            component={TextField}
            hintText="Height"
            floatingLabelText="Height"
            validate={required}
          />
          <Field
            name="weight"
            component={TextField}
            hintText="Weight"
            floatingLabelText="Weight"
            validate={required}
          />
        </div>
        <div>
          <Field
            name="bio"
            multiLine={true}
            component={TextField}
            hintText="Bio"
            floatingLabelText="Bio"
            validate={required}
          />
        </div>
        <a href="#">Change Password Link</a>
        <div>
          <RaisedButton label="Save" disabled={errors.email != null || errors.lastName != null || errors.email != null || errors.country != null ||
            errors.dob != null || errors.gender != null || errors.address != null || errors.timezone != null || errors.mobileNumber != null || errors.height != null || errors.weight != null || errors.bio != null } onClick={()=>this.submitAthleteProfileForm()} primary={true} />
        </div>
      </div>
      <div>
      <H3>Education History
      <IconButton tooltip="Edit Education Info">
          <EditIcon />
        </IconButton>
      </H3>
        <div>
          <Field
            name="highSchoolName"
            component={TextField}
            hintText="High School"
            floatingLabelText="High School"
            validate={required}
          />
          <Field
            name="highSchoolYear"
            component={TextField}
            hintText="Year"
            floatingLabelText="Year"
            validate={required}
          />
          <Field
            name="highSchoolUniversity"
            component={TextField}
            hintText="University"
            floatingLabelText="University"
            validate={required}
          />
           <Field
            name="highschoolLength"
            component={TextField}
            hintText="Length of Program"
            floatingLabelText="Length of Program"
            validate={required}
          />
          </div>
          <div>
          <Field
            name="graduationName"
            component={TextField}
            hintText="Graduation"
            floatingLabelText="Graduation"
            validate={required}
          />
          <Field
            name="graduationYear"
            component={TextField}
            hintText="Year"
            floatingLabelText="Year"
            validate={required}
          />
          <Field
            name="graduationUniversity"
            component={TextField}
            hintText="University"
            floatingLabelText="University"
            validate={required}
          />
           <Field
            name="graduationProgramLength"
            component={TextField}
            hintText="Length of Program"
            floatingLabelText="Length of Program"
            validate={required}
          />
          </div>
        <EducationHistoryForm athleteId={this.props.userData.athlete.id} />
          <div>
          <RaisedButton label="Save" disabled={submitting} onClick={()=>this.submitAthleteEducationForm()} primary={true} />
          </div>
      </div>
      <div>
      <H3>Main Sports
      <IconButton tooltip="Main Sports Info">
          <EditIcon />
        </IconButton>
      </H3>
        <div>
          <Field
            name="sportsPlayed"
            component={SelectField}
            hintText="What sports do you play?"
            floatingLabelText="What sports do you play?"
            validate={required}
          >
            {sportsList.map(sport => (<MenuItem value={sport.id} primaryText={sport.name} key={sport.id} />))}
          </Field>
          <Field
            name="practiceYear"
            component={DatePicker}
            hintText="Started Practicing"
            floatingLabelText="Started Practicing"
            validate={required}
          />
          </div>
           <IconButton tooltip="Add Certificates">
          <PlusIcon />
        </IconButton>
          <div>
          <RaisedButton label="Save" disabled={submitting} onClick={()=>this.submitSportForm()} primary={true} />
          <RaisedButton label="Clear" onClick={reset} disabled={pristine || submitting} secondary={true} />
          </div>
      </div>
      </form>
    );
  }
}

const selector = formValueSelector('athleteProfileForm');

AthleteProfileForm = reduxForm({
  form: 'athleteProfileForm',
  enableReinitialize: true,
  validate
})(AthleteProfileForm);

AthleteProfileForm = connect((state, ownProps) => ({  
  firstName: selector(state, 'firstName'),
  lastName: selector(state, 'lastName'),
  email: selector(state, 'email'),
  country: selector(state, 'country'),
  dob: selector(state, 'dob'),
  gender: selector(state, 'gender'),
  address: selector(state, 'address'),
  timezone: selector(state, 'timezone'),
  mobileNumber: selector(state, 'mobileNumber'),
  height: selector(state, 'height'),
  weight: selector(state, 'weight'),
  bio: selector(state, 'bio'),
  highSchoolName: selector(state, 'highSchoolName'),
  highSchoolYear: selector(state, 'highSchoolYear'),
  highSchoolUniversity: selector(state, 'highSchoolUniversity'),
  highSchoolProgramLength: selector(state, 'highSchoolLength'),
  graduationName: selector(state, 'graduationName'),
  graduationYear: selector(state, 'graduationYear'),
  graduationUniversity: selector(state, 'graduationUniversity'),
  graduationProgramLength: selector(state, 'graduationProgramLength'),
  sportPlayed: selector(state, 'sportsPlayed'),
  sportYear: selector(state, 'practiceYear'),
}))(AthleteProfileForm);



const updateProfileInfoMutation = gql`
  mutation updateUser ($userId: ID!, $firstName: String!, $lastName: String!, $country: String!, $dob: DateTime!, $gender: String!, $address: String!, $timezone: String!, $mobileNumber: String!, $height: Float!, $weight: Float!, $bio: String!) {
   updateUser(id: $userId, firstName: $firstName, lastName: $lastName, country: $country, dob: $dob, profileImage: "1212113asc2asc21as2c", gender: $gender, address: $address, timeZone: $timezone, mobileNumber: $mobileNumber, height: $height, weight: $weight, bio: $bio) {
    id
  }
  }
`

const updateEducationInfoMutation = gql`
  mutation updateAthlete ($athleteId: ID!, $graduationName: String!, $graduationYear: Int!, $graduationProgramLength: String!, $graduationUniversity: String!, $highSchoolName: String!, $highSchoolYear: Int!, $highSchoolUniversity: String! ) {
    updateAthlete(id: $athleteId, graduation: $graduationName, graduationProgramLength: $graduationProgramLength, graduationUniversity: $graduationUniversity, graduationYear: $graduationYear, hightSchool: $highSchoolName, hightSchoolUniversity: $highSchoolUniversity, hightSchoolYear: $highSchoolYear) {
    id
  }
  }
`

const updateSportInfoMutation = gql`
  mutation updateAthleteSport ($SportPlayed: ID!, $SportYear: DateTime!) {
    createAthleteSport(athleteId: "cj2vmbh2iu3lx0177iu955e6a", sportId: $SportPlayed, participateStartDate: $SportYear) {
    id
  }
  }
`

const AthleteFormMutation = compose(
  graphql(updateProfileInfoMutation, {name: 'updateUser'}),
  graphql(updateEducationInfoMutation, {name: 'updateAthlete'}),
  graphql(updateSportInfoMutation, {name: 'updateAthleteSport'})
)(AthleteProfileForm)

export default AthleteFormMutation;
