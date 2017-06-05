import React from 'react';
import H3 from 'components/H3';
import RaisedButton from 'material-ui/RaisedButton'
import CenteredSection from '../../containers/HomePage/CenteredSection';
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

export class CoachEventsList extends React.Component { // eslint-disable-line react/prefer-stateless-function

  shouldComponentUpdate() {
    return true;
  }

  render() {
    console.log('in coach team page----------');
      if (this.props.data.loading) {
    return (<div>Loading</div>)
  }

  if (this.props.data.error) {
    console.log(this.props.data.error)
    return (<div>An unexpected error occurred</div>)
  }
    return (
      <CenteredSection>
         <Table >
    <TableHeader displaySelectAll= {false} >
      <TableRow >
        <TableHeaderColumn >Name</TableHeaderColumn>
        <TableHeaderColumn>address</TableHeaderColumn>
        <TableHeaderColumn>Start Date</TableHeaderColumn>        
      </TableRow>
    </TableHeader>
    <TableBody displayRowCheckbox={false}>
    {this.props.data.allEvents.map((team, index)=>(
      <TableRow key={index+1} >
        <TableRowColumn>{index+1}. {team.name}</TableRowColumn>
        <TableRowColumn>{team.address}</TableRowColumn>
        <TableRowColumn>{team.startDate}</TableRowColumn>

      </TableRow>
      ))
    }
    </TableBody>
  </Table>
      </CenteredSection>
    );
  }
}

const userId = localStorage.getItem('userID');
console.log("userId",userId)
const TeamListQuery = gql`query TeamListQuery{
   allEvents(
    filter:{
      coach:{
        id:"cj32wk6prqm2v01929uytsrez"
      }
                }
  )
  {
    name
    institute{ id owner{ id email firstName lastName } }
    sport{ id name }
    numberOfFixtures
    numberOfTeams
    numberOfMatches
    address
    startDate
    endDate
    time
    coach{ id user{ id email firstName lastName } }
    type
  }
}`

const TeamData = graphql(TeamListQuery)(CoachEventsList);

export default TeamData;
