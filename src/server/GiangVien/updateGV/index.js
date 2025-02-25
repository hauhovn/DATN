import {settings} from '../../../app/config';

let api = settings.hostURL;

const updateGVnew = async (
  MaGV,
  TenGV,
  GioiTinh,
  DiaChi,
  isAdmin,
  TrangThai,
) => {
  let res = '';

  console.log(
    'TenGV: ',
    TenGV,
    ' GioiTinh: ',
    GioiTinh,
    ' DiaChi: ',
    DiaChi,
    ' isAdmin: ',
    isAdmin,
  );

  var data = new FormData();
  data.append('MaGV', MaGV);
  data.append('TenGV', TenGV);
  data.append('GioiTinh', GioiTinh);
  data.append('DiaChi', DiaChi);
  data.append('isAdmin', isAdmin);
  data.append('TrangThai', TrangThai);

  var requestOptions = {
    method: 'POST',
    body: data,
    redirect: 'follow',
  };

  await fetch(api + 'GiangVien/updateGVnew.php', requestOptions)
    .then(response => response.json())
    .then(data => {
      res = data;
    })
    .catch(error => console.log('error', error));

  console.log('res: ', res);
  return res;
};

export {updateGVnew};
