import React, { Component, PropTypes } from 'react';
import {TextField} from 'redux-form-material-ui'
import RaisedButton from 'material-ui/RaisedButton'
import { reduxForm, Field } from 'redux-form'


const Form = ({handleSubmit}) => { 
        return(
         <form id='mailingList' onSubmit={handleSubmit} >
            <Field name='fullName' floatingLabelText='Enter your full name' component={TextField} />
            <Field name='email' floatingLabelText='Enter your email address' component={TextField} />
            <Field name='favouriteSport' floatingLabelText='Enter your Favourite sport' component={TextField} />
            
            
            <RaisedButton label='Submit' type='submit' primary />
         </form>
        )
}

export default reduxForm({
  form: 'mailingList'
})(Form)