import {settings} from '../../../app/config';

let api = settings.hostURL;

const updateLPH = async (MaLHP, TenLopHP, MaGV, MaMH, MaLop) => {
  let res = '';

  var data = new FormData();
  data.append('MaLopHP', MaLHP);
  data.append('TenLopHP', TenLopHP);
  data.append('MaGV', MaGV);
  data.append('MaMH', MaMH);
  data.append('MaLop', MaLop);

  var requestOptions = {
    method: 'POST',
    body: data,
    redirect: 'follow',
  };

  await fetch(api + 'LopHocPhan/updateLPH.php', requestOptions)
    .then(response => response.json())
    .then(data => {
      res = data;
    })
    .catch(error => console.log('error', error));

  return res;
};

export {updateLPH};
