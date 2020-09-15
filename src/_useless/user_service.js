// import { authHeader } from '../_helpers';
import{ useSelector,useDispatch } from 'react-redux';
import actions from '@/store/ducks/actions';
import store from '@/store';

export const userService = {
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete
};

function login(member_number,password) {
    let formData = new FormData();
    formData.append('member_number', member_number);
    formData.append('password', password);
    formData.append('uniID', 'test2');
    formData.append('OsType', 'ios');
    formData.append('OsVersion', '1');
    formData.append('VersionCode', '1');
    formData.append('BuildNo', '1');
    formData.append('DeviceName', 'test');
  
    fetch('http://yiuonapp.itisdemo.com/api/user/login', {
      method: 'POST',
      headers: {
          // 'Accept': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    })
    .then((response) => response.json())
        .then((responseData) => {
            store.dispatch(actions.loginAction(responseData));

        })
        .catch((err) => {
            console.log(err);
        })
    }


function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`/users`, requestOptions).then(handleResponse);
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`/users/${id}`, requestOptions).then(handleResponse);
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`/users/register`, requestOptions).then(handleResponse);
}

function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`/users/${user.id}`, requestOptions).then(handleResponse);;
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`/users/${id}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}