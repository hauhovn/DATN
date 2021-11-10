import { settings } from '../../app/config';

let api = settings.hostURL;

const getLopHocPhan = async (MaSV, isComplete = false) => {
    let res = '';


    var data = new FormData();
    data.append('MaSV', MaSV);
    data.append('isComplete', isComplete);

    var requestOptions = {
        method: 'POST',
        body: data,
        redirect: 'follow',
    };

    await fetch(api + 'LopHocPhan/sv-get-lhp.php', requestOptions)
        .then(response => response.json())
        .then(data => {
            res = data;
        })
        .catch(error => console.log('error', error));

    console.log('res: ', res);
    return res;
};

export { getLopHocPhan };
