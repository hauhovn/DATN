import {settings} from '../../app/config';

let api = settings.hostURL;

const addQuestionDetail = async (MaCH, MaBaiKT) => {
  let res = '';

  var data = new FormData();
  data.append('MaCH', MaCH);
  data.append('MaBaiKT', MaBaiKT);

  var requestOptions = {
    method: 'POST',
    body: data,
    redirect: 'follow',
  };

  await fetch(api + 'ChiTietBaiKiemTra/addQuestionDetai.php', requestOptions)
    .then(response => response.json())
    .then(data => {
      res = data;
    })
    .catch(error => console.log('error', error));

  return res;
};

export {addQuestionDetail};
