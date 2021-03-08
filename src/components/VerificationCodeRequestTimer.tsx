import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from '../common/Text';
import { colors } from '../theme';

/**
 * interfaces and types
 */
export interface VerificationCodeRequestTimerProps {

    /**
     * A required prop that express the start time of visit
     * in milliseconds, used for calculate estimated time
     */
    startTime: number;
    endTime: string; //00:00:00 format
    onEndTimeArrived: () => void;
}
interface VerificationCodeRequestTimerState {
    time: string
}

/**
 * A stateful component that shows an estimated time
 * from VerificationCodeRequestTimer.
 */
export class VerificationCodeRequestTimer extends React.Component<VerificationCodeRequestTimerProps, VerificationCodeRequestTimerState>{

    /**
     * locale state
     */
    state = {
        time: '00:00:00'
    };

    /**
     * locale compoennt functions
     */
    timeInterval: any;

    /**
     * render function
     */
    render() {
        return this._renderVisitTimer();
    }

    /**
     * life cycle
     */
    componentWillMount() {

        /**
         * runs an interval that execute a
         * tick function every second
         */
        this.timeInterval = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {

        /**
         * when unmount clear an interval
         */
        this._clearIntervalTimer();
    }

    /**
     * locale component functions
     */
    _renderVisitTimer = () => {
        return (
            <Text style={styles.footerText}>
                {this.state.time}
            </Text>
        );
    }

    /**
     * locale functions
     */
    tick() {

        /**
         * this function is updates a time state
         */

        //grap props
        const { startTime, endTime } = this.props;

        //constants
        const currentTime = new Date().getTime();
        const betweenDates = currentTime - startTime;
        const fullTime = this._msToTime(betweenDates);
        if (fullTime >= endTime) {
            this._clearIntervalTimer();
        }

        //assign a new full time state
        this.setState({ time: fullTime });
    }

    _clearIntervalTimer = () => {
        clearInterval(this.timeInterval);
        this.props.onEndTimeArrived();
    }

    _msToTime = (duration: number): string => {

        let seconds: any = Math.trunc((duration / 1000) % 60);
        let minutes: any = Math.trunc((duration / (1000 * 60)) % 60);
        let hours: any = Math.trunc((duration / (1000 * 60 * 60)));

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    };
}

/**
 * styles
 */
const styles = StyleSheet.create({
    footerText: {
        color: colors.light, fontSize: 16
    }
});