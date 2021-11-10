import {settings} from '../../../app/config';

let api = settings.hostURL;

const doneLPH = async MaLHP => {
  let res = '';

  var data = new FormData();
  data.append('MaLopHP', MaLHP);

  var requestOptions = {
    method: 'POST',
    body: data,
    redirect: 'follow',
  };

  await fetch(api + 'LopHocPhan/doneLPH.php', requestOptions)
    .then(response => response.json())
    .then(data => {
      res = data;
    })
    .catch(error => console.log('error', error));

  return res;
};

export {doneLPH};
