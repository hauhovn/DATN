import {settings} from '../../../app/config';

let api = settings.hostURL;

const updateMH = async (MaMH, TenMonHoc, SoTinChi, SoTiet) => {
  let res = '';

  var data = new FormData();
  data.append('MaMH', MaMH);
  data.append('TenMonHoc', TenMonHoc);
  data.append('SoTinChi', SoTinChi);
  data.append('SoTiet', SoTiet);

  var requestOptions = {
    method: 'POST',
    body: data,
    redirect: 'follow',
  };

  await fetch(api + 'MonHoc/updateMH.php', requestOptions)
    .then(response => response.json())
    .then(data => {
      res = data;
    })
    .catch(error => console.log('error', error));

  return res;
};

export {updateMH};
