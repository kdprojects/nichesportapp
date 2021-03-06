/*
 *
 * Athlete
 *
 */

import React, { PropTypes } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Loading from 'components/LoadingIndicator';

class Athlete extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
     if (this.props.data.loading) {
    return (<Loading />)
  }

  if (this.props.data.error) {
    console.log(this.props.data.error)
    return (<div>An unexpected error occurred</div>)
  }
    return (
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
                <TableHeaderColumn style={{fontSize:"18px",textAlign: 'center'}}>ID</TableHeaderColumn>
                <TableHeaderColumn style={{fontSize:"18px",textAlign: 'center'}}>Country</TableHeaderColumn>
                <TableHeaderColumn style={{fontSize:"18px",textAlign: 'center'}}>Name</TableHeaderColumn>
                <TableHeaderColumn style={{fontSize:"18px",textAlign: 'center'}}>Email</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody 
              displayRowCheckbox={false}
              deselectOnClickaway={false}
              showRowHover={true}
              >
            {this.props.data.allAthletes.map(athlete=>(
              <TableRow key={athlete.id}>
                <TableRowColumn style={{textAlign: 'center'}}>{athlete.id}</TableRowColumn>
                <TableRowColumn style={{textAlign: 'center'}}>{athlete.user.country}</TableRowColumn>
                <TableRowColumn style={{textAlign: 'center'}}>{athlete.user.firstName} {athlete.user.lastName}</TableRowColumn>
                <TableRowColumn style={{textAlign: 'center'}}>{athlete.user.email}</TableRowColumn>
              </TableRow>
              ))
            }
            </TableBody>
        </Table>
      </div>
    );
  }
}

const AthleteQuery = gql`query AthleteQuery {
  allAthletes
  { id user{country email firstName lastName}
  }
}`

const AthleteData = graphql(AthleteQuery, {options: { pollInterval: 200000 }})(Athlete);

export default AthleteData;
