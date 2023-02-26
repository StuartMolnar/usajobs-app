// Get the values of the input elements
let StartPositionOpenDate = ''
let EndPositionOpenDate = ''
let PositionSeries = ''
let position_title = ''
let hiring_department_code = ''
let hiring_agency_code = ''

// Generate the API query string on form submit
let submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', async function() {

  // Get the values of the input elements
  StartPositionOpenDate = document.getElementById('start_date').value;
  EndPositionOpenDate = document.getElementById('end_date').value;
  PositionSeries = document.getElementById('position_series').value;
  position_title = document.getElementById('position_title').value;
  hiring_department_code = document.getElementById('hiring_department_code').value;
  hiring_agency_code = document.getElementById('hiring_agency_code').value;

  async function validateParams(){
    return new Promise((resolve, reject) => {
      let isValid = true;
      let alertMessages = '';

      // Validate start_date input is in format 'mm-dd-yyyy'
      if (!/^\d{2}-\d{2}-\d{4}$/.test(StartPositionOpenDate)) {
        //console.log('start date validation failed')
        alertMessages += ('Please enter a valid start date in the format mm-dd-yyyy\n');
        isValid = false;
      }

      // Validate end_date input is in format 'mm-dd-yyyy' or is an empty string
      if (EndPositionOpenDate !== '' && !/^\d{2}-\d{2}-\d{4}$/.test(EndPositionOpenDate)) {
        //console.log('end date validation failed');
        alertMessages += ('Please enter a valid end date in the format mm-dd-yyyy\n');
        isValid = false;
      }


      // Validate PositionSeries input is a number containing 1-4 digits or is an empty string
      if (!/^\d{1,4}$/.test(PositionSeries)){
        if (!PositionSeries == '') {
          //console.log('position series validation failed');
          alertMessages += ('Please enter a number for position series\n');
          isValid = false;
        }
      }

      // Use default date of yesterday if none is provided
      if (EndPositionOpenDate === '') {
        try {
          // Get the current date and time in the Eastern time zone
          let dcDate = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

          // Convert the date and time string to a Date object
          dcDate = new Date(dcDate);

          // Subtract 1 day from the date
          dcDate.setDate(dcDate.getDate() - 1);

          // Format the date as a string in the "mm-dd-yyyy" format using template literals
          let formattedDate = `${dcDate.getMonth() + 1}-${dcDate.getDate()}-${dcDate.getFullYear()}`;

          // Set the value of end_date to the formatted date string
          EndPositionOpenDate = formattedDate;
        } catch (error) {
          console.error(error);
          alertMessages += ('Error getting current date\n');
          isValid = false;
        }
      }

  
      //console.log('isvalid if statement:', isValid);
      if (isValid) {
        //console.log('isvalid:', isValid);
        resolve('true');
      } else {
        //console.log('isvalid:', isValid);
        resolve(alertMessages);
      }

    });

  }

  async function buildQuery(){
    return new Promise((resolve, reject) => { 
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
      resolve(queryString.substring(1));
    });
  }

  /* fix this
     the promises are not waiting properly, 
     validation promise only logs when there is sufficient wait time for it to complete 
  */
  let validationPromise = await validateParams();
  //console.log(validationPromise);

  let queryPromise = await buildQuery();
  //console.log(queryPromise);

  Promise.all([validationPromise, queryPromise]).then((values) => {
    console.log('validation:', values[0]);
    console.log('query:', values[1]);
  })

});
  
    

  


// }



// });



  




/*
// Generate the API query string on form submit
let submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', async function() {

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
    console.log('start date regex text:', (!/^\d{2}-\d{2}-\d{4}$/.test(StartPositionOpenDate)))
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

    console.log('position series regex text:', /^\d{1,4}$/.test(PositionSeries));
    console.log('position series empty text:', PositionSeries == '');
    console.log('position series full test:', (!PositionSeries == '' && !/^\d{1,4}$/.test(PositionSeries)))
    // Validate PositionSeries input is a number containing 1-4 digits or is an empty string
    if (!PositionSeries == ''){
      if (/^\d{1,4}$/.test(PositionSeries)) {
        console.log('position series validated');
        alertMessages += ('Please enter a number for position series\n');
        isValid = false;
      }
    }

    console.log('unformatted end date:', EndPositionOpenDate)
    // Use default date of yesterday if none is provided
    if (EndPositionOpenDate === '') {

      // Get the current date and time in the Eastern time zone
      let dcDate = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

      // Convert the date and time string to a Date object
      dcDate = new Date(dcDate);

      // Subtract 1 day from the date
      dcDate.setDate(dcDate.getDate() - 1);

      // Format the date as a string in the "mm-dd-yyyy" format using template literals
      let formattedDate = `${dcDate.getMonth() + 1}-${dcDate.getDate()}-${dcDate.getFullYear()}`;

      // Set the value of end_date to the formatted date string
      EndPositionOpenDate = formattedDate;
      console.log('empty date formatted:', EndPositionOpenDate);
    }

    if (!isValid) {
      console.log('unresolved 1');
      document.getElementById('alert-messages').classList.remove('hidden');
      console.log('hidden removed');
      document.getElementById('alert-messages').innerText = alertMessages;
      console.log('alert messages posted:', alertMessages);
      console.log('StartPositionOpenDate:', StartPositionOpenDate);
      console.log('EndPositionOpenDate:', EndPositionOpenDate);
      console.log('PositionSeries:', PositionSeries);
      console.log('position_title:', position_title);
      console.log('hiring_department_code:', hiring_department_code);
      console.log('hiring_agency_code:', hiring_agency_code);
      reject(alertMessages);
    } else {
      document.getElementById('alert-messages').classList.add('hidden');
      console.log('hidden added')
      console.log('resolved 1');
      console.log('StartPositionOpenDate:', StartPositionOpenDate);
      console.log('EndPositionOpenDate:', EndPositionOpenDate);
      console.log('PositionSeries:', PositionSeries);
      console.log('position_title:', position_title);
      console.log('hiring_department_code:', hiring_department_code);
      console.log('hiring_agency_code:', hiring_agency_code);
      
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