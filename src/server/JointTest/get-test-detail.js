import { settings } from '../../app/config';

let api = settings.hostURL;

const getTestingDetailt = async (MaBaiKT, sort) => {
    let res = '';

    var data = new FormData();
    data.append('MaBaiKT', MaBaiKT);

    if (sort != undefined && sort != '') data.append('TuXauDenTot', sort);

    var requestOptions = {
        method: 'POST',
        body: data,
        redirect: 'follow',
    };

    await fetch(api + 'ChiTietKQ/get-detail.php', requestOptions)
        .then(response => response.json())
        .then(data => {
            res = data;
            //console.log('API LOGs: jont-test: ', data);
        })
        .catch(error => console.log('error', error));

    return res;
};

export { getTestingDetailt };
