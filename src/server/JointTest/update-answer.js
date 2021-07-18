import {settings} from '../../app/config';

let api = settings.hostURL;

const UpdateQuestion = async (MaSV, MaCH, DASV) => {
  let res = '';

  var data = new FormData();
  data.append('MaSV', MaSV);
  data.append('MaCH', MaCH);
  data.append('DASV', DASV);

  var requestOptions = {
    method: 'POST',
    body: data,
    redirect: 'follow',
  };

  await fetch(api + 'ChiTietKQ/update-ct-kq.php', requestOptions)
    .then(response => response.json())
    .then(data => {
      res = data;
    })
    .catch(error => console.log('error', error));

  return res;
};

export {UpdateQuestion};
