import {settings} from '../../../app/config';

let api = settings.hostURL;

const updateSVnew = async (MaSV, TenSV, GioiTinh, DiaChi, MaLop) => {
  let res = '';

  console.log('TenSV: ', TenSV, ' GioiTinh: ', GioiTinh, ' DiaChi: ', DiaChi);

  var data = new FormData();
  data.append('MaSV', MaSV);
  data.append('TenSV', TenSV);
  data.append('GioiTinh', GioiTinh);
  data.append('DiaChi', DiaChi);
  data.append('MaLop', MaLop);

  var requestOptions = {
    method: 'POST',
    body: data,
    redirect: 'follow',
  };

  await fetch(api + 'SinhVien/updateSVnew.php', requestOptions)
    .then(response => response.json())
    .then(data => {
      res = data;
    })
    .catch(error => console.log('error', error));

  console.log('res: ', res);
  return res;
};

export {updateSVnew};
