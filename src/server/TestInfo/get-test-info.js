import {settings} from '../../app/config';

let api = settings.hostURL;

export const getTestInfo = async (MaBaiKT, MaSV = -1) => {
  let res = '';

  var data = new FormData();

  data.append('MaBaiKT', MaBaiKT);
  if (MaSV != -1) {
    data.append('MaSV', MaSV);
  }

  var requestOptions = {
    method: 'POST',
    body: data,
    redirect: 'follow',
  };

  await fetch(api + 'TestingInfo/get-info.php', requestOptions)
    .then(response => response.json())
    .then(data => {
      res = data;
      //console.log('API LOGs: jont-test: ', data);
    })
    .catch(error => console.log('error', error));

  return res;
};
