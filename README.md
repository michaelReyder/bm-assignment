# Weather App

## Technology Used

- React / create-react-app
- Typescript
- Tailwind CSS
- shadcn (individual components)

Additionally, eslint and prettier have been added to this project for maintaining consitency with the formatting of the code, as well as following best practice rules.

### Caveat

In order to run the application locally and be able to successfully request data from openweathermap API, the requests are routed through a CORS proxy server. In order to allow requests to go through, once the application is running locally, [visit this link](https://cors-anywhere.herokuapp.com/corsdemo) and click on "Request temporary access to the demo server". A message will appear informing that access has been granted.

## Project Structure

The project has a very basic structure given the minimal set of features. The components folder contains all the visual code, and is separated into a ui folder (base shadcn components), and a custom MainView which contains the code for rendering layout and acts as the container for invoking the data fetching logic. Additionlly a component called ForecastTable is responsible for rendering the forecast weather data. Types contains definitions for data structures of cities and the normalized weather data.

Data fetching and normalization functions are defined in api/weather.

## Running Application

Prior to running the application, please create a .env file in the root folder of the project, and populate it with the following: ###`REACT_APP_OPENWEATHER_APP_ID=[YOUR_API_KEY]`

In order to run the application, please run `npm install`. Once the application has been installed, `npm start` will initialize and run the application on localhost:3000. While running npm install, there is a chance that you will encounter a warning regarding the node version you are running locally, as it pertains to a couple of the lint and prettier packages used for the development process. This warning will not impede or hinder the functionality of the application.
