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

export class CoachTeamPage extends React.Component { // eslint-disable-line react/prefer-stateless-function

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
         <Table>
    <TableHeader>
      <TableRow>
        <TableHeaderColumn>ID</TableHeaderColumn>
        <TableHeaderColumn>Name</TableHeaderColumn>
        <TableHeaderColumn>season</TableHeaderColumn>
        <TableHeaderColumn>Age Group</TableHeaderColumn>
        
        <TableHeaderColumn>totalNumberOfAthelets</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody>
    {this.props.data.allTeams.map(team=>(
      <TableRow key={team.id}>
        <TableRowColumn>{team.id}</TableRowColumn>
        <TableRowColumn>{team.name}</TableRowColumn>
        <TableRowColumn>{team.season}</TableRowColumn>
        <TableRowColumn>{team.ageGroup}</TableRowColumn>
        <TableRowColumn>{team.totalNumberOfAthelets}</TableRowColumn>

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
   allTeams(filter: {
      coach: {
        user:{
          id:"cj32wk6prqm2u01924qmn8y4r"
        }
    }
  }
   ) {
    id
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

const TeamData = graphql(TeamListQuery)(CoachTeamPage);

export default TeamData;