const QUERY_STRUCTURE = 'https://usajobs-api-proxy.westus3.cloudapp.azure.com:8443/proxy/historicjoa?';

let StartPositionOpenDate = '';
let EndPositionOpenDate = '';
let PositionSeries = '';
/*
document.getElementById('submit-button').addEventListener('click', (event) => {
  event.preventDefault();

  StartPositionOpenDate = document.getElementById('start_date').value;
  EndPositionOpenDate = document.getElementById('end_date').value;
  PositionSeries = document.getElementById('position_series').value;

  console.log(StartPositionOpenDate, EndPositionOpenDate, PositionSeries);
});
*/


// Piece 1: Validate inputs code
const validateInputs = (start_date, end_date, position_series) => {
  return new Promise((resolve, reject) => {
    // ... Your validation logic goes here
    let isValid = true;
    let alertMessages = '';

    if (!/^\d{2}-\d{2}-\d{4}$/.test(start_date)) {
      alertMessages += ('Please enter a valid start date in the format mm-dd-yyyy\n');
      isValid = false;
    }

    if (end_date !== '' && !/^\d{2}-\d{2}-\d{4}$/.test(end_date)) {
      alertMessages += ('Please enter a valid end date in the format mm-dd-yyyy\n');
      isValid = false;
    }

    if (position_series !== '' && !/^\d{1,4}$/.test(position_series)) {
      alertMessages += ('Please enter a number with 1-4 digits for position series\n');
      isValid = false;
    }

    if (EndPositionOpenDate === '') {

      // Get the current date and time in the Eastern time zone
      let estDate = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

      // Convert the date and time string to a Date object
      estDate = new Date(estDate);

      // Subtract 1 day from the date
      estDate.setDate(estDate.getDate() - 1);

      // Format the date as a string in the "mm-dd-yyyy" format using template literals
      let formattedDate = `${estDate.getMonth() + 1}-${estDate.getDate()}-${estDate.getFullYear()}`;

      // Set the value of end_date to the formatted date string
      EndPositionOpenDate = formattedDate;
    }


    if (isValid){
      resolve();
    } else {
      reject(alertMessages);
    }
    // If validation is successful, resolve the promise
    // If validation fails, reject the promise with an error message
    // reject("Validation failed");
  });
};

// Piece 2: Build query code
const buildQuery = () => {
  let variables = { StartPositionOpenDate, EndPositionOpenDate, PositionSeries};

  // Initialize a string variable to store the query string
  let queryString = '';

  // Use a for...in loop to iterate over the object properties
  for (let variableName in variables) {
    // Check if the value of the variable is not empty
    if (variables[variableName].trim() !== '') {
      // If the value is not empty, add the variable name and value to the query string
      queryString += `&${variableName}=${variables[variableName]}`;
    }
  }

  //remove the first '&' from the query string
  queryString = queryString.substring(1);

  return queryString;
  // ... Your query building logic goes here
};

const fetchResults = (query) => {
  console.log('accessing api...');

  fetch(QUERY_STRUCTURE + query)
    .then(response => {
      return(response.json());
    })/*.then(body => {

      console.log('type:', typeof(body));
      console.log('body:', body);
      console.log('data:', body.data[0])
    }
  );*/
}


const submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', () => {
  event.preventDefault();

  StartPositionOpenDate = document.getElementById('start_date').value;
  EndPositionOpenDate = document.getElementById('end_date').value;
  PositionSeries = document.getElementById('position_series').value;

  // Call Piece 1 first and wait for it to complete before calling Piece 2
  validateInputs(StartPositionOpenDate, EndPositionOpenDate, PositionSeries)
    .then(() => {
      document.getElementById('alert-messages').classList.add('hidden');
      console.log(fetchResults(buildQuery()));
    })
    .catch((error) => {
      document.getElementById('alert-messages').classList.remove('hidden');
      document.getElementById('alert-messages').innerText = error;
    });

});


/* -----------------working-------------------
// Generate the API query string on form submit
let submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', async function() {
  event.preventDefault();

  // Get the values of the input elements
  StartPositionOpenDate = document.getElementById('start_date').value;
  EndPositionOpenDate = document.getElementById('end_date').value;
  PositionSeries = document.getElementById('position_series').value;
  position_title = document.getElementById('position_title').value;
  hiring_department_code = document.getElementById('hiring_department_code').value;
  hiring_agency_code = document.getElementById('hiring_agency_code').value;

  // Create a Promise that resolves after the input validation is complete
  let inputPromise = new Promise((resolve, reject) => {
    let isValid = true;
    let alertMessages = '';
    // Validate start_date input is in format 'mm-dd-yyyy'
    if (!/^\d{2}-\d{2}-\d{4}$/.test(StartPositionOpenDate)) {
      console.log('start date validated')
      alertMessages += ('Please enter a valid start date in the format mm-dd-yyyy\n');
      isValid = false;
    }

    // Validate end_date input is in format 'mm-dd-yyyy' or is an empty string
    if (EndPositionOpenDate !== '' && !/^\d{2}-\d{2}-\d{4}$/.test(EndPositionOpenDate)) {
      alertMessages += ('Please enter a valid end date in the format mm-dd-yyyy\n');
      isValid = false;
    }

    // Validate PositionSeries input is a number containing 1-4 digits or is an empty string
    if (!PositionSeries == ''){
      if (!/^\d{1,4}$/.test(PositionSeries)) {
        console.log('position series validated');
        alertMessages += ('Please enter a number for position series\n');
        isValid = false;
      }
    }

    
    // Use default date of yesterday if none is provided
    if (EndPositionOpenDate === '') {

      // Get the current date and time in the Eastern time zone
      let estDate = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

      // Convert the date and time string to a Date object
      estDate = new Date(estDate);

      // Subtract 1 day from the date
      estDate.setDate(estDate.getDate() - 1);

      // Format the date as a string in the "mm-dd-yyyy" format using template literals
      let formattedDate = `${estDate.getMonth() + 1}-${estDate.getDate()}-${estDate.getFullYear()}`;

      // Set the value of end_date to the formatted date string
      EndPositionOpenDate = formattedDate;
    }

    if (!isValid) {
      document.getElementById('alert-messages').classList.remove('hidden');
      document.getElementById('alert-messages').innerText = alertMessages;
      reject(alertMessages);
    } else {
      document.getElementById('alert-messages').classList.add('hidden');      
      resolve();
    }
  });

  inputPromise.then(() => {

    // Create an object to store the variable names and values
    let variables = { StartPositionOpenDate, EndPositionOpenDate, PositionSeries};

    // Initialize a string variable to store the query string
    let queryString = '';

    // Use a for...in loop to iterate over the object properties
    for (let variableName in variables) {
      // Check if the value of the variable is not empty
      if (variables[variableName].trim() !== '') {
        // If the value is not empty, add the variable name and value to the query string
        queryString += `&${variableName}=${variables[variableName]}`;
      }
    }

    //remove the first '&' from the query string
    queryString = queryString.substring(1);

    console.log(queryString);

  })

});

*/



/*
let url = 'https://usajobs-api-proxy.westus3.cloudapp.azure.com:8443/proxy/historicjoa?PageSize=1&PageNumber=2&PositionSeries=2210&StartPositionOpenDate=10-01-2015&EndPositionOpenDate=09-30-2016';



console.log('accessing api...');

fetch(url)
  .then(response => {
    return response.json()
   }).then(body => {

    console.log('type:', typeof(body));
    console.log('body:', body);
    console.log('data:', body.data[0])
   }
);

*/
