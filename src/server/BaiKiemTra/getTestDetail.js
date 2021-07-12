import {settings} from '../../app/config';

let api = settings.hostURL;

const getCTBaiKiemTra = async (MaSV, MaBaiKT) => {
  let res = '';
  var data = new FormData();
  data.append('MaSV', MaSV);
  data.append('MaBaiKT', MaBaiKT);

  var requestOptions = {
    method: 'POST',
    body: data,
    redirect: 'follow',
  };

  await fetch(api + 'BaiKiemTra/get-chi-tiet-bkt.php', requestOptions)
    .then(response => response.json())
    .then(data => {
      res = data;
    })
    .catch(error => console.log('error', error));
  return res;
};

export {getCTBaiKiemTra};
