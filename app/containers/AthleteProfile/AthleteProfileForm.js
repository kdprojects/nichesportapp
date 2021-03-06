import React, { Component } from 'react'
import {connect} from 'react-redux';
import {Field, reduxForm, formValueSelector} from 'redux-form/immutable';
import {RadioButton} from 'material-ui/RadioButton';
import MenuItem from 'material-ui/MenuItem';
import {
  DatePicker,
  SelectField,
  TextField
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
import EducationHistoryForm from './EducationHistoryForm';
import SportsCertificateForm from './SportsCertificateForm';
import {GridList, GridTile} from 'material-ui/GridList';
import Dropzone from 'react-dropzone';
import DeleteIcon from 'material-ui/svg-icons/action/delete-forever';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {removeExtraChar} from '../Global/GlobalFun';

var userId = localStorage.getItem('userID');

var genders = [{"id": 1, "value": "Male"}, {"id": 2, "value": "Female"}, {"id": 3, "value": "Other"}];
// validation functions
const errors = {};

const style = {margin: 5};

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
  errors.highSchoolName = required(values.highSchoolName)
  errors.highSchoolYear = required(values.highSchoolYear)
  errors.highSchoolUniversity = required(values.highSchoolUniversity)
  errors.highschoolLength = required(values.highschoolLength)
  errors.graduationName = required(values.graduationName)
  errors.graduationYear = required(values.graduationYear)
  errors.graduationUniversity = required(values.graduationUniversity)
  errors.graduationProgramLength = required(values.graduationProgramLength)
  errors.sportPlayed = required(values.sportPlayed)
  errors.practiceYear = required(values.practiceYear)
  return errors
}

class AthleteProfileForm extends Component {
  static propTypes = {
    updateUser: React.PropTypes.func,
    updateAthlete: React.PropTypes.func,
    updateAthleteSport: React.PropTypes.func,
    createAthleteSport: React.PropTypes.func,
    initialize: React.PropTypes.func.isRequired,
    deleteCertificate: React.PropTypes.func
  }

  constructor(props) {
    super(props);
    this.deleteProfileImage = this.deleteProfileImage.bind(this);
    this.state={
      imageUrl: this.props.userData ? this.props.userData.profileImage : '',
      imageId: '',
      athleteSports: this.props.userData.athlete.athleteSports,
      showSportsCertificateForm: false
    }
  }

  onDrop = (files) => {
    // prepare form data, use data key!
    let data = new FormData()
    data.append('data', files[0])

    // use the file endpoint
    fetch('https://api.graph.cool/file/v1/'+`${process.env.GRAPHCOOL_PROJECTID}`, {
      method: 'POST',
      body: data
    }).then(response => {
      return response.json()
    }).then(image => {
      this.setState({
        imageId: image.id,
        imageUrl: image.url,
      })
    })
    notify.show('Profile Picture Added Successfully', 'success')
  }

   submitAthleteProfileForm = async () => {
    const {imageUrl, imageId} = this.state
    await this.props.updateUser({variables: {firstName: this.props.firstName,
                    lastName: this.props.lastName,
                    userId: userId,
                    imageUrl: imageUrl,
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
                 }).then(()=>notify.show('Profile Saved Successfully', 'success')).then(()=> this.props.data.refetch()).catch((res)=>notify.show(removeExtraChar(res), 'error'))
  }

  submitAthleteEducationForm = async () => {
    await this.props.updateAthlete({variables: {graduationName: this.props.graduationName,
                    graduationProgramLength: this.props.graduationProgramLength,
                    athleteId: this.props.userData.athlete.id,
                    graduationUniversity: this.props.graduationUniversity,
                    highSchoolProgramLength: this.props.highSchoolProgramLength,
                    graduationYear: parseInt(this.props.graduationYear),
                    highSchoolName: this.props.highSchoolName,
                    highSchoolUniversity: this.props.highSchoolUniversity,
                    highSchoolYear: parseInt(this.props.highSchoolYear)
                     }
                 }).then(()=>notify.show('Education History Saved Successfully', 'success')).catch((res)=>notify.show(removeExtraChar(res), 'error'))
  }

  deleteProfileImage () {
    this.setState({
      imageUrl: '',
      imageId: ''
    })
    notify.show('Please add a new Profile Picture & Click Save in Personal Info Section', 'success')
  }

  deleteCertificate = async (certificateId) => {
    await this.props.deleteCertificate({variables: {certificateId: certificateId }
                 }).then(()=>notify.show('Certificate Deleted Successfully', 'success')).then(()=> this.props.data.refetch()).catch((res)=>notify.show(removeExtraChar(res), 'error'))
  }

  toggleSportsCertificateForm(value) {
    console.log('value', value);
      this.setState({ showSportsCertificateForm: !value })
    //this.props.VideosList.refetch();
  }

  submitSportForm = async () => {
    await this.props.userData.athlete.athleteSports.length > 0 ? this.props.updateAthleteSport({variables: {
       sportPlayedId: this.props.userData.athlete.athleteSports[this.props.userData.athlete.athleteSports.length-1].id,
       sportPlayed: this.props.sportPlayed,
                    practiceYear: this.props.practiceYear
                     }
                 }).then(()=>notify.show('Sports History Saved Successfully', 'success')).then(()=>this.props.data.refetch()).catch((res)=>notify.show(removeExtraChar(res), 'error')) :
                  this.props.createAthleteSport({variables: {
       sportPlayed: this.props.sportPlayed,
                    practiceYear: this.props.practiceYear,
                    athleteId: this.props.userData.athlete.id,
                     }
                 }).then(()=>notify.show('Sports History Saved Successfully', 'success')).then(()=>this.props.data.refetch()).catch((res)=>notify.show(removeExtraChar(res), 'error'))
  }

  componentDidMount() {
    const { userData } = this.props;
    this.props.initialize({firstName: userData.firstName, lastName: userData.lastName, email: userData.email,
     country: userData.country, dob: new Date(userData.dob), gender: userData.gender, address: userData.address,
      mobileNumber: userData.mobileNumber, timezone: userData.timeZone, height: userData.height, weight: userData.weight, bio: userData.bio,
      graduationName: userData.athlete.graduation, graduationProgramLength: userData.athlete.graduationProgramLength,
      graduationUniversity: userData.athlete.graduationUniversity, graduationYear: userData.athlete.graduationYear,
      highSchoolName: userData.athlete.hightSchool, highschoolLength: userData.athlete.hightProgramLength, highSchoolUniversity: userData.athlete.hightSchoolUniversity, highSchoolYear: userData.athlete.hightSchoolYear, sportPlayed: userData.athlete.athleteSports.length > 0 ? userData.athlete.athleteSports[userData.athlete.athleteSports.length-1].sport.id : null, practiceYear: userData.athlete.athleteSports.length > 0 ? new Date(userData.athlete.athleteSports[userData.athlete.athleteSports.length-1].participateStartDate) : null })
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={()=>this.toggleSportsCertificateForm(this.state.showSportsCertificateForm)}
      />
    ];

    const { pristine, reset, submitting, sportsList, userData } = this.props;
    return (
      <form style={{"marginBottom":"40px"}}>
      <Notifications />
      <H3>Profile Image
          </H3>
        <GridTile>
        {!this.state.imageUrl &&
          <Dropzone
            onDrop={this.onDrop}
            accept='image/*'
            multiple={false}
          >
            <div>Drop an image or click to choose</div>
          </Dropzone>}
          {this.state.imageUrl &&
             <Avatar
          src={this.state.imageUrl}
          size={200}
          style={{borderStyle: 'double'}}
        />
          }
          {this.state.imageUrl && <IconButton tooltip={'Delete Profile Image'} onTouchTap={this.deleteProfileImage}><DeleteIcon /></IconButton>}
          {this.state.imageUrl && <IconButton tooltip={'Edit Profile Image'} onTouchTap={this.deleteProfileImage}><EditIcon /></IconButton>}

        </GridTile>
      <GridList cols={1} cellHeight={90} padding={1} >
        <GridTile>
          <H3>Personal Info
          </H3>
        </GridTile>
      </GridList>
      <GridList cols={5} cellHeight={90} padding={1} >
        <GridTile></GridTile>
        <GridTile>
          <Field
            name="firstName"
            component={TextField}
            hintText="First Name"
            floatingLabelText="First Name"
            validate={required}
          />
        </GridTile>
        <GridTile>
          <Field
            name="lastName"
            component={TextField}
            hintText="Last Name"
            floatingLabelText="Last Name"
            validate={required}
          />
        </GridTile>
        <GridTile>
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
        </GridTile>
        <GridTile>
          <Field
            name="dob"
            component={DatePicker}
            hintText="DOB"
            floatingLabelText="DOB"
            validate={required}
          />
        </GridTile>
      </GridList>
      <GridList cols={5} cellHeight={90} padding={1} >
        <GridTile></GridTile>
        <GridTile>
          <Field
            name="gender"
            component={SelectField}
            hintText="Gender"
            floatingLabelText="Gender"
            validate={required}
          >
            {genders.map(gender => (<MenuItem value={gender.value} primaryText={gender.value} key={gender.id} />))}
          </Field>
        </GridTile>
        <GridTile>
          <Field
            name="address"
            component={TextField}
            hintText="Address"
            multiLine={true}
            floatingLabelText="Address"
            validate={required}
          />
        </GridTile>
        <GridTile>
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
        </GridTile>
        <GridTile>
          <Field
            name="email"
            component={TextField}
            hintText="Email"
            floatingLabelText="Email"
            validate={[required, email]}
          />
        </GridTile>
      </GridList>
      <GridList cols={5} cellHeight={90} padding={1} >
        <GridTile></GridTile>
        <GridTile>
          <Field
            name="mobileNumber"
            component={TextField}
            hintText="Mobile Number"
            floatingLabelText="Mobile Number"
            validate={required}
          />
        </GridTile>
        <GridTile>
          <Field
            name="height"
            component={TextField}
            hintText="Height"
            floatingLabelText="Height"
            validate={required}
          />
        </GridTile>
        <GridTile>
          <Field
            name="weight"
            component={TextField}
            hintText="Weight"
            floatingLabelText="Weight"
            validate={required}
          />
        </GridTile>
        <GridTile>
          <Field
            name="bio"
            multiLine={true}
            component={TextField}
            hintText="Bio"
            floatingLabelText="Bio"
            validate={required}
          />
        </GridTile>
      </GridList>
      <GridList cols={5} cellHeight={90}>
        <GridTile></GridTile>
        <GridTile style={{"paddingTop":"20px"}}>
            <RaisedButton label="Save" disabled={errors.email != null || errors.lastName != null || errors.email != null || errors.country != null ||
            errors.dob != null || errors.gender != null || errors.address != null || errors.timezone != null || errors.mobileNumber != null || errors.height != null || errors.weight != null || errors.bio != null } onClick={()=>this.submitAthleteProfileForm()} primary={true} />
          <a style={{"paddingLeft":"20px"}} href="#">Change Password</a>
        </GridTile>
      </GridList>

      <GridList cols={1} cellHeight={90} padding={1}>
        <GridTile>
        <H3>Education History
        </H3>
        </GridTile>
      </GridList>
      <GridList cols={5} cellHeight={90} padding={1}>
        <GridTile></GridTile>
        <GridTile>
          <Field
            name="highSchoolName"
            component={TextField}
            hintText="High School"
            floatingLabelText="High School"
            validate={required}
          />
        </GridTile>
        <GridTile>
          <Field
            name="highSchoolYear"
            component={TextField}
            hintText="Year"
            floatingLabelText="Year"
            validate={required}
          />
        </GridTile>
        <GridTile>
          <Field
            name="highSchoolUniversity"
            component={TextField}
            hintText="University"
            floatingLabelText="University"
            validate={required}
          />
        </GridTile>
        <GridTile>
          <Field
            name="highschoolLength"
            component={TextField}
            hintText="Length of Program"
            floatingLabelText="Length of Program"
            validate={required}
          />
        </GridTile>
      </GridList>
      <GridList cols={5} cellHeight={90} padding={1}>
        <GridTile></GridTile>
        <GridTile>
          <Field
            name="graduationName"
            component={TextField}
            hintText="Graduation"
            floatingLabelText="Graduation"
            validate={required}
          />
        </GridTile>
        <GridTile>
          <Field
            name="graduationYear"
            component={TextField}
            hintText="Year"
            floatingLabelText="Year"
            validate={required}
          />
        </GridTile>
        <GridTile>
          <Field
            name="graduationUniversity"
            component={TextField}
            hintText="University"
            floatingLabelText="University"
            validate={required}
          />
        </GridTile>
        <GridTile>
          <Field
            name="graduationProgramLength"
            component={TextField}
            hintText="Length of Program"
            floatingLabelText="Length of Program"
            validate={required}
          />
        </GridTile>
      </GridList>
      <GridList cols={5} cellHeight={90} >
        <GridTile></GridTile>
        <GridTile style={{"paddingTop":"20px"}}>
          <RaisedButton label="Save" disabled={errors.highSchoolName != null ||  errors.highSchoolYear != null ||  errors.highSchoolUniversity != null ||
           errors.highschoolLength != null || errors.graduationName != null || errors.graduationYear != null || errors.graduationUniversity != null ||
            errors.graduationProgramLength != null || submitting} onClick={()=>this.submitAthleteEducationForm()} primary={true} />
        </GridTile>
      </GridList>

      <EducationHistoryForm athleteAcademic={this.props.userData.athlete.athletAcadmic} athleteId={this.props.userData.athlete.id} />

      <GridList cols={1} cellHeight={90} padding={1}>
        <GridTile>
          <H3>Main Sports
          </H3>
        </GridTile>
      </GridList>
      <GridList cols={5} cellHeight={90} padding={1}>
        <GridTile></GridTile>
        <GridTile>
          <Field
            name="sportPlayed"
            component={SelectField}
            hintText="What sports do you play?"
            floatingLabelText="What sports do you play?"
            validate={required}
          >
            {sportsList.map(sport => (<MenuItem value={sport.id} primaryText={sport.name} key={sport.id} />))}
          </Field>
        </GridTile>
        <GridTile>
          <Field
            name="practiceYear"
            component={DatePicker}
            hintText="Started Practicing"
            floatingLabelText="Started Practicing"
            validate={required}
          />
        </GridTile>
      </GridList>
      <GridList cols={5} cellHeight={90} padding={1}>
        <GridTile></GridTile>
        <GridTile style={{"paddingTop":"20px"}}>
          <RaisedButton label="Save" disabled={errors.sportPlayed != null || errors.practiceYear != null || submitting} onClick={()=>this.submitSportForm()} primary={true} />
        </GridTile>
      </GridList>
      <GridList cols={5} cellHeight={90} padding={1} style={{"marginBottom":"-40px"}}>
      <GridTile></GridTile>
      <GridTile cols={4} >Upload multiple certificates:
        <IconButton onTouchTap={() => this.toggleSportsCertificateForm(this.state.showSportsCertificateForm)}>
          <PlusIcon />
        </IconButton>
      </GridTile>
      </GridList>
      <Dialog
                title="Add Certificate"
                autoScrollBodyContent={true}
                actions={actions}
                autoDetectWindowHeight={true}
                modal={false}
                titleStyle={{"background":"rgb(0, 188, 212)","color":"white"}}
                open={this.state.showSportsCertificateForm}
                onRequestClose={()=>this.toggleSportsCertificateForm(this.state.showSportsCertificateForm)}
              >
      <SportsCertificateForm refetchAthlete={this.props.data} toggleSportsCertificateForm={(value)=>this.toggleSportsCertificateForm(value)} athleteSportId={this.props.userData.athlete.athleteSports.length > 0 ?this.props.userData.athlete.athleteSports[this.props.userData.athlete.athleteSports.length - 1].id : ''} />
      </Dialog>
      <div style={{"margin": "50px"}}>
         <Table 
            height={"350px"}
            fixedHeader={true}
            selectable={false}
            multiSelectable={false}>
            >
          <TableHeader 
              displaySelectAll={false}
              adjustForCheckbox={false}
              enableSelectAll={false}
            >
            <TableRow>
              <TableHeaderColumn style={{fontSize:"18px",textAlign: 'center'}}>Certificate Url</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody 
              displayRowCheckbox={false}
              deselectOnClickaway={false}
              showRowHover={true}
              >
            <TableRow>
              <TableRowColumn style={{textAlign: 'center'}}>
              {this.props.userData.athlete.athleteSports.length > 0 ? this.props.userData.athlete.athleteSports[this.props.userData.athlete.athleteSports.length-1].athleteAcadmicCertificates.map((certificate, index)=> (
                <div key={certificate.id}><a target="_blank" href={certificate.url}>{certificate.url}</a>
                  <IconButton tooltip={'Delete Certificate'} onTouchTap={() => this.deleteCertificate(certificate.id)}><DeleteIcon /></IconButton>
                </div>
              ))
              : 'No certificates Available, Please Upload'}
              </TableRowColumn>
            </TableRow>
            ))
          </TableBody>
        </Table>
      </div>
      </form>
    );
  }
}

const selector = formValueSelector('athleteProfileDetailsForm');

AthleteProfileForm = reduxForm({
  form: 'athleteProfileDetailsForm',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
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
  highSchoolProgramLength: selector(state, 'highschoolLength'),
  graduationName: selector(state, 'graduationName'),
  graduationYear: selector(state, 'graduationYear'),
  graduationUniversity: selector(state, 'graduationUniversity'),
  graduationProgramLength: selector(state, 'graduationProgramLength'),
  sportPlayed: selector(state, 'sportPlayed'),
  practiceYear: selector(state, 'practiceYear'),
}))(AthleteProfileForm);



const updateProfileInfoMutation = gql`
  mutation updateUser ($userId: ID!, $firstName: String, $lastName: String, $country: String, $dob: DateTime, $gender: String, $address: String, $timezone: String, $mobileNumber: String, $height: Float, $weight: Float, $bio: String, $imageUrl: String) {
   updateUser(id: $userId, firstName: $firstName, lastName: $lastName, country: $country, dob: $dob, profileImage: $imageUrl, gender: $gender, address: $address, timeZone: $timezone, mobileNumber: $mobileNumber, height: $height, weight: $weight, bio: $bio) {
    id
  }
  }
`

const updateEducationInfoMutation = gql`
  mutation updateAthlete ($athleteId: ID!, $graduationName: String, $graduationYear: Int, $graduationProgramLength: String, $highSchoolProgramLength: String $graduationUniversity: String, $highSchoolName: String, $highSchoolYear: Int, $highSchoolUniversity: String ) {
    updateAthlete(id: $athleteId, graduation: $graduationName, graduationProgramLength: $graduationProgramLength, hightProgramLength: $highSchoolProgramLength, graduationUniversity: $graduationUniversity, graduationYear: $graduationYear, hightSchool: $highSchoolName, hightSchoolUniversity: $highSchoolUniversity, hightSchoolYear: $highSchoolYear) {
    id
  }
  }
`

const updateSportInfoMutation = gql`
  mutation updateAthleteSport ($sportPlayedId: ID!, $sportPlayed: ID!, $practiceYear: DateTime!) {
    updateAthleteSport(id: $sportPlayedId, sportId: $sportPlayed, participateStartDate: $practiceYear) {
    id
  }
  }
`


const createSportInfoMutation = gql`
  mutation createAthleteSport ($sportPlayed: ID!, $practiceYear: DateTime!, $athleteId: ID!) {
    createAthleteSport(athleteId: $athleteId, sportId: $sportPlayed, participateStartDate: $practiceYear) {
    id
  }
  }
`

const deleteSportCertificate = gql`
  mutation deleteAthleteCertificate ($certificateId: ID!) {
    deleteAthleteAcadmicCertificate(id: $certificateId) {
    id
  }
  }
`

const AthleteFormMutation = compose(
  graphql(updateProfileInfoMutation, {name: 'updateUser'}),
  graphql(updateEducationInfoMutation, {name: 'updateAthlete'}),
  graphql(createSportInfoMutation, {name: 'createAthleteSport'}),
  graphql(updateSportInfoMutation, {name: 'updateAthleteSport'}),
  graphql(deleteSportCertificate, {name: 'deleteCertificate'})
)(AthleteProfileForm)

export default AthleteFormMutation;
