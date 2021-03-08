import React from 'react';
import { actions as teamLocationActions } from '../redux/teamLocationsRedux';
import { actions as tripActions } from '../redux/tripRedux';
import { actions as locationActions } from '../redux/locationRedux';
import { connect } from 'react-redux';

/**
 * interfaces and types
 */
interface SetupComponentProps {
    getUsers: () => void;
    getMettingStatuses: () => void;
    getIsReuestVerificationCodeEnabled: () => void;
    syncAllUserLocations: () => void;
}

/**
 * A stateful component with no UI to setup data
 */
class SetupComponent extends React.Component<SetupComponentProps>
{

    /**
     * render function
     */
    render() {
        return null;
    }

    /**
     * life cycle
     */
    componentDidMount() {
        this.props.getUsers();
        // this.props.getIsReuestVerificationCodeEnabled();
        this.props.syncAllUserLocations();
    }
}

/**
 * redux config
 */
const containerActions = {
    getUsers: teamLocationActions.getUsers,
    getIsReuestVerificationCodeEnabled: tripActions.getIsReuestVerificationCodeEnabled,
    syncAllUserLocations: locationActions.syncAllUserLocations
};
export const Setup = connect(null, containerActions)(SetupComponent);