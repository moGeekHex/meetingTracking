import validate from 'validate.js';
import { TextStyle, ViewStyle } from 'react-native';
import { Toast } from 'native-base';
import uuidv4 from 'uuid/v4';
import { navigationService } from '../../navigation/NavigatorService';
import { navigationRouteNames } from '../../navigation';
import { clearAllData } from '../asyncStorage';

/**
 * interfaces and types
 */
type ToastType = 'danger' | 'success' | 'warning' | undefined;

/**
 * A class that contains general utils
 */

/**
* A function to validate inputs
* and returns validation response as array
* @example
data : {password: "12345"}, constriants : 
{ password: {
   presence: true,
   length: {
     minimum: 6,
     message: "must be at least 6 characters"
   }
 }
}
* input key and constaint should be the same
* @param data 
* @param constriants 
* @public
*/
export const validateInputs = (data: object, constriants: object) => {
  const validateData = validate(data, constriants);
  return validateData;
}
//_____________________________________________________________________

/**
 * A function that shows a customizable toast
 * @param message 
 * @param textButton 
 * @param duration 
 * @param type 
 * @param style 
 * @param buttonTextStyle 
 * @param buttonStyle 
 */
export const showToast = (message: string, textButton: string | null | any,
  duration: number = 2000, type: ToastType = undefined,
  style?: TextStyle, buttonTextStyle?: TextStyle,
  buttonStyle?: ViewStyle) => {

  /**
   * The ToastType with 'undefined' means default type
   * buttonText with null means no button text
   */
  Toast.show({
    text: message,
    buttonText: textButton,
    duration: duration,
    position: 'bottom',
    type: type,
    textStyle: style,
    buttonTextStyle: buttonTextStyle,
    buttonStyle: buttonStyle
  });
}
//_____________________________________________________________________

/**
 * A function with on goal
 * generate UUID
 * @public
 */
export const generateUUID = (): string => {
  return uuidv4();
}
//_____________________________________________________________________

/**
 * A function to logout app by navigator service
 */
export const logoutFromApp = async () => {
  try {
    await clearAllData();
    navigationService.navigate(navigationRouteNames.auth);
  }
  catch (error) {
    console.log('error in logoutFromApp', error);
  }
}