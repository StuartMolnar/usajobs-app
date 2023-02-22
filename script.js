let url = 'https://usajobs-cors-proxy.westus3.cloudapp.azure.com:443/proxy/historicjoa?PageSize=1000&PageNumber=2&PositionSeries=2210&StartPositionOpenDate=10-01-2015&EndPositionOpenDate=09-30-2016';

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