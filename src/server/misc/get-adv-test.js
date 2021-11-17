import {settings} from '../../app/config';

let api = settings.hostURL;

const getAdvTest = async MaBaiKT => {
  let resData = '';

  var data = new FormData();
  data.append('MaBaiKT', MaBaiKT);

  var requestOptions = {
    method: 'POST',
    body: data,
    redirect: 'follow',
  };

  await fetch(api + 'BaiKiemTra/get-adv-info-test.php', requestOptions)
    .then(response => response.json())
    .then(data => {
      resData = data;
    })
    .catch(error => console.log('error', error));

  return resData;
};

export {getAdvTest};
