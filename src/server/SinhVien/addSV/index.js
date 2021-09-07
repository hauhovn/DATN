import {settings} from '../../../app/config';

let api = settings.hostURL;

const createSV = async (
  TenSV,
  GioiTinh,
  DiaChi,
  SDT,
  Mail,
  Password,
  MaLop,
) => {
  let res = '';

  console.log(
    'TenSV: ',
    TenSV,
    ' GioiTinh: ',
    GioiTinh,
    ' DiaChi: ',
    DiaChi,
    ' SDT: ',
    SDT,
    ' Mail: ',
    Mail,
    ' Password: ',
    Password,
    ' MaLop: ',
    MaLop,
  );

  var data = new FormData();
  data.append('TenSV', TenSV);
  data.append('GioiTinh', GioiTinh);
  data.append('DiaChi', DiaChi);
  data.append('Password', Password);
  data.append('Mail', Mail);
  data.append('MaLop', MaLop);

  var requestOptions = {
    method: 'POST',
    body: data,
    redirect: 'follow',
  };

  await fetch(api + 'SinhVien/createSV.php', requestOptions)
    .then(response => response.json())
    .then(data => {
      res = data;
    })
    .catch(error => console.log('error', error));

  console.log('res: ', res);
  return res;
};

export {createSV};
