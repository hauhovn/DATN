import {settings} from '../../../app/config';

let api = settings.hostURL;

const deleteLop = async MaLop => {
  let res = '';

  var data = new FormData();
  data.append('MaLop', MaLop);

  var requestOptions = {
    method: 'POST',
    body: data,
    redirect: 'follow',
  };

  await fetch(api + 'Lop/deleteLop.php', requestOptions)
    .then(response => response.json())
    .then(data => {
      res = data;
    })
    .catch(error => console.log('error', error));

  return res;
};

export {deleteLop};
