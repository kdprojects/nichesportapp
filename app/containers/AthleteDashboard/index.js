/*
 *
 * AthleteDashboard
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import makeSelectAthleteDashboard from './selectors';
import H1 from 'components/H1';
import {Tabs, Tab} from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AthleteProfile from '../../containers/AthleteProfile'
import AthleteTeam from '../../containers/AthleteTeam'
import AthleteSchedule from '../../containers/AthleteSchedule'
import HomeIcon from 'material-ui/svg-icons/action/home';
import GroupWorkIcon from 'material-ui/svg-icons/action/group-work';
import CameraEnhanceIcon from 'material-ui/svg-icons/action/camera-enhance';
import UploadVideoPage from 'containers/UploadVideoPage'

const userId = localStorage.getItem('userID');

export class AthleteDashboard extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <MuiThemeProvider>
          <Tabs>
            <Tab label="Home" icon={<HomeIcon />} >
              <AthleteProfile/>
            </Tab>
            <Tab label="Team" icon={<GroupWorkIcon />}>
              <AthleteTeam />
            </Tab>
            <Tab label="Schedule" icon={<GroupWorkIcon />}>
              <AthleteSchedule />
            </Tab>
            <Tab label="Video" icon={< CameraEnhanceIcon />}>
            <UploadVideoPage userId={userId} />
            </Tab>
          </Tabs>
        </MuiThemeProvider>
      </div>
    );
  }
}

AthleteDashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  AthleteDashboard: makeSelectAthleteDashboard(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AthleteDashboard);
