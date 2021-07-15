import {settings} from '../../app/config';

let api = settings.hostURL;

const JointTest = async (MaSV, MaBaiKT) => {
  let res = '';

  var data = new FormData();
  data.append('MaSV', MaSV);
  data.append('MaBaiKT', MaBaiKT);

  var requestOptions = {
    method: 'POST',
    body: data,
    redirect: 'follow',
  };

  await fetch(api + 'ChiTietKQ/jont-test.php', requestOptions)
    .then(response => response.json())
    .then(data => {
      res = data;
      //console.log('API LOGs: jont-test: ', data);
    })
    .catch(error => console.log('error', error));

  return res;
};

export {JointTest};
