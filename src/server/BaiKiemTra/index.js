import {settings} from '../../app/config';

let api = settings.hostURL;

const getTests = async (MaSV, SoLuong) => {
  let resData = '';

  var data = new FormData();
  data.append('MaSV', MaSV);
  data.append('SoLuong', SoLuong);

  var requestOptions = {
    method: 'POST',
    body: data,
    redirect: 'follow',
  };

  await fetch(api + 'BaiKiemTra/get-bai-kiem-tra.php', requestOptions)
    .then(response => response.json())
    .then(data => {
      resData = data;
    })
    .catch(error => console.log('error', error));

  return resData;
};

export {getTests};
