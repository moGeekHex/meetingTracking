/**
 * A .ts file that contains navigation constnats
 * such as route names and types
 */

/**
 * The navigation route names and their types
 */
export const navigationRouteNames = {
  'app': 'app',
  'auth': 'auth',
  'mettings': 'mettings',
  'map': 'map',
  'MettingDetails': 'MettingDetails',
  'ConfirmationTrip': 'ConfirmationTrip',
  'loading': 'loading',
  'newMetting': 'newMetting',
  'filtersModal': 'filtersModal',
  'menu': 'menu',
  'tabNavigators': {
    'menuTab': 'menuTab',
    'searchTab': 'searchTab',
    'notificationsTab': 'notificationsTab',
    'unitsAvailabilityTab': 'unitsAvailabilityTab',
    'mettingsTab': 'mettingsTab',
    'locationsTab': 'locationsTab'
  }
};

export type NavigationRouteNames = keyof typeof navigationRouteNames;
