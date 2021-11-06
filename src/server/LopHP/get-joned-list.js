import { settings } from '../../app/config';

let api = settings.hostURL;

const getJonedList = async (MaGV, MaBaiKT) => {
    let res = '';

    var data = new FormData();
    data.append('MaBaiKT', MaBaiKT);
    data.append('MaGV', MaGV);

    var requestOptions = {
        method: 'POST',
        body: data,
        redirect: 'follow',
    };

    await fetch(api + 'LopHocPhan/get-joined-list.php', requestOptions)
        .then(response => response.json())
        .then(data => {
            res = data;
        })
        .catch(error => console.log('error', error));

    return res;
};

export { getJonedList };
