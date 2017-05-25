/*
 *
 * Athlete
 *
 */

import React, { PropTypes } from 'react';
import { graphql } from 'react-apollo';
import H3 from 'components/H3';
import CenteredSection from '../../containers/HomePage/CenteredSection';
import gql from 'graphql-tag';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

class Athlete extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
     if (this.props.data.loading) {
    return (<div>Loading</div>)
  }

  if (this.props.data.error) {
    console.log(this.props.data.error)
    return (<div>An unexpected error occurred</div>)
  }
    return (
      <CenteredSection>
        <H3>Hey , there are {this.props.data.allAthletes.length} Athletes in your account</H3>
         <Table>
    <TableHeader>
      <TableRow>
        <TableHeaderColumn>ID</TableHeaderColumn>
        <TableHeaderColumn>Country</TableHeaderColumn>
        <TableHeaderColumn>Name</TableHeaderColumn>
        <TableHeaderColumn>Email</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody>
    {this.props.data.allAthletes.map(athlete=>(
      <TableRow key={athlete.id}>
        <TableRowColumn>{athlete.id}</TableRowColumn>
        <TableRowColumn>{athlete.user.country}</TableRowColumn>
        <TableRowColumn>{athlete.user.firstName} {athlete.user.lastName}</TableRowColumn>
        <TableRowColumn>{athlete.user.email}</TableRowColumn>
      </TableRow>
      ))
    }
    </TableBody>
  </Table>
      </CenteredSection>
    );
  }
}

const AthleteQuery = gql`query AthleteQuery {
  allAthletes
  { id user{country email firstName lastName}
  }
}`

const AthleteData = graphql(AthleteQuery)(Athlete);

export default AthleteData;