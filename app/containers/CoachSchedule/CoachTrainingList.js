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

export class CoachTrainingList extends React.Component { // eslint-disable-line react/prefer-stateless-function

  shouldComponentUpdate() {
    return true;
  }

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
         <Table
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
        <TableHeaderColumn style={{fontSize:"18px",textAlign: 'center'}}>Training Session</TableHeaderColumn>
        <TableHeaderColumn style={{fontSize:"18px",textAlign: 'center'}}>Date</TableHeaderColumn>
        <TableHeaderColumn style={{fontSize:"18px",textAlign: 'center'}}>Time</TableHeaderColumn>
        <TableHeaderColumn style={{fontSize:"18px",textAlign: 'center'}}>Team</TableHeaderColumn>
        <TableHeaderColumn style={{fontSize:"18px",textAlign: 'center'}}>Location</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody 
      displayRowCheckbox={false}
      deselectOnClickaway={false}
      showRowHover={true}
    >
    {this.props.data.allTrainings.map((team, index)=>(
      <TableRow key={team.id}>
        <TableRowColumn style={{textAlign: 'center'}}>{index+1}</TableRowColumn>
        <TableRowColumn style={{textAlign: 'center'}}>
        {team.trainingDates.length > 0 ?
          team.trainingDates.map(trainingDate =>
        <div key={trainingDate.id}>{trainingDate.date}</div>) : ''}
        </TableRowColumn>
         <TableRowColumn style={{textAlign: 'center'}}>
        {team.trainingDates.length > 0 ?
          team.trainingDates.map(trainingDate =>
        <div key={trainingDate.id}>{trainingDate.date}</div>) : ''}
        </TableRowColumn>
        <TableRowColumn style={{textAlign: 'center'}}>{team.address}</TableRowColumn>
        <TableRowColumn style={{textAlign: 'center'}}>{team.address}</TableRowColumn>


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

const CoachTrainingListQuery = gql`query CoachTrainingListQuery($userId: ID!){
   allTrainings(
    filter:{
      coach:{
        user: {
        id: $userId
        }
      }
    }
  ){
    id
    dateTime
    address
    numberOfSessions
    coach{ id user{ id email firstName lastName } }
    institute{ id name }
    trainingTeams{ team{ id name } }
    trainingDates{ id date }
  }
}`

const CoachTrainingData = graphql(CoachTrainingListQuery,{
  options: {
      variables: {
        userId: userId      }
    }
  })(CoachTrainingList);

export default CoachTrainingData;
