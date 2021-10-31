import {settings} from '../../../app/config';

let api = settings.hostURL;

const updateCD = async (MaCD, TenCD) => {
  let res = '';

  var data = new FormData();
  data.append('MaCD', MaCD);
  data.append('TenCD', TenCD);

  var requestOptions = {
    method: 'POST',
    body: data,
    redirect: 'follow',
  };

  await fetch(api + 'ChuDe/updateCD.php', requestOptions)
    .then(response => response.json())
    .then(data => {
      res = data;
    })
    .catch(error => console.log('error', error));

  return res;
};

export {updateCD};
