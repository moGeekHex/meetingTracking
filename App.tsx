
/**
 * realm should be called in root file
 */
import realm from './src/realm';

import React, { Component } from 'react';
import { MainApp } from './src/App';
import { Provider } from 'react-redux';
import reduxStore from './src/redux';
import { Root } from 'native-base';
import { Setup } from './src/components/Setup';

/**
 * The most root app
 */
export default class App extends Component {
  render() {
    return (
      <Provider store={reduxStore}>
        <Root>
          <MainApp />
          <Setup />
        </Root>
      </Provider>
    );
  }

}
