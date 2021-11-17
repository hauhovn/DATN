import {settings} from '../../app/config';

let api = settings.hostURL;

const setAdvTest = async (MaBaiKT, ChoXemKetQua, TuDongKetThuc, ChoPhepVaoTre) => {
  let resData = '';

  var data = new FormData();
  data.append('MaBaiKT', MaBaiKT);
  data.append('ChoXemKetQua', ChoXemKetQua);
  data.append('TuDongKetThuc', TuDongKetThuc);
  data.append('ChoPhepVaoTre', ChoPhepVaoTre);

  var requestOptions = {
    method: 'POST',
    body: data,
    redirect: 'follow',
  };

  await fetch(api + 'BaiKiemTra/set-test.php', requestOptions)
    .then(response => response.json())
    .then(data => {
      resData = data;
    })
    .catch(error => console.log('error', error));

  return resData;
};

export {setAdvTest};
