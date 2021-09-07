import {settings} from '../../../app/config';

let api = settings.hostURL;

const getLop = async () => {
  let res = '';

  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  await fetch(api + 'Lop/getLop.php', requestOptions)
    .then(response => response.json())
    .then(data => {
      res = data;
    })
    .catch(error => console.log('error', error));

  return res;
};

export {getLop};
