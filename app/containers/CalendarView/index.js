/*
 *
 * CalendarView
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import RaisedButton from 'material-ui/RaisedButton';
import CenteredSection from '../../containers/HomePage/CenteredSection';
import Notifications, {notify} from 'react-notify-toast';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {GridList, GridTile} from 'material-ui/GridList';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import localizer from 'react-big-calendar/lib/localizers/globalize';
import globalize from 'globalize';
import BigCalendar from 'react-big-calendar';
require('react-big-calendar/lib/css/react-big-calendar.css');
import Snackbar from 'material-ui/Snackbar';
import Loading from 'components/LoadingIndicator';

localizer(globalize);

const bodyStyle = {
  top: 0
};

const allViews = Object.keys(BigCalendar.views).map(k => BigCalendar.views[k])

export class CalendarView extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleSelectEvent = this.handleSelectEvent.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.state={
      eventsList: [],
      open: false,
      message: {},
      minDate: new Date()
    }
  }

  handleRequestClose () {
    this.setState({
      open: false,
    });
  }

  componentWillReceiveProps(nextProps) {
    let data = [];
    let dates = [];
    nextProps.data.allEventDates.length > 0 ?
    nextProps.data.allEventDates.map((event,index)=>{
      data.push({'title': event.matchType + ' ' + event.teamA.name + ' vs ' + event.teamB.name, 'start': new Date(event.date), 'end': new Date(event.date)})
      dates.push(new Date(event.date))
    }) : '';
    let minDate = new Date(Math.min.apply(null,dates));// to show first event by default in calendar
    this.setState({eventsList: data, minDate: minDate})
  }

  handleSelectEvent() {
    this.setState({message: arguments[0], open: true})
  }

  render() {
    if (this.props.data.loading) {
    return (<Loading />)
    }

    if (this.props.data.error) {
      console.log(this.props.data.error)
      return (<div>An unexpected error occurred</div>)
    }

    const message = this.state.message;

    return (
      this.state.eventsList.length > 0 ?
        <div>
        <Snackbar
        style={bodyStyle}
          open={this.state.open}
          message={message.start ? message.title+ ' at '+ message.start.getDate() + '/' + message.start.getMonth() + '/' + message.start.getFullYear()  + ' ' + message.start.getHours() + ':' + message.start.getMinutes() + ':' + message.start.getSeconds() : ''}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
        <BigCalendar
        selectable={true}
        popup={true}
        {...this.props}
        events={this.state.eventsList}
        onSelectEvent={this.handleSelectEvent}
        style={{height: "500px", width: "100%"}}
        views={allViews}
        defaultDate={this.state.minDate}
      /></div> : <div>No Events Available</div>
    );
  }
}

const eventDetailsQuery = gql`query eventDetailsQuery ($eventId: ID){
   allEventDates(filter: { event:{ id: $eventId } }
  )
  {
    id teamA { id name } teamB { id name } matchType date
  }
}`

const eventDetailData = graphql(eventDetailsQuery,{
  options: (props) => ({
      variables: {
        eventId: props.activeTeam.id }
    })
  })(CalendarView);

export default eventDetailData;
