import { settings } from '../../../app/config';

let api = settings.hostURL;

const getMiniLopHocPhan = async MaSV => {
    let res = '';

    var data = new FormData();
    data.append('MaSV', MaSV);

    var requestOptions = {
        method: 'POST',
        body: data,
        redirect: 'follow',
    };

    await fetch(api + 'LopHocPhan/get-subjects.php', requestOptions)
        .then(response => response.json())
        .then(data => {
            res = data;
        })
        .catch(error => console.log('error', error));

    return res;
};

export { getMiniLopHocPhan };
