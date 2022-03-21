# Booking

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Accessibility

### Combobox

The Pick-up Location field is complient with the Aria 1.1 Combobox design pattern.

### Reduced Animations

Animations are reduced/removed when user activates the Reduce Motion option in the accessibility menu on the Operating System.

### Forced colors for high contrast

Styles were tweaked for when user activates the High Contrast option in the accessibility menu on the Operating System.

### Compatible with Right-to-Left written languages

The layout is compatible with Right-to-Left written languages. This can be viewed by changing the `dir` attribute in the `<html>` tag from "*ltr*" to "**rtl**".

### Font-sizes

Font sizes are scalabe and responds to the user's preferences set in the browser preferences.

## Performance

### White page

To avoid a white page while the javascript file is being loaded and parsed, the header area of the application is written staticly in the index.html file. Only the form itself is dynamically rendered using javascript. This brings the benefit of improved perceived performance to the user, especially users on slow devices and/or slow connections.

### Throttled network requests

As a side effect of typing in the Pick-Up Location field, a request is done to the autocomplete service. To avoid multiple requests for each character input in the field, there is a cool-off period 600ms before the next request to ensure the player is done typing.