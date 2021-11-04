import {settings} from '../../../app/config';

let api = settings.hostURL;

const getTestByDateHS = async (MaSV, Ngay, SoLuong, Page) => {
  let res = '';
  var data = new FormData();
  data.append('MaSV', MaSV);
  data.append('Ngay', Ngay + '');

  if (Page != undefined) {
    data.append('page', Page);
    data.append('quantity', SoLuong);
  } else if (SoLuong != undefined) data.append('SoLuong', SoLuong);

  var requestOptions = {
    method: 'POST',
    body: data,
    redirect: 'follow',
  };

  await fetch(api + 'Calen/getTestByDateHS.php', requestOptions)
    .then(response => response.json())
    .then(data => {
      res = data;
    })
    .catch(error => console.log('error', error));
  return res;
};

export {getTestByDateHS};
