const QUERY_STRUCTURE = 'https://usajobs-proxy.westus3.cloudapp.azure.com:8443/proxy/historicjoa?';

let StartPositionCloseDate = '';
let EndPositionCloseDate = '';
let PositionSeries = '';
let PositionTitle = '';
let HiringDepartmentCode = '';
let HiringAgencyCode = '';

// Define a variable to store the original HTML of the results div
let originalHTML = '';

// Define a function to validate user inputs
const validateInputs = (start_date, end_date, position_series, hiring_department_code, hiring_agency_code) => {
  return new Promise((resolve, reject) => {
    let isValid = true;
    let alertMessages = '';

    // Check if start_date is in the correct format of mm-dd-yyyy using a regular expression
    if (!/^\d{2}-\d{2}-\d{4}$/.test(start_date)) {
      alertMessages += ('Please enter a valid start date in the format mm-dd-yyyy\n');
      isValid = false;
    };

    // Check if end_date is in the correct format of mm-dd-yyyy using a regular expression
    // but only if it's not an empty string
    if (end_date !== '' && !/^\d{2}-\d{2}-\d{4}$/.test(end_date)) {
      alertMessages += ('Please enter a valid end date in the format mm-dd-yyyy\n');
      isValid = false;
    };

    // Check if position_series is a number with 1-4 digits using a regular expression
    // but only if it's not an empty string
    if (position_series !== '' && !/^\d{1,4}$/.test(position_series)) {
      alertMessages += ('Please enter a number with 1-4 digits for position series\n');
      isValid = false;
    };

    // Check if hiring_department_code is a 2 digit number using a regular expression
    // but only if it's not an empty string
    if (hiring_department_code !== '' && !/^\d{2}$/.test(hiring_department_code)) {
      alertMessages += ('Please enter a 2-digit number for hiring department code\n');
      isValid = false;
    };

    // Check if hiring_agency_code is a string exactly 4 characters long
    // but only if it's not an empty string
    if (hiring_agency_code !== '' && hiring_agency_code.length !== 4) {
      alertMessages += ('Please enter a string of exactly 4 characters for hiring agency code\n');
      isValid = false;
    };

    // If end_date is empty, set it to the current date minus 1 day
    if (end_date === '') {
      // Get the current date and time in the Eastern time zone
      let estDate = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

      // Convert the date and time string to a Date object
      estDate = new Date(estDate);

      // Subtract 1 day from the date
      estDate.setDate(estDate.getDate() - 1);

      // Format the date as a string in the "mm-dd-yyyy" format using template literals
      let formattedDate = `${estDate.getMonth() + 1}-${estDate.getDate()}-${estDate.getFullYear()}`;

      // Set the value of end_date to the formatted date string
      EndPositionCloseDate = formattedDate;
    };

    // Resolve the promise if all inputs are valid
    if (isValid){
      resolve();
    } else {
      // Reject the promise with an error message if any input is invalid
      reject(alertMessages);
    };
  });
};

// Define a function to build the API query string
const buildQuery = () => {
  let variables = { PositionSeries, StartPositionCloseDate, EndPositionCloseDate};

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
};

// Define a function to create a job post element
const buildJobPosting = (job) => {
  // create the main container element
  const mainContainer = document.createElement('div');
  mainContainer.className = 'flex job-posting background-selector'; // add the 'job-posting' class


  // create the left container element
  const leftContainer = document.createElement('div');
  leftContainer.className = 'flex-row flex-basis-50';

  // create the first inner element for the left container
  const innerElement1 = document.createElement('div');
  innerElement1.className = 'mx-4 my-4 w-full job-title';
  innerElement1.innerHTML = '<b>' + job.positionTitle + '</b>';

  // create the second inner element for the left container
  const innerElement2 = document.createElement('div');
  innerElement2.className = 'mx-4 my-4 w-full job-department';
  innerElement2.textContent = job.hiringDepartmentName;

  // create the third inner element for the left container
  const innerElement3 = document.createElement('div');
  innerElement3.className = 'mx-4 my-4 w-full job-agency';
  innerElement3.textContent = job.hiringAgencyName;

  // append the inner elements to the left container
  leftContainer.appendChild(innerElement1);
  leftContainer.appendChild(innerElement2);
  leftContainer.appendChild(innerElement3);

  // create the right container element
  const rightContainer = document.createElement('div');
  rightContainer.className = 'flex-row flex-basis-50';

  // create the first inner element for the right container
  const innerElement4 = document.createElement('div');
  innerElement4.className = 'mx-4 my-4 w-full job-pay-scale';
  innerElement4.textContent = 'Pay Scale: ' + job.payScale;

  // create the second inner element for the right container
  const innerElement5 = document.createElement('div');
  innerElement5.className = 'mx-4 my-4 w-full job-open-date';
  innerElement5.textContent = 'Opened: ' + job.positionOpenDate.substring(0, 10);

  // create the third inner element for the right container
  const innerElement6 = document.createElement('div');
  innerElement6.className = 'mx-4 my-4 w-full job-close-date';
  innerElement6.textContent = 'Closed: ' + job.positionCloseDate.substring(0, 10);


  // append the inner elements to the right container
  rightContainer.appendChild(innerElement4);
  rightContainer.appendChild(innerElement5);
  rightContainer.appendChild(innerElement6);

  // append the left and right containers to the main container
  mainContainer.appendChild(leftContainer);
  mainContainer.appendChild(rightContainer);

  // append the main container to the document body
  return mainContainer;

};

// Define a function to write the job postings to the page
const buildJobListings = (jobs) => {

  // Get the results container element
  const resultsContainer = document.getElementById('results');

  // Create a counter for the visible job postings
  let visibleCounter = 0;

  // iterate over the jobs array
  for (let job of jobs) {
    const jobPosting = buildJobPosting(job);

    // If the job posting is visible, increment the visible counter
    if (jobPosting.style.display !== 'none') {
      visibleCounter++;
    }

    // Add the gray-background class to every 2nd visible job posting
    if (visibleCounter % 2 === 0) {
      jobPosting.classList.add('bg-gray');
    } else {
      jobPosting.classList.remove('bg-gray');
    }

    // Append the job posting element to the results container
    resultsContainer.appendChild(jobPosting);


  }

  // Store the original HTML of the results container
  originalHTML = resultsContainer.innerHTML;

};

const filterResultsByInput = (jobs) => {

  filteredJobs = [];
  
  for (let job of jobs) {

    // Check if the department code matches the input values
    if (HiringDepartmentCode != ''){
      if (job.hiringDepartmentCode == null || !job.hiringDepartmentCode.toLowerCase().includes(HiringDepartmentCode.toLowerCase())){
        continue;
      }
    }

    // Check if the agency code matches the input values
    if (HiringAgencyCode != ''){
      if (job.hiringAgencyCode == null || !job.hiringAgencyCode.toLowerCase().includes(HiringAgencyCode.toLowerCase())){
        continue;
      }
    }

    // Check if the position title matches the input values
    if (PositionTitle != ''){
      if (job.positionTitle == null || !job.positionTitle.toLowerCase().includes(PositionTitle.toLowerCase())){
        continue;
      }
    }

    filteredJobs.push(job);
  }

  return filteredJobs;

}

// Define a function to fetch job search results from the API
const fetchResults = async (query) => {

  // Find the spinner element in the DOM and display it
  const spinner = document.getElementById('spinner');
  spinner.classList.remove('hidden');

  
  let PageSize = 1000;
  let PageNumber = 1;
  let TotalPages = null;
  document.getElementById('page-number').textContent = '(' + PageNumber + ' of ?)';
  try {
    while (true) {
      // Log a message to indicate that the API is being accessed and log the API query being executed
      console.log('accessing api...');
      console.log(QUERY_STRUCTURE + query + '&PageNumber=' + PageNumber + '&PageSize=' + PageSize);
  
      // Use the fetch() function to execute the API query and wait for the response to be returned
      const response = await fetch(QUERY_STRUCTURE + query);
  
      // Convert the response to JSON and wait for the data to be returned
      const body = await response.json();
  
  
      // Update the TotalPages variable with the total number of pages returned by the API
      TotalPages = body.paging.metadata.totalPages;
      document.getElementById('page-number').textContent = '(' + PageNumber + ' of ' + TotalPages + ')';
  
      console.log('total pages: ' + body.paging.metadata.totalPages);
      
      // Pass the job listings data to the buildJobListings function
      filteredJobs = filterResultsByInput(body.data);
      buildJobListings(filteredJobs);
  
      if (PageNumber == TotalPages) {
        break;
      }
      // Increment the page number for the next iteration of the while loop
      PageNumber++;
    }
  } catch (error){
    console.log('error: ', error);
    document.getElementById('page-number').textContent = '';
    document.getElementById('api-error-message').innerHTML = 'There was an error accessing the API. Please refresh and try again.<br>If the problem persists, please contact the administrator.';
  }

  
  document.getElementById('search-container').classList.remove('hidden');
  // Hide the spinner element when the API request is complete
  spinner.classList.add('hidden');
};

// Get a reference to the submit button and add a click event listener to it
const submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', (event) => {
  event.preventDefault(); // prevent the form from being submitted

  console.log('submit button clicked');

  document.getElementById('search-container').classList.add('hidden');
  document.getElementById('api-error-message').textContent = '';

  // Clear the results container
  document.getElementById('results').innerHTML = '';

  // Get values from the date and position series input fields
  StartPositionCloseDate = document.getElementById('start_date').value;
  EndPositionCloseDate = document.getElementById('end_date').value;
  PositionSeries = document.getElementById('position_series').value;
  PositionTitle = document.getElementById('position_title').value;
  HiringDepartmentCode = document.getElementById('hiring_department_code').value;
  HiringAgencyCode = document.getElementById('hiring_agency_code').value;

  // Call the validateInputs function first and wait for it to complete before calling the fetchResults function
  validateInputs(StartPositionCloseDate, EndPositionCloseDate, PositionSeries, HiringDepartmentCode, HiringAgencyCode)
    .then(() => {
    // Hide alert messages and call the fetchResults function to retrieve data from the API
    document.getElementById('alert-messages').classList.add('hidden');
    console.log('fetching results...')
    fetchResults(buildQuery());
    }).catch((error) => {
      console.log('error caught: ' + error);
      // Show alert messages if there is an error with the input fields
      document.getElementById('alert-messages').classList.remove('hidden');
      document.getElementById('alert-messages').innerText = error;
    });
});

// Define a function to filter job postings based on the search input
const filterResults = (query) => {
  // Get the current value of the search bar and convert to lowercase
  const searchValue = document.getElementById('search-input').value.toLowerCase();

  // If the search bar is empty, restore the original HTML
  if (searchValue === '') {
    document.getElementById('results').innerHTML = originalHTML;
    return;
  }

  // Create a counter for the visible job postings
  let visibleCounter = 0;

  // Get all the job postings and filter based on the search value
  const jobPostings = document.querySelectorAll('.job-posting');
  jobPostings.forEach((jobPosting) => {
    // Get the text content of each job posting element and convert to lowercase
    const jobTitle = jobPosting.querySelector('.job-title').textContent.toLowerCase();
    const jobDepartment = jobPosting.querySelector('.job-department').textContent.toLowerCase();
    const jobAgency = jobPosting.querySelector('.job-agency').textContent.toLowerCase();
    const jobPayScale = jobPosting.querySelector('.job-pay-scale').textContent.toLowerCase();
    const jobOpenDate = jobPosting.querySelector('.job-open-date').textContent.toLowerCase();
    const jobCloseDate = jobPosting.querySelector('.job-close-date').textContent.toLowerCase();

    if (jobTitle.includes(searchValue) || jobDepartment.includes(searchValue) || jobAgency.includes(searchValue) || jobPayScale.includes(searchValue) || jobOpenDate.includes(searchValue) || jobCloseDate.includes(searchValue)) {
      // Display the job posting if it matches the search value
      jobPosting.style.display = 'flex';
      // Add the gray-background class to every 2nd visible job posting
      if (visibleCounter % 2 === 1) {
        jobPosting.classList.add('bg-gray');
      } else {
        jobPosting.classList.remove('bg-gray');
      }
      visibleCounter++;
    } else {
      // Hide the job posting if it does not match the search value
      jobPosting.style.display = 'none';
      jobPosting.classList.remove('bg-gray');
    }
  });

  
};

// Add event listener for input event on search input element
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', filterResults); // Call the filterResults function when the input value changes

// todo: use docker-compose and nginx to run a load balancer for the server
