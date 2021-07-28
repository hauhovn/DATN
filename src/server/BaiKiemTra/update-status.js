import {settings} from '../../app/config';

let api = settings.hostURL;

export const updateTestStatus = async (MaGV, MaBaiKT, toStatus) => {
  let res = '';

  var data = new FormData();
  data.append('MaBaiKT', MaBaiKT);
  data.append('MaGV', MaGV);
  data.append('toStatus', toStatus);

  var requestOptions = {
    method: 'POST',
    body: data,
    redirect: 'follow',
  };

  await fetch(api + 'BaiKiemTra/update-status.php', requestOptions)
    .then(response => response.json())
    .then(data => {
      res = data;
    })
    .catch(error => console.log('error', error));

  return res;
};
