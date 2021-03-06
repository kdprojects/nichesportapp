/*
 *
 * AthleteSchedule
 *
 */

import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog';
import AthleteTrainingList from './AthleteTrainingList';
import AthleteEventList from './AthleteEventList';
import AthleteUpcomingEventList from './AthleteUpcomingEventList';
import {GridList, GridTile} from 'material-ui/GridList';

const userId = localStorage.getItem('userID');

export class AthleteSchedule extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state={
      open : false
    }
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {

    return (
      
      <div>
          <br/>
           <Card>
            <CardHeader
              title="Training"
              style={{"backgroundColor":"#757575"}}
              subtitle=""
              actAsExpander={true}
              showExpandableButton={true}
            />
            <CardText expandable={true}>
              <AthleteTrainingList userId={userId} />
            </CardText>
          </Card>
          <br/>
          <Card>
            <CardHeader
              title="Event"
              style={{"backgroundColor":"#757575"}}
              subtitle=""
              actAsExpander={true}
              showExpandableButton={true}
            />
            <CardText expandable={true}>
              <AthleteEventList userId={userId} />
            </CardText>
          </Card>
          <br/>
          <Card>
            <CardHeader
              title="Upcoming Event"
              style={{"backgroundColor":"#757575"}}
              subtitle=""
              actAsExpander={true}
              showExpandableButton={true}
            />
            <CardText expandable={true}>
              <AthleteUpcomingEventList userId={userId} />
            </CardText>
          </Card>
          <br/>
      </div>
    );
  }
}

export default AthleteSchedule;
